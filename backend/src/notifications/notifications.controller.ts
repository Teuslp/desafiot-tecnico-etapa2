import { Controller, Get, Patch, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getUnread(@Request() req) {
    return this.notificationsService.getUnread(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
