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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'List all bets' })
  @ApiQuery({
    name: 'sport_id',
    required: false,
    type: 'number',
    description:
      'Filter by sport ID (optional). Possible sports: 1-Football, 2-Tennis, 3-Basketball, 4-Golf',
  })
  @ApiQuery({
    name: 'event_id',
    required: false,
    type: 'number',
    description: 'Filter by event ID (optional)',
  })
  listBets(
    @Query('sport_id') sport_id: number,
    @Query('event_id') event_id: number,
  ) {
    return this.betsService.listBets(sport_id, event_id);
  }

  @Put('cancel-bet/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Cancel a specific bet' })
  @ApiParam({name: 'id', description: 'Bet id to cancel.'})
  cancelBet(@Param('id') id: number) {
    return this.betsService.cancelBet(id);
  }

  @Put('active-bet/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Activate a specific bet' })
  @ApiParam({name: 'id', description: 'Bet id to activate.'})
  activeBet(@Param('id') id: number) {
    return this.betsService.activeBet(id);
  }

  @Put('settle-results/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Settle results for a specific bet' })
  @ApiParam({name: 'id', description: 'Represents the ID of the event for which the bets will be settled.'})
  settleBetsResults(
    @Param('id') event_id: number,
    @Body() settleBetsDto: SettleBetDto,
    @User() user: UserTokenInterface,
  ) {
    return this.betsService.settleBetsResults(user, settleBetsDto, event_id);
  }
}
