import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { DisabilityType, UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(DisabilityType)
  disabilityType?: DisabilityType;

  @IsOptional()
  @IsString()
  fcmToken?: string;

  @IsOptional()
  @IsString()
  firebaseUid?: string;
}
