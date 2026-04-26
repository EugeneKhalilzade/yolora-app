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
exports.HelpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const help_request_entity_1 = require("./entities/help-request.entity");
const users_service_1 = require("../users/users.service");
let HelpService = class HelpService {
    constructor(helpRequestRepository, usersService) {
        this.helpRequestRepository = helpRequestRepository;
        this.usersService = usersService;
    }
    async createRequest(requesterId, latitude, longitude, description) {
        await this.usersService.updateLocation(requesterId, latitude, longitude);
        const helpRequest = this.helpRequestRepository.create({
            requesterId,
            requesterLatitude: latitude,
            requesterLongitude: longitude,
            description: description || null,
            status: help_request_entity_1.HelpRequestStatus.PENDING,
        });
        const saved = await this.helpRequestRepository.save(helpRequest);
        const nearbyHelpers = await this.usersService.findNearbyAbleUsers(latitude, longitude, 1000);
        return {
            helpRequest: saved,
            nearbyHelpers,
            nearbyCount: nearbyHelpers.length,
        };
    }
    async acceptRequest(requestId, helperId, helperLatitude, helperLongitude) {
        const helpRequest = await this.helpRequestRepository.findOne({
            where: { id: requestId },
            relations: ['requester'],
        });
        if (!helpRequest) {
            throw new common_1.NotFoundException('Help request not found');
        }
        if (helpRequest.status !== help_request_entity_1.HelpRequestStatus.PENDING) {
            throw new common_1.BadRequestException('Help request is no longer available');
        }
        helpRequest.helperId = helperId;
        helpRequest.helperLatitude = helperLatitude;
        helpRequest.helperLongitude = helperLongitude;
        helpRequest.status = help_request_entity_1.HelpRequestStatus.ACCEPTED;
        const saved = await this.helpRequestRepository.save(helpRequest);
        const helper = await this.usersService.findById(helperId);
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
    async rejectRequest(requestId) {
        const helpRequest = await this.helpRequestRepository.findOne({
            where: { id: requestId },
        });
        if (!helpRequest) {
            throw new common_1.NotFoundException('Help request not found');
        }
        helpRequest.status = help_request_entity_1.HelpRequestStatus.CANCELLED;
        return this.helpRequestRepository.save(helpRequest);
    }
    async completeRequest(requestId, rating) {
        const helpRequest = await this.helpRequestRepository.findOne({
            where: { id: requestId },
        });
        if (!helpRequest) {
            throw new common_1.NotFoundException('Help request not found');
        }
        helpRequest.status = help_request_entity_1.HelpRequestStatus.COMPLETED;
        if (rating) {
            helpRequest.rating = rating;
        }
        return this.helpRequestRepository.save(helpRequest);
    }
    async getActiveRequest(userId) {
        return this.helpRequestRepository.findOne({
            where: [
                { requesterId: userId, status: help_request_entity_1.HelpRequestStatus.PENDING },
                { requesterId: userId, status: help_request_entity_1.HelpRequestStatus.ACCEPTED },
                { helperId: userId, status: help_request_entity_1.HelpRequestStatus.ACCEPTED },
            ],
            relations: ['requester', 'helper'],
            order: { createdAt: 'DESC' },
        });
    }
    async getPendingRequestsNearby(latitude, longitude, radiusMeters = 1000) {
        const requests = await this.helpRequestRepository
            .createQueryBuilder('hr')
            .leftJoinAndSelect('hr.requester', 'requester')
            .where('hr.status = :status', { status: help_request_entity_1.HelpRequestStatus.PENDING })
            .andWhere(`ST_DWithin(
          ST_SetSRID(ST_MakePoint(hr."requesterLongitude", hr."requesterLatitude"), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`, { latitude, longitude, radius: radiusMeters })
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
};
exports.HelpService = HelpService;
exports.HelpService = HelpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(help_request_entity_1.HelpRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], HelpService);
//# sourceMappingURL=help.service.js.map