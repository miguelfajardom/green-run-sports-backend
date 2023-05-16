import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';

@ApiBearerAuth()
@ApiTags('Administrators')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('block-user')
  blockUser(@Body() blockUserDto: BlockorActivateUserDto) {
    return this.adminsService.blockUser(blockUserDto);
  }

  @Post('activate-user')
  activateUser(@Body() activateUserDto: BlockorActivateUserDto) {
    return this.adminsService.activateUser(activateUserDto);
  }
}
