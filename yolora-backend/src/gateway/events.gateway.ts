import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map userId -> socketId
  private connectedUsers = new Map<string, string>();

  constructor(private readonly usersService: UsersService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      await this.usersService.setOnlineStatus(userId, true);
      console.log(`✅ User connected: ${userId} (socket: ${client.id})`);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.getUserIdBySocketId(client.id);
    if (userId) {
      this.connectedUsers.delete(userId);
      await this.usersService.setOnlineStatus(userId, false);
      console.log(`❌ User disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('location_update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; latitude: number; longitude: number },
  ) {
    await this.usersService.updateLocation(data.userId, data.latitude, data.longitude);

    // Broadcast to all connected clients (for map updates)
    client.broadcast.emit('user_location_changed', {
      userId: data.userId,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }

  /**
   * Emit a new help request to specific nearby users.
   */
  emitNewHelpRequest(
    targetUserIds: string[],
    helpRequest: {
      id: string;
      requesterId: string;
      requesterName: string;
      disabilityType: string;
      latitude: number;
      longitude: number;
      description?: string;
    },
  ) {
    for (const userId of targetUserIds) {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('new_help_request', helpRequest);
      }
    }
  }

  /**
   * Notify the requester that their request was accepted.
   */
  emitRequestAccepted(
    requesterId: string,
    data: {
      requestId: string;
      helperId: string;
      helperName: string;
      helperLatitude: number;
      helperLongitude: number;
    },
  ) {
    const socketId = this.connectedUsers.get(requesterId);
    if (socketId) {
      this.server.to(socketId).emit('request_accepted', data);
    }
  }

  /**
   * Send helper location updates to the requester.
   */
  @SubscribeMessage('helper_location')
  handleHelperLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requesterId: string; latitude: number; longitude: number },
  ) {
    const socketId = this.connectedUsers.get(data.requesterId);
    if (socketId) {
      this.server.to(socketId).emit('helper_location', {
        latitude: data.latitude,
        longitude: data.longitude,
      });
    }
  }

  /**
   * Notify that a request is completed.
   */
  emitRequestCompleted(userIds: string[], requestId: string) {
    for (const userId of userIds) {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('request_completed', { requestId });
      }
    }
  }

  private getUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, sid] of this.connectedUsers.entries()) {
      if (sid === socketId) return userId;
    }
    return undefined;
  }
}
