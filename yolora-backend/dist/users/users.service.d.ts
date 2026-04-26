import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findNearbyAbleUsers(latitude: number, longitude: number, radiusMeters?: number): Promise<any[]>;
    updateLocation(userId: string, latitude: number, longitude: number): Promise<void>;
    setOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
    findById(userId: string): Promise<User | null>;
    updateFcmToken(userId: string, fcmToken: string): Promise<void>;
}
