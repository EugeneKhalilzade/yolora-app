import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Use Firebase UID when available; otherwise generate a local fallback for demo mode.
    const firebaseUid =
      dto.firebaseUid || `local_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    // Create user
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

    // Generate JWT
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

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Mark user as online
    user.isOnline = true;
    await this.userRepository.save(user);

    // Generate JWT
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

  async validateUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private sanitizeUser(user: User) {
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
}
