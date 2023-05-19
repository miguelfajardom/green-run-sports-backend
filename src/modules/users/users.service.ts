import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { calculateUserBalance, validateUserStatus } from 'src/utils/user.utils';
import {
  AdminSelfOperationNotAllowedException,
  AdminUpdateException,
  AdministratorsDoNotHaveBalance,
  InsufficientFundsException,
  NoRecordsFoundException,
  UserNotFoundException,
} from 'src/utils/exceptions.utils';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { MessageResponse } from 'src/utils/message-response.enum';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { UserUpdateDTO } from './dto/update-user.dto';
import { convertDtoToObjectPlain } from 'src/utils/common-functions.util';
import { Event } from 'src/common/entities/event.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getUser(user_id): Promise<User> {
    const findUser = await this.userRepository.findOneBy({ id: user_id });

    if (!findUser) throw new UserNotFoundException();

    return findUser;
  }

  async getEvents(user_id: number, sport_id: number): Promise<any> {
    try {
      await validateUserStatus(user_id, this.userRepository);

      const queryBuilder = await this.eventRepository.createQueryBuilder(
        'event',
      );

      if (sport_id) {
        queryBuilder.andWhere('event.sport_id = :sport_id', { sport_id });
      }

      const findedEvents = await queryBuilder.getMany();
      if (findedEvents.length !== 0) {
        return {
          status: HttpStatus.OK,
          count: findedEvents.length,
          findedEvents,
        };
      }

      throw new NoRecordsFoundException();
    } catch (error) {
      throw error;
    }
  }

  async deposit(
    user: UserTokenInterface,
    depositDto: CreateTransactionDto,
  ): Promise<any> {
    await validateUserStatus(user.id, this.userRepository);

    depositDto.user_id = user.id;

    const deposit = await this.transactionRepository.save(depositDto);
    const new_balance = await calculateUserBalance(
      user.id,
      this.userRepository,
    );

    return {
      status: HttpStatus.OK,
      message: MessageResponse.DEPOSIT_SUCCESSFULLY,
      new_balance: new_balance,
    };
  }

  async withdraw(
    user: UserTokenInterface,
    withdrawData: CreateTransactionDto,
  ): Promise<any> {
    try {
      const findUser = await validateUserStatus(user.id, this.userRepository);

      const userBalance = await calculateUserBalance(
        user.id,
        this.userRepository,
      );

      withdrawData.user_id = user.id;
      withdrawData.category = TransactionCategoryEnum.WITHDRAW;

      if (withdrawData.amount > userBalance)
        throw new InsufficientFundsException();

      const withdraw = await this.transactionRepository.save(withdrawData);
      const new_balance = await calculateUserBalance(
        user.id,
        this.userRepository,
      );

      return {
        status: HttpStatus.OK,
        message: MessageResponse.WITHDRAWAL_SUCCESSFULLY,
        new_balance,
      };
    } catch (error) {
      return { status: error.status, message: error.message };
    }
  }

  async update(
    user: UserTokenInterface,
    updateUserDto: UserUpdateDTO,
    id?: number,
  ): Promise<any> {
    try {
      const findUser = await validateUserStatus(user.id, this.userRepository);

      if (id) {
        const userToUpdate = await this.userRepository.findOneBy({ id });

        if (userToUpdate && userToUpdate.rol.id === 1) {
          throw new AdminUpdateException();
        }
      }

      const objectPlain: User = await convertDtoToObjectPlain(updateUserDto);

      objectPlain.id = id ? id : user.id;

      await this.userRepository.save(objectPlain);

      return {
        status: HttpStatus.OK,
        message: MessageResponse.RECORDS_UPDATED_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async calculateUserBalance(
    user: UserTokenInterface,
    user_id?: number,
  ): Promise<any> {
    try {
      
      if (user_id) {
        const findUser = await validateUserStatus(user_id, this.userRepository);

        if (findUser.role_id === 1) throw new AdministratorsDoNotHaveBalance();
      }

      const findUser = await validateUserStatus(!user_id ? user.id : user_id, this.userRepository);

      const balance = await calculateUserBalance(
        !user_id ? user.id : user_id,
        this.userRepository);

      return { user_name: findUser.user_name, balance };
    } catch (error) {
      throw error;
    }
  }

  async getTransactions(
    user: UserTokenInterface,
    category?: TransactionCategoryEnum,
    user_id?: number,
  ) {
    try {
      const queryBuilder =
        this.transactionRepository.createQueryBuilder('transaction');

      if (user) {
        await validateUserStatus(user.id, this.userRepository);
        queryBuilder.andWhere('transaction.user_id = :user_id', {
          user_id: user.id,
        });
      }

      if (user_id) {
        await validateUserStatus(user_id, this.userRepository);
        queryBuilder.andWhere('transaction.user_id = :user_id', { user_id });
      }

      if (category) {
        queryBuilder.andWhere('transaction.category = :category', { category });
      }

      const transactions = await queryBuilder.getMany();

      if (transactions.length !== 0)
        return { count: transactions.length, items: transactions };

      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageResponse.NO_RECORDS_FOUND,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async blockUser(
    user: UserTokenInterface,
    blockUserDto: BlockorActivateUserDto,
  ): Promise<any> {
    try {

      if(user.id === blockUserDto.user_id){
        throw new AdminSelfOperationNotAllowedException()
      }
      
      const findUser = await validateUserStatus(user.id, this.userRepository)

      const userToBlock = await this.userRepository.findOne({
        where: { id: blockUserDto.user_id },
      });

      if(!userToBlock) throw new UserNotFoundException()

      if (userToBlock && userToBlock.rol.id === 1) {
        throw new BadRequestException('Cannot block another admin');
      }

      if (userToBlock.user_state === UserStatusEnum.BLOCKED) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: 'The user has already been blocked',
        };
      }

      userToBlock.user_state = UserStatusEnum.BLOCKED;
      await this.userRepository.save(userToBlock);

      return {
        status_code: HttpStatus.OK,
        status_message: 'User blocked successfully',
      };
    } catch (error) {
      throw error
    }
  }

  async activateUser(user: UserTokenInterface, activateUserDto: BlockorActivateUserDto): Promise<any> {
    try {
      if(user.id === activateUserDto.user_id){
        throw new AdminSelfOperationNotAllowedException()
      }

      const userToActivate = await this.userRepository.findOne({
        where: { id: activateUserDto.user_id },
      });


      if(!userToActivate) throw new UserNotFoundException()

      if (userToActivate.user_state == UserStatusEnum.ACTIVE) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: 'The user has already been activated',
        };
      }

      userToActivate.user_state = UserStatusEnum.ACTIVE;

      await this.userRepository.save(userToActivate);

      return {
        status_code: HttpStatus.OK,
        status_message: 'User activated successfully',
      };
    } catch (error) {
      throw error
    }
  }
}
