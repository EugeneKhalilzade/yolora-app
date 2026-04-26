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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findNearbyAbleUsers(latitude, longitude, radiusMeters = 1000) {
        const users = await this.userRepository
            .createQueryBuilder('user')
            .select([
            'user.id',
            'user.displayName',
            'user.email',
            'user.role',
            'user.latitude',
            'user.longitude',
            'user.isOnline',
        ])
            .addSelect(`ST_DistanceSphere(
          user.location,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )`, 'distance')
            .where('user.role = :role', { role: user_entity_1.UserRole.ABLE })
            .andWhere('user.isOnline = :isOnline', { isOnline: true })
            .andWhere('user.location IS NOT NULL')
            .andWhere(`ST_DWithin(
          user.location::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`, { latitude, longitude, radius: radiusMeters })
            .orderBy('distance', 'ASC')
            .getRawMany();
        return users.map((u) => ({
            id: u.user_id,
            displayName: u.user_displayName,
            email: u.user_email,
            role: u.user_role,
            latitude: u.user_latitude,
            longitude: u.user_longitude,
            isOnline: u.user_isOnline,
            distance: Math.round(parseFloat(u.distance)),
        }));
    }
    async updateLocation(userId, latitude, longitude) {
        await this.userRepository
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set({
            latitude,
            longitude,
            location: () => `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
        })
            .where('id = :id', { id: userId })
            .execute();
    }
    async setOnlineStatus(userId, isOnline) {
        await this.userRepository.update(userId, { isOnline });
    }
    async findById(userId) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
    async updateFcmToken(userId, fcmToken) {
        await this.userRepository.update(userId, { fcmToken });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map