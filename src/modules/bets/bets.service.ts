import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateBetDto } from './dto/update-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Bet } from './entities/bet.entity';
import { MessageResponse } from 'src/utils/message-response.enum';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { validateUserStatus } from 'src/utils/user.utils';
import { SettleBetDto } from './dto/settled-bet.dto';
import { validateBetOptions } from 'src/utils/bet.utils';
import { Event } from '../../common/entities/event.entity';
import { AlreadySettledBetException, BetsSettledCannotBeActivatedException, EventnotFoundException, NoRecordsFoundException } from 'src/utils/exceptions.utils';
import { convertDtoToObjectPlain } from 'src/utils/common-functions.util';
import { BetResultEnum } from 'src/enums/bet-result.enum';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UserBet } from '../user_bets/entities/user_bet.entity';
import { UserBetStatusEnum } from 'src/enums/user-bets-status.enum';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';

@Injectable()
export class BetsService {
  private static betStaticRepository: Repository<Bet>;
  private static transactionStaticRepository: Repository<Transaction>;
  private static userBetsStaticRepository: Repository<UserBet>;
  private static transactionStaticService: TransactionsService;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserBet) private userBetsRepository: Repository<UserBet>,
    @InjectRepository(Bet) private betRepository: Repository<Bet>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly transactionsService: TransactionsService,
  ) {
    BetsService.betStaticRepository = betRepository;
    BetsService.transactionStaticRepository = transactionRepository;
    BetsService.userBetsStaticRepository = userBetsRepository;
    BetsService.transactionStaticService = transactionsService;
  }

  async listBets(event_id: number, sport_id: number): Promise<any> {
    try {
      const queryBuilder = this.betRepository.createQueryBuilder('bet');

      if (sport_id) {
        queryBuilder.andWhere('bet.sport_id = :sport_id', { sport_id });
      }

      if (event_id) {
        queryBuilder.andWhere('bet.event_id = :event_id', { event_id });
      }

      const filteredData = await queryBuilder.getMany();

      if (filteredData.length !== 0) {
        return {
          status: HttpStatus.OK,
          count: filteredData.length,
          items: filteredData,
        };
      }

      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageResponse.NO_RECORDS_FOUND,
      };
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeBetStatus(id: number, updateBetDto: UpdateBetDto): Promise<any> {
    try {
      const betToUpdate = await this.betRepository.findOneBy({ id });
      if (!betToUpdate) {
        throw new HttpException(
          'No record found with the specified parameters',
          HttpStatus.NOT_FOUND,
        );
      }

      betToUpdate.status = updateBetDto.status;
      await this.betRepository.save(betToUpdate);

      return { status: HttpStatus.OK, message: 'Record update successfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async cancelBet(bet_id: number): Promise<any> {
    try {
      const bet = await this.betRepository.findOneBy({id: bet_id});
    
      if (!bet) {
        throw new NoRecordsFoundException();
      }
    
      if (bet.status === BetStatusEnum.SETTLED) {
        throw new AlreadySettledBetException();
      }

      bet.status = BetStatusEnum.CANCELLED

      await this.betRepository.save(bet)

      return {status: HttpStatus.OK, message: MessageResponse.RECORDS_UPDATED_SUCCESS}
    } catch (error) {
      throw error
    }
  }

  async activeBet(bet_id: number): Promise<any> {
    try {
      const bet = await this.betRepository.findOneBy({id: bet_id});
    
      if (!bet) {
        throw new NoRecordsFoundException();
      }
    
      if (bet.status === BetStatusEnum.SETTLED) {
        throw new BetsSettledCannotBeActivatedException();
      }

      if(bet.status === BetStatusEnum.ACTIVE){
        return {status: HttpStatus.BAD_REQUEST, message: MessageResponse.ACTIVE_BET_ALREADY}
      }

      bet.status = BetStatusEnum.ACTIVE

      await this.betRepository.save(bet)

      return {status: HttpStatus.OK, message: MessageResponse.RECORDS_UPDATED_SUCCESS}
    } catch (error) {
      throw error
    }
  }

  async settleBetsResults(
    user: UserTokenInterface,
    settleBetDto: SettleBetDto,
    event_id: number,
  ): Promise<any> {
    try {
      const settledPlainDto = await convertDtoToObjectPlain(settleBetDto);

      await validateUserStatus(user.id, this.userRepository);
      const event = this.eventRepository.findOneBy({ id: event_id });

      if (!event) {
        throw new EventnotFoundException();
      }

      const eventBets = await this.betRepository.find({ where: { event_id } });
      await validateBetOptions(settleBetDto.betOptions, eventBets);

      const won = settleBetDto.betOptions.find(
        (option) => option.result === BetResultEnum.WON,
      );

      await Promise.all(
        eventBets.map(async (option) => {
          option.status = BetStatusEnum.SETTLED;

          if (option.bet_option === won.bet_option) {
            option.result = BetResultEnum.WON;
            return;
          }
          option.result = BetResultEnum.LOST;
        }),
      );

      await this.betRepository.save(eventBets);

      return {
        status: HttpStatus.OK,
        message: MessageResponse.PLACED_BETS_SUCCESSFULLY,
      };
    } catch (error) {
      throw error;
    }
  }

  static async createTransactionsOnWinningOptions(bet: Bet, event: Event) {
    if (bet.result == BetResultEnum.WON) {
      const user_bets = await this.userBetsStaticRepository.find({
        where: { bet_id: bet.id },
      });

      if (user_bets && user_bets.length !== 0) {
        for (const user_bet of user_bets) {
          const createTransactionDto = new CreateTransactionDto();

          user_bet.state = UserBetStatusEnum.WON;

          createTransactionDto.user_id = user_bet.user_id;
          createTransactionDto.amount = user_bet.amount * user_bet.odd;
          createTransactionDto.user_bet_id = user_bet.id;

          await this.userBetsStaticRepository.save(user_bet);

          await this.transactionStaticService.createWinningTransaction(
            createTransactionDto,
          );
        }
      }
    }else{
      const user_bets = await this.userBetsStaticRepository.find({
        where: { bet_id: bet.id },
      });

      if (user_bets && user_bets.length !== 0) {
        for (const user_bet of user_bets) {
          const createTransactionDto = new CreateTransactionDto();

          user_bet.state = UserBetStatusEnum.LOST;

          createTransactionDto.user_id = user_bet.user_id;
          await this.userBetsStaticRepository.save(user_bet);
        }
      }
    }
  }
}

