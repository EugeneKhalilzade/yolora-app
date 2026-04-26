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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const firebaseUid = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const user = this.userRepository.create({
            email: dto.email,
            passwordHash,
            firebaseUid,
            displayName: dto.displayName,
            role: dto.role,
            disabilityType: dto.disabilityType || null,
            fcmToken: dto.fcmToken || null,
            isOnline: true,
        });
        const savedUser = await this.userRepository.save(user);
        const payload = {
            sub: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        };
        const token = this.jwtService.sign(payload);
        return {
            user: this.sanitizeUser(savedUser),
            token,
        };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.isOnline = true;
        await this.userRepository.save(user);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        return {
            user: this.sanitizeUser(user),
            token,
        };
    }
    async validateUserById(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            disabilityType: user.disabilityType,
            isOnline: user.isOnline,
            latitude: user.latitude,
            longitude: user.longitude,
            createdAt: user.createdAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map