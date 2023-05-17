import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BetDto } from '../user_bets/dto/place-bet.dto';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { Bet } from '../bets/entities/bet.entity';
import { UserBet } from '../user_bets/entities/user_bet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { validateUserStatus } from 'src/utils/user.utils';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(UserBet)
    private readonly userBetRepository: Repository<UserBet>,
    @InjectRepository(User)
    private readonly userReposiroty: Repository<User>,
  ) {}

  async createBetTransaction(
    user: User,
    createdBets: UserBet[],
    type: TransactionCategoryEnum,
  ): Promise<any> {
    try {
      for (const bet of createdBets) {
        const transaction = new Transaction();
        transaction.user_id = user.id;
        transaction.amount = bet.amount;
        transaction.category = type;
        await this.transactionRepository.save(transaction);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createDepositTransaction(
    user: User,
    depositDto: CreateTransactionDto,
  ): Promise<any> {
    try {
      depositDto.user_id = user.id;
      await this.transactionRepository.save(depositDto);
    } catch (error) {
      throw new HttpException(
        { message: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createWinningTransaction(
    winningDto: CreateTransactionDto,
  ): Promise<any> {
    try {
      
      await validateUserStatus(winningDto.user_id, this.userReposiroty)
      winningDto.category = TransactionCategoryEnum.WINNING
      await this.transactionRepository.save(winningDto);

    } catch (error) {
      throw new HttpException(
        { message: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserBetIdByBetId(bet_id: number, user_id: number): Promise<UserBet> {
    const userBetQueryBuilder =
      this.userBetRepository.createQueryBuilder('user_bet');
    const userBet = await userBetQueryBuilder
      .where('user_bet.bet_id = :bet_id', { bet_id })
      .andWhere('user_bet.user_id = :user_id', { user_id })
      .getOne();

    return userBet;
  }
  
}
