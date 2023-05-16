import { Injectable } from '@nestjs/common';
import { BetDto } from '../user_bets/dto/place-bet.dto';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { Bet } from '../bets/entities/bet.entity';
import { UserBet } from '../user_bets/entities/user_bet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(UserBet)
    private readonly userBetRepository: Repository<UserBet>
  ) {}

  async createTransaction(
    user: User,
    bets: BetDto[],
    type: TransactionCategoryEnum,
  ): Promise<any> {
    for (const betDto of bets) {
      console.log("entro")
      const transaction = new Transaction();
      transaction.amount = betDto.amount;
      transaction.category = type;
      transaction.user = user;
      // Set any other necessary properties for the transaction
      const user_bet = await this.getUserBetIdByBetId(betDto.bet_id ,user.id)
      return {user_bet}
      // transaction.userBet = user_bet
      // // Guardar la transacción en la base de datos
      // await this.transactionRepository.save(transaction);
    }
  }

  // Obtener el user_bet_id basado en el bet_id
  async getUserBetIdByBetId(
    bet_id: number,
    user_id: number,
  ): Promise<UserBet> {
    const userBetQueryBuilder = this.userBetRepository.createQueryBuilder('user_bet');
    const userBet = await userBetQueryBuilder
      .where('user_bet.bet_id = :bet_id', { bet_id })
      .andWhere('user_bet.user_id = :user_id', { user_id })
      .getOne();

    console.log(userBetQueryBuilder.getSql())
    return userBet;
  }
}
