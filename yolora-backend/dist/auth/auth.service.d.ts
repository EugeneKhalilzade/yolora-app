import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            displayName: string;
            role: import("../users/entities/user.entity").UserRole;
            disabilityType: import("../users/entities/user.entity").DisabilityType | null;
            isOnline: boolean;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            displayName: string;
            role: import("../users/entities/user.entity").UserRole;
            disabilityType: import("../users/entities/user.entity").DisabilityType | null;
            isOnline: boolean;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
        };
        token: string;
    }>;
    validateUserById(userId: string): Promise<User>;
    private sanitizeUser;
}
