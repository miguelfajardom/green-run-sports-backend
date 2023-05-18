import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserBetsService } from './user_bets.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../auth/guards/user.guard';
import { User } from 'src/common/decorators/user.decorator';
import { PlaceBetDto } from './dto/place-bet.dto';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user-bets')
export class UserBetsController {
  constructor(private readonly userBetsService: UserBetsService) {}

  @Post('place-bet')
  @ApiOperation({ summary: 'Place one or multiple bets' })
  @UseGuards(UserGuard)
  placeBet(
    @Body() placeBetDto: PlaceBetDto,
    @User() user: UserTokenInterface,
  ): Promise<any> {
    return this.userBetsService.placeBet(user, placeBetDto);
  }
}
