import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HelpService } from './help.service';

@Controller('help')
@UseGuards(AuthGuard('jwt'))
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Post('request')
  async createRequest(
    @Request() req,
    @Body() body: { latitude: number; longitude: number; description?: string },
  ) {
    return this.helpService.createRequest(
      req.user.id,
      body.latitude,
      body.longitude,
      body.description,
    );
  }

  @Post('accept/:id')
  async acceptRequest(
    @Request() req,
    @Param('id') requestId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.helpService.acceptRequest(
      requestId,
      req.user.id,
      body.latitude,
      body.longitude,
    );
  }

  @Post('reject/:id')
  async rejectRequest(@Request() req, @Param('id') requestId: string) {
    return this.helpService.rejectRequest(requestId, req.user.id);
  }

  @Post('complete/:id')
  async completeRequest(
    @Param('id') requestId: string,
    @Body() body: { rating?: number },
  ) {
    return this.helpService.completeRequest(requestId, body.rating);
  }

  @Get('active')
  async getActiveRequest(@Request() req) {
    return this.helpService.getActiveRequest(req.user.id);
  }

  @Get('nearby')
  async getNearbyRequests(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.helpService.getPendingRequestsNearby(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }
}
