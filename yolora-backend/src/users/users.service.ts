import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findNearbyUsers(
    latitude: number,
    longitude: number,
    radiusMeters: number = 1000,
    role?: UserRole,
    excludeUserId?: string,
  ): Promise<any[]> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.displayName',
        'user.email',
        'user.role',
        'user.disabilityType',
        'user.latitude',
        'user.longitude',
        'user.isOnline',
      ])
      .addSelect(
        `ST_DistanceSphere(
          user.location,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )`,
        'distance',
      )
      .where('user.isOnline = :isOnline', { isOnline: true })
      .andWhere('user.location IS NOT NULL')
      .andWhere(
        `ST_DWithin(
          user.location::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`,
        { latitude, longitude, radius: radiusMeters },
      );

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (excludeUserId) {
      qb.andWhere('user.id != :excludeUserId', { excludeUserId });
    }

    const users = await qb.orderBy('distance', 'ASC').getRawMany();

    return users.map((u) => ({
      id: u.user_id,
      displayName: u.user_displayName,
      email: u.user_email,
      role: u.user_role,
      disabilityType: u.user_disabilityType,
      latitude: u.user_latitude,
      longitude: u.user_longitude,
      isOnline: u.user_isOnline,
      distance: Math.round(parseFloat(u.distance)),
    }));
  }

  async findNearbyAbleUsers(
    latitude: number,
    longitude: number,
    radiusMeters: number = 1000,
  ): Promise<any[]> {
    return this.findNearbyUsers(latitude, longitude, radiusMeters, UserRole.ABLE);
  }

  /**
   * Update user's location (both lat/lng columns and PostGIS geometry).
   */
  async updateLocation(userId: string, latitude: number, longitude: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        latitude,
        longitude,
        location: () => `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
      })
      .where('id = :id', { id: userId })
      .execute();
  }

  /**
   * Set user online/offline status.
   */
  async setOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.userRepository.update(userId, { isOnline });
  }

  /**
   * Find a user by ID.
   */
  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByIds(userIds: string[]): Promise<User[]> {
    if (!userIds.length) {
      return [];
    }
    return this.userRepository.find({
      where: { id: In(userIds) },
    });
  }

  /**
   * Update FCM token.
   */
  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    await this.userRepository.update(userId, { fcmToken });
  }
}
