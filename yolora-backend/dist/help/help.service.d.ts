import { Repository } from 'typeorm';
import { HelpRequest } from './entities/help-request.entity';
import { UsersService } from '../users/users.service';
export declare class HelpService {
    private readonly helpRequestRepository;
    private readonly usersService;
    constructor(helpRequestRepository: Repository<HelpRequest>, usersService: UsersService);
    createRequest(requesterId: string, latitude: number, longitude: number, description?: string): Promise<{
        helpRequest: HelpRequest;
        nearbyHelpers: any[];
        nearbyCount: number;
    }>;
    acceptRequest(requestId: string, helperId: string, helperLatitude: number, helperLongitude: number): Promise<{
        helpRequest: HelpRequest;
        helper: {
            id: string;
            displayName: string;
            latitude: number;
            longitude: number;
        };
    }>;
    rejectRequest(requestId: string): Promise<HelpRequest>;
    completeRequest(requestId: string, rating?: number): Promise<HelpRequest>;
    getActiveRequest(userId: string): Promise<HelpRequest | null>;
    getPendingRequestsNearby(latitude: number, longitude: number, radiusMeters?: number): Promise<{
        id: string;
        requester: {
            id: string;
            displayName: string;
            disabilityType: import("../users/entities/user.entity").DisabilityType | null;
        };
        latitude: number;
        longitude: number;
        description: string | null;
        createdAt: Date;
    }[]>;
}
