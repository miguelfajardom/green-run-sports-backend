import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserBet } from '../user_bets/entities/user_bet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, UserBet])],
  providers: [TransactionsService]
})
export class TransactionsModule {}
