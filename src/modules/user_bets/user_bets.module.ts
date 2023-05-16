import { Module } from '@nestjs/common';
import { UserBetsService } from './user_bets.service';
import { UserBetsController } from './user_bets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBet } from './entities/user_bet.entity';
import { User } from '../users/entities/user.entity';
import { Bet } from '../bets/entities/bet.entity';
import { Event } from '../events/entities/event.entity';
import { UsersService } from '../users/users.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBet, User, Bet, Event, Transaction])],
  controllers: [UserBetsController],
  providers: [UserBetsService, UsersService, TransactionsService]
})
export class UserBetsModule {}
