"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
let EventsGateway = class EventsGateway {
    constructor(usersService) {
        this.usersService = usersService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.connectedUsers.set(userId, client.id);
            await this.usersService.setOnlineStatus(userId, true);
            console.log(`✅ User connected: ${userId} (socket: ${client.id})`);
        }
    }
    async handleDisconnect(client) {
        const userId = this.getUserIdBySocketId(client.id);
        if (userId) {
            this.connectedUsers.delete(userId);
            await this.usersService.setOnlineStatus(userId, false);
            console.log(`❌ User disconnected: ${userId}`);
        }
    }
    async handleLocationUpdate(client, data) {
        await this.usersService.updateLocation(data.userId, data.latitude, data.longitude);
        client.broadcast.emit('user_location_changed', {
            userId: data.userId,
            latitude: data.latitude,
            longitude: data.longitude,
        });
    }
    emitNewHelpRequest(targetUserIds, helpRequest) {
        for (const userId of targetUserIds) {
            const socketId = this.connectedUsers.get(userId);
            if (socketId) {
                this.server.to(socketId).emit('new_help_request', helpRequest);
            }
        }
    }
    emitRequestAccepted(requesterId, data) {
        const socketId = this.connectedUsers.get(requesterId);
        if (socketId) {
            this.server.to(socketId).emit('request_accepted', data);
        }
    }
    handleHelperLocation(client, data) {
        const socketId = this.connectedUsers.get(data.requesterId);
        if (socketId) {
            this.server.to(socketId).emit('helper_location', {
                latitude: data.latitude,
                longitude: data.longitude,
            });
        }
    }
    emitRequestCompleted(userIds, requestId) {
        for (const userId of userIds) {
            const socketId = this.connectedUsers.get(userId);
            if (socketId) {
                this.server.to(socketId).emit('request_completed', { requestId });
            }
        }
    }
    getUserIdBySocketId(socketId) {
        for (const [userId, sid] of this.connectedUsers.entries()) {
            if (sid === socketId)
                return userId;
        }
        return undefined;
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('location_update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('helper_location'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleHelperLocation", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map