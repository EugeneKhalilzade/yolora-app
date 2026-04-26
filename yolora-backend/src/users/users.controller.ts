import {
  Controller,
  Get,
  Patch,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('nearby')
  @UseGuards(AuthGuard('jwt'))
  async getNearbyUsers(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
  ) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = radius ? parseInt(radius, 10) : 1000;

    return this.usersService.findNearbyAbleUsers(lat, lng, rad);
  }

  @Patch('location')
  @UseGuards(AuthGuard('jwt'))
  async updateLocation(
    @Request() req,
    @Body() body: { latitude: number; longitude: number },
  ) {
    await this.usersService.updateLocation(req.user.id, body.latitude, body.longitude);
    return { message: 'Location updated' };
  }

  @Patch('fcm-token')
  @UseGuards(AuthGuard('jwt'))
  async updateFcmToken(
    @Request() req,
    @Body() body: { fcmToken: string },
  ) {
    await this.usersService.updateFcmToken(req.user.id, body.fcmToken);
    return { message: 'FCM token updated' };
  }
}
