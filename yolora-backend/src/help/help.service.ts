import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpRequest, HelpRequestStatus } from './entities/help-request.entity';
import { UsersService } from '../users/users.service';
import { EventsGateway } from '../gateway/events.gateway';
import { UserRole } from '../users/entities/user.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class HelpService {
  private readonly isFirebaseMessagingEnabled: boolean;

  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
    private readonly usersService: UsersService,
    private readonly eventsGateway: EventsGateway,
  ) {
    this.isFirebaseMessagingEnabled = this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin(): boolean {
    if (admin.apps.length > 0) {
      return true;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      return false;
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return true;
    } catch (error) {
      console.error('Firebase admin initialization failed:', error);
      return false;
    }
  }

  private async notifyNearbyHelpers(
    helperUserIds: string[],
    requestId: string,
    requesterName: string,
    description?: string,
  ): Promise<{ enabled: boolean; attempted: number; sent: number }> {
    if (!this.isFirebaseMessagingEnabled) {
      return { enabled: false, attempted: 0, sent: 0 };
    }

    const helperUsers = await this.usersService.findByIds(helperUserIds);
    const tokens = helperUsers
      .map((user) => user.fcmToken)
      .filter((token): token is string => typeof token === 'string' && token.length > 0);

    if (!tokens.length) {
      return { enabled: true, attempted: 0, sent: 0 };
    }

    let response: admin.messaging.BatchResponse;
    try {
      response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title: 'New help request nearby',
          body: description
            ? `${requesterName}: ${description}`
            : `${requesterName} needs nearby assistance.`,
        },
        data: {
          type: 'help_request',
          requestId,
        },
      });
    } catch (error) {
      console.error('Failed to dispatch FCM notifications:', error);
      return { enabled: true, attempted: tokens.length, sent: 0 };
    }

    return {
      enabled: true,
      attempted: tokens.length,
      sent: response.successCount,
    };
  }

  /**
   * Create a new help request from a disabled user.
   */
  async createRequest(
    requesterId: string,
    latitude: number,
    longitude: number,
    description?: string,
  ) {
    const requester = await this.usersService.findById(requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    if (requester.role !== UserRole.DISABLED) {
      throw new BadRequestException('Only disabled users can create help requests');
    }

    const existingActiveRequest = await this.helpRequestRepository.findOne({
      where: [
        { requesterId, status: HelpRequestStatus.PENDING },
        { requesterId, status: HelpRequestStatus.ACCEPTED },
      ],
      order: { createdAt: 'DESC' },
    });

    if (existingActiveRequest) {
      throw new BadRequestException('You already have an active help request');
    }

    // Update requester's location
    await this.usersService.updateLocation(requesterId, latitude, longitude);

    // Create the help request
    const helpRequest = this.helpRequestRepository.create({
      requesterId,
      requesterLatitude: latitude,
      requesterLongitude: longitude,
      description: description || null,
      status: HelpRequestStatus.PENDING,
    });

    const saved = await this.helpRequestRepository.save(helpRequest);

    // Find nearby able users
    const nearbyHelpers = await this.usersService.findNearbyAbleUsers(
      latitude,
      longitude,
      1000,
    );

    const targetUserIds = nearbyHelpers.map((helper) => helper.id);

    this.eventsGateway.emitNewHelpRequest(targetUserIds, {
      id: saved.id,
      requesterId,
      requesterName: requester.displayName,
      disabilityType: requester.disabilityType || 'unknown',
      latitude,
      longitude,
      description,
    });

    const notifications = await this.notifyNearbyHelpers(
      targetUserIds,
      saved.id,
      requester.displayName,
      description,
    );

    return {
      helpRequest: saved,
      nearbyHelpers,
      nearbyCount: nearbyHelpers.length,
      notifications,
    };
  }

  /**
   * Accept a help request (from an able user).
   */
  async acceptRequest(
    requestId: string,
    helperId: string,
    helperLatitude: number,
    helperLongitude: number,
  ) {
    const helpRequest = await this.helpRequestRepository.findOne({
      where: { id: requestId },
      relations: ['requester'],
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    const helper = await this.usersService.findById(helperId);
    if (!helper || helper.role !== UserRole.ABLE) {
      throw new BadRequestException('Only able users can accept help requests');
    }

    if (helpRequest.status !== HelpRequestStatus.PENDING) {
      throw new BadRequestException('Help request is no longer available');
    }

    await this.usersService.updateLocation(helperId, helperLatitude, helperLongitude);

    // Update the help request
    helpRequest.helperId = helperId;
    helpRequest.helperLatitude = helperLatitude;
    helpRequest.helperLongitude = helperLongitude;
    helpRequest.status = HelpRequestStatus.ACCEPTED;

    const saved = await this.helpRequestRepository.save(helpRequest);

    this.eventsGateway.emitRequestAccepted(helpRequest.requesterId, {
      requestId: saved.id,
      helperId,
      helperName: helper.displayName,
      helperLatitude,
      helperLongitude,
    });

    return {
      helpRequest: saved,
      helper: {
        id: helper.id,
        displayName: helper.displayName,
        latitude: helperLatitude,
        longitude: helperLongitude,
      },
    };
  }

  /**
   * Reject / cancel a help request.
   */
  async rejectRequest(requestId: string, actorUserId: string) {
    const helpRequest = await this.helpRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    if (helpRequest.requesterId === actorUserId) {
      helpRequest.status = HelpRequestStatus.CANCELLED;
      const saved = await this.helpRequestRepository.save(helpRequest);
      const affectedUserIds = [saved.requesterId, saved.helperId].filter(
        (id): id is string => typeof id === 'string',
      );
      this.eventsGateway.emitRequestCompleted(affectedUserIds, saved.id);
      return saved;
    }

    if (helpRequest.status !== HelpRequestStatus.PENDING) {
      throw new BadRequestException('Help request is no longer pending');
    }

    return { message: 'Request skipped by helper' };
  }

  /**
   * Complete a help request.
   */
  async completeRequest(requestId: string, rating?: number) {
    const helpRequest = await this.helpRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    helpRequest.status = HelpRequestStatus.COMPLETED;
    if (rating !== undefined) {
      helpRequest.rating = rating;
    }

    const saved = await this.helpRequestRepository.save(helpRequest);
    const affectedUserIds = [saved.requesterId, saved.helperId].filter(
      (id): id is string => typeof id === 'string',
    );
    this.eventsGateway.emitRequestCompleted(affectedUserIds, saved.id);
    return saved;
  }

  /**
   * Get active help request for a user.
   */
  async getActiveRequest(userId: string) {
    return this.helpRequestRepository.findOne({
      where: [
        { requesterId: userId, status: HelpRequestStatus.PENDING },
        { requesterId: userId, status: HelpRequestStatus.ACCEPTED },
        { helperId: userId, status: HelpRequestStatus.ACCEPTED },
      ],
      relations: ['requester', 'helper'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get pending help requests near a location (for able users).
   */
  async getPendingRequestsNearby(latitude: number, longitude: number, radiusMeters: number = 1000) {
    const { entities, raw } = await this.helpRequestRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.requester', 'requester')
      .addSelect(
        `ST_DistanceSphere(
          ST_SetSRID(ST_MakePoint(hr."requesterLongitude", hr."requesterLatitude"), 4326),
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )`,
        'distance',
      )
      .where('hr.status = :status', { status: HelpRequestStatus.PENDING })
      .andWhere(
        `ST_DWithin(
          ST_SetSRID(ST_MakePoint(hr."requesterLongitude", hr."requesterLatitude"), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`,
        { latitude, longitude, radius: radiusMeters },
      )
      .orderBy('hr.createdAt', 'DESC')
      .getRawAndEntities();

    return entities.map((r, index) => ({
      id: r.id,
      requester: {
        id: r.requester.id,
        displayName: r.requester.displayName,
        disabilityType: r.requester.disabilityType,
      },
      latitude: r.requesterLatitude,
      longitude: r.requesterLongitude,
      description: r.description,
      createdAt: r.createdAt,
      distance: Math.round(parseFloat(raw[index]?.distance || '0')),
    }));
  }
}
