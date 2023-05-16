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
import { User } from 'src/common/decorators/user.decorator';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';

@ApiBearerAuth()
@ApiTags('Administrators')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('block-user')
  blockUser(
    @Body() blockUserDto: BlockorActivateUserDto,
    @User() user: UserTokenInterface,
    ) {
    return this.adminsService.blockUser(user, blockUserDto);
  }

  @Post('activate-user')
  activateUser(@Body() activateUserDto: BlockorActivateUserDto) {
    return this.adminsService.activateUser(activateUserDto);
  }
}
