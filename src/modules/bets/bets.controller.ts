import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateBetDto } from './dto/update-bet.dto';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { User } from 'src/common/decorators/user.decorator';
import { SettleBetDto } from './dto/settled-bet.dto';

@ApiBearerAuth()
@Controller('bets')
@ApiTags('Administrators')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Get('list-bets')
  @UseGuards(AdminGuard)
  
  listBets(
    @Query('sport_id') sport_id?: number,
    @Query('event_id') event_id?: number,
  ) {
    return this.betsService.listBets(sport_id, event_id);
  }

  @Put('update-bet/:id')
  @UseGuards(AdminGuard)
  changeBetStatus(@Param('id') id: number, @Body() updateBetDto: UpdateBetDto) {
    return this.betsService.changeBetStatus(id, updateBetDto);
  }

  @Put('cancel-bet/:id')
  @UseGuards(AdminGuard)
  cancelBet(@Param('id') id: number) {
    return this.betsService.cancelBet(id);
  }

  @Put('active-bet/:id')
  @UseGuards(AdminGuard)
  activeBet(@Param('id') id: number) {
    return this.betsService.activeBet(id);
  }

  @Put('settle-results/:id')
  @UseGuards(AdminGuard)
  settleBetsResults(
    @Param('id') event_id: number,
    @Body() settleBetsDto: SettleBetDto,
    @User() user: UserTokenInterface,
  ) {
    return this.betsService.settleBetsResults(user, settleBetsDto, event_id);
  }
}
