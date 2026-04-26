import { HelpService } from './help.service';
export declare class HelpController {
    private readonly helpService;
    constructor(helpService: HelpService);
    createRequest(req: any, body: {
        latitude: number;
        longitude: number;
        description?: string;
    }): Promise<{
        helpRequest: import("./entities/help-request.entity").HelpRequest;
        nearbyHelpers: any[];
        nearbyCount: number;
    }>;
    acceptRequest(req: any, requestId: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<{
        helpRequest: import("./entities/help-request.entity").HelpRequest;
        helper: {
            id: string;
            displayName: string;
            latitude: number;
            longitude: number;
        };
    }>;
    rejectRequest(requestId: string): Promise<import("./entities/help-request.entity").HelpRequest>;
    completeRequest(requestId: string, body: {
        rating?: number;
    }): Promise<import("./entities/help-request.entity").HelpRequest>;
    getActiveRequest(req: any): Promise<import("./entities/help-request.entity").HelpRequest | null>;
    getNearbyRequests(latitude: string, longitude: string): Promise<{
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
