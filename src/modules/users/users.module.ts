import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { UserBet } from '../user_bets/entities/user_bet.entity';
import { Event } from 'src/common/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, UserBet, Event])],
  controllers: [UsersController],
  providers: [
    UsersService,
    TransactionsService
  ]
})
export class UsersModule {}
