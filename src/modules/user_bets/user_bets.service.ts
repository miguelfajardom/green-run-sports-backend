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
import { validateSufficientBalance } from 'src/utils/bet.utils';

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

    for (let bet of placeBetDto.bets) {
      bet.user_id = user.id;
    }

    // Calculate user balance
    const userBalance = await this.userService.calculateUserBalance(user.id);
    // Calculate if has sufficient balance to bet
    await validateSufficientBalance(userBalance, placeBetDto.bets);
    // Determine if bets are active status
    await this.validateBetsStatus(placeBetDto.bets);
    // Validate bet events
    await this.validateBetEvent(placeBetDto.bets);
    // Create user bets
    const entities = await Promise.all(placeBetDto.bets.map((bet) => this.convertDtoToEntity(bet)));

    // Save user bets
    const saveEntities = await this.userBetRepository.save(entities)
    return {entities}

    // await this.transactionService.createTransaction(current_user, placeBetDto.bets, TransactionCategoryEnum.BET)
    // return { user_body };
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
          throw new HttpException(
            'One or more bets are not eligible for placement due to their status',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
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

  async createTransaction(user: User, bets: BetDto[]): Promise<void> {
    for (const betDto of bets) {
      const transaction = new Transaction();
      transaction.amount = betDto.amount;
      transaction.category = TransactionCategoryEnum.BET;
      transaction.user = user;
      // Set any other necessary properties for the transaction

      // Guardar la transacción en la base de datos
      await this.transactionRepository.save(transaction);
    }
  }

  async convertDtoToEntity(dto: BetDto): Promise<UserBet> {
    const entity = new UserBet();
    entity.odd = dto.odd;
    entity.amount = dto.amount;
    entity.bet_id = dto.bet_id;
    entity.user_id = dto.user_id;
    // const bet = await this.betRepository.findOneBy({id: dto.bet_id});
    // if (!bet) {
    //   throw new HttpException('Bet not found');
    // }

    return entity;
  }
}
