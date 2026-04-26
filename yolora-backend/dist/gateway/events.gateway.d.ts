import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly usersService;
    server: Server;
    private connectedUsers;
    constructor(usersService: UsersService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleLocationUpdate(client: Socket, data: {
        userId: string;
        latitude: number;
        longitude: number;
    }): Promise<void>;
    emitNewHelpRequest(targetUserIds: string[], helpRequest: {
        id: string;
        requesterId: string;
        requesterName: string;
        disabilityType: string;
        latitude: number;
        longitude: number;
        description?: string;
    }): void;
    emitRequestAccepted(requesterId: string, data: {
        requestId: string;
        helperId: string;
        helperName: string;
        helperLatitude: number;
        helperLongitude: number;
    }): void;
    handleHelperLocation(client: Socket, data: {
        requesterId: string;
        latitude: number;
        longitude: number;
    }): void;
    emitRequestCompleted(userIds: string[], requestId: string): void;
    private getUserIdBySocketId;
}
