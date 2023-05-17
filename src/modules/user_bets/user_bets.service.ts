import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from '../bets/entities/bet.entity';
import { User } from '../users/entities/user.entity';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { BetDto, PlaceBetDto } from './dto/place-bet.dto';
import { UsersService } from '../users/users.service';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { TransactionsService } from '../transactions/transactions.service';
import { UserBet } from './entities/user_bet.entity';
import { calculateUserBalance, validateUserStatus } from 'src/utils/user.utils';
import { BetNotElegibleException, InsufficientFundsException } from 'src/utils/exceptions.utils';
import { MessageResponse } from 'src/utils/message-response.enum';

@Injectable()
export class UserBetsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(UserBet)
    private readonly userBetRepository: Repository<UserBet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly userService: UsersService,
    private readonly transactionService: TransactionsService,
  ) {}

  async placeBet(
    user: UserTokenInterface,
    placeBetDto: PlaceBetDto,
  ): Promise<any> {
    try {
      const findUser = await validateUserStatus(user.id, this.userRepository);

      for (let bet of placeBetDto.bets) {
        bet.user_id = user.id;
      }

      const userBalance = await calculateUserBalance(
        user.id,
        this.userRepository,
      );

      await this.validateSufficientBalance(userBalance, placeBetDto.bets);
      await this.validateBetsStatus(placeBetDto.bets);
      await this.validateBetEvent(placeBetDto.bets);
      await this.addOddToBet(placeBetDto.bets);

      const entities = await Promise.all(
        placeBetDto.bets.map((bet) => this.convertDtoToEntity(bet)),
      );

      const saveEntities = await this.userBetRepository.save(entities);

      await this.transactionService.createBetTransaction(
        findUser,
        saveEntities,
        TransactionCategoryEnum.BET,
      );

      return {
        status: HttpStatus.OK,
        message: MessageResponse.PLACED_BETS_SUCCESSFULLY,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async validateSufficientBalance(
    userBalance: number,
    bets: BetDto[],
  ): Promise<boolean> {
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

    if (totalBetAmount > userBalance) {
      throw new InsufficientFundsException();
    }
    return false;
  }

  async validateBetsStatus(bets: BetDto[]): Promise<any> {
    try {
      for (const betDto of bets) {
        const bet = await this.betRepository.findOneBy({ id: betDto.bet_id });
        if (
          !bet ||
          bet.status === BetStatusEnum.CANCELLED ||
          bet.status === BetStatusEnum.SETTLED
        ) {
          throw new BetNotElegibleException()
        }
      }
      return true;
    } catch (error) {
      throw error
    }
  }

  async validateBetEvent(bets: BetDto[]): Promise<boolean> {
    for (const betDto of bets) {
      const betExists = await this.betRepository
        .createQueryBuilder('bet')
        .where('bet.id = :bet_id', { bet_id: betDto.bet_id })
        .andWhere('bet.event_id = :event_id', { event_id: betDto.event_id })
        .getOne();
      if (!betExists) {
        throw new HttpException(
          `Invalid bet ID ${betDto.bet_id} for the specified event ${betDto.event_id}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return true;
  }

  async addOddToBet(bets: BetDto[]): Promise<BetDto[]> {
    for (const betDto of bets) {
      const bet = await this.betRepository.findOneBy({ id: betDto.bet_id });
      if (bet) {
        betDto.odd = bet.odd;
      }
    }

    return bets;
  }

  async createTransaction(user: User, bets: BetDto[]): Promise<void> {
    for (const betDto of bets) {
      const transaction = new Transaction();
      transaction.amount = betDto.amount;
      transaction.category = TransactionCategoryEnum.BET;
      transaction.user = user;

      await this.transactionRepository.save(transaction);
    }
  }

  async convertDtoToEntity(dto: BetDto): Promise<UserBet> {
    const entity = new UserBet();
    entity.odd = dto.odd;
    entity.amount = dto.amount;
    entity.bet_id = dto.bet_id;
    entity.user_id = dto.user_id;

    return entity;
  }
}
