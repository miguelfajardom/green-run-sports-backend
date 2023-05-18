import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { Bet } from './entities/bet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Event } from '../../common/entities/event.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UserBet } from '../user_bets/entities/user_bet.entity';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, User, Event, Transaction, UserBet])],
  controllers: [BetsController],
  providers: [BetsService, TransactionsService]
})
export class BetsModule {}
