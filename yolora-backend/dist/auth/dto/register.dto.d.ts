import { DisabilityType, UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    disabilityType?: DisabilityType;
    fcmToken?: string;
}
