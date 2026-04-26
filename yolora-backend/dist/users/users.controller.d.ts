import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getNearbyUsers(latitude: string, longitude: string, radius?: string): Promise<any[]>;
    updateLocation(req: any, body: {
        latitude: number;
        longitude: number;
    }): Promise<{
        message: string;
    }>;
    updateFcmToken(req: any, body: {
        fcmToken: string;
    }): Promise<{
        message: string;
    }>;
}
