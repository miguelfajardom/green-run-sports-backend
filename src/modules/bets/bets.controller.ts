import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, Put } from '@nestjs/common';
import { BetsService } from './bets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateBetDto } from './dto/update-bet.dto';
import { UserGuard } from '../auth/guards/user.guard';
import { PlaceBetDto } from '../user_bets/dto/place-bet.dto';

@ApiBearerAuth()
@ApiTags('Bets')
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Get('list-bets')
  @UseGuards(AdminGuard)
  listBets(
    @Query('sport_id') sport_id?: number,
    @Query('event_id') event_id?: number,
  ){
    return this.betsService.listBets(sport_id, event_id)
  }

  @Put('update-bet/:id')
  @UseGuards(AdminGuard)
  updateBet(@Param('id') id: number, @Body() updateBetDto: UpdateBetDto){
    return this.betsService.updateBet(id, updateBetDto)
  }
}
