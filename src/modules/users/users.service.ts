import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { CreateWithdrawalDto } from './dto/create-withdraw.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { TransactionsService } from '../transactions/transactions.service';
import { calculateUserBalance } from 'src/utils/user.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private readonly transactionService: TransactionsService
  ) {}

  async deposit(user: UserTokenInterface, depositDto: CreateDepositDto): Promise<any>{
    const findUser = await this.userRepository.findOneBy({id: user.id})
    if (!findUser || findUser.user_state !== UserStatusEnum.ACTIVE) {
      throw new UnauthorizedException(`User ${findUser.user_name} not found or is blocked`);
    }
    
    depositDto.user_id = findUser.id

    // return {depositDto}
    const deposit = await this.transactionRepository.save(depositDto)

    return {deposit}
    // await this.transactionService.createDepositTransaction(findUser, depositDto)
    
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { first_name, last_name, phone, email, address, city } =
      updateUserDto;

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.address = address || user.address;
    user.city = city || user.city;

    return this.userRepository.save(user);
  }

  async calculateUserBalance(user: number): Promise<any> {
    try {
      const balance = await calculateUserBalance(user, this.userRepository)
      return {balance}
    } catch (error) {
      throw new InternalServerErrorException()
    }


  }
}
