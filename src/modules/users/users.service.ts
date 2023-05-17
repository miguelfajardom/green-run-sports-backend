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
import { AdminUpdateException, InsufficientFundsException } from 'src/utils/exceptions.utils';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { MessageResponse } from 'src/utils/message-response.enum';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { UserUpdateDTO } from './dto/update-user.dto';
import { convertDtoToObjectPlain } from 'src/utils/common-functions.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async deposit(
    user: UserTokenInterface,
    depositDto: CreateTransactionDto,
  ): Promise<any> {
    await validateUserStatus(user.id, this.userRepository);

    depositDto.user_id = user.id;

    // return {depositDto}
    const deposit = await this.transactionRepository.save(depositDto);

    return { deposit };
    // await this.transactionService.createDepositTransaction(findUser, depositDto)
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

      return {
        status: HttpStatus.OK,
        message: MessageResponse.WITHDRAWAL_SUCCESSFULLY,
      };
    } catch (error) {
      return { status: error.status, message: error.message };
    }
  }

  async update(user: UserTokenInterface, updateUserDto: UserUpdateDTO, id?: number,): Promise<any> {

    try {
      const findUser = await validateUserStatus(user.id, this.userRepository)

      if(id){
        const userToUpdate = await this.userRepository.findOneBy({id})

        if(userToUpdate && userToUpdate.rol.id === 1){
          throw new AdminUpdateException()
        }
      }

      const objectPlain: User = await convertDtoToObjectPlain(updateUserDto);

      objectPlain.id = id ? id : user.id

      await this.userRepository.save(objectPlain);

      return {status: HttpStatus.OK, message: MessageResponse.UPDATE_INFORMATION_SUCCESFULLY}
    } catch (error) {
      throw error
    }
  }

  async calculateUserBalance(user: number): Promise<any> {
    try {
      const balance = await calculateUserBalance(user, this.userRepository);
      return { balance };
    } catch (error) {
      throw new InternalServerErrorException();
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
      const userToBlock = await this.userRepository.findOne({
        where: { id: blockUserDto.user_id },
      });

      if (user.role === 'admin') {
        throw new BadRequestException('Cannot block another admin');
      }

      if (userToBlock.user_state == UserStatusEnum.BLOCKED) {
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
      throw new HttpException(
        { message: 'Internal server error', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async activateUser(activateUserDto: BlockorActivateUserDto): Promise<any> {
    try {
      const userToActivate = await this.userRepository.findOne({
        where: { id: activateUserDto.user_id },
      });

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
      throw new HttpException(
        { message: 'Internal server error', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
