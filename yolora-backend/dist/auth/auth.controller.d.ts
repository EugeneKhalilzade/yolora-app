import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
