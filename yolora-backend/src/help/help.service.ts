import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpRequest, HelpRequestStatus } from './entities/help-request.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(HelpRequest)
    private readonly helpRequestRepository: Repository<HelpRequest>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new help request from a disabled user.
   */
  async createRequest(
    requesterId: string,
    latitude: number,
    longitude: number,
    description?: string,
  ) {
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

    return {
      helpRequest: saved,
      nearbyHelpers,
      nearbyCount: nearbyHelpers.length,
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

    if (helpRequest.status !== HelpRequestStatus.PENDING) {
      throw new BadRequestException('Help request is no longer available');
    }

    // Update the help request
    helpRequest.helperId = helperId;
    helpRequest.helperLatitude = helperLatitude;
    helpRequest.helperLongitude = helperLongitude;
    helpRequest.status = HelpRequestStatus.ACCEPTED;

    const saved = await this.helpRequestRepository.save(helpRequest);

    // Get helper info
    const helper = await this.usersService.findById(helperId);

    return {
      helpRequest: saved,
      helper: {
        id: helper!.id,
        displayName: helper!.displayName,
        latitude: helperLatitude,
        longitude: helperLongitude,
      },
    };
  }

  /**
   * Reject / cancel a help request.
   */
  async rejectRequest(requestId: string) {
    const helpRequest = await this.helpRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    helpRequest.status = HelpRequestStatus.CANCELLED;
    return this.helpRequestRepository.save(helpRequest);
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
    if (rating) {
      helpRequest.rating = rating;
    }

    return this.helpRequestRepository.save(helpRequest);
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
    const requests = await this.helpRequestRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.requester', 'requester')
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
      .getMany();

    return requests.map((r) => ({
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
    }));
  }
}
