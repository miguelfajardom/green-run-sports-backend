import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
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

  async calculateUserBalance(id: number): Promise<any> {
    let balance = 0;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.transactions', 'transaction')
      .where('user.id = :id', { id })
      .getOne();
    
      if(user && user.transactions.length !== 0){
        for (const transaction of user.transactions) {
          if (transaction.category === 'deposit' || transaction.category === 'winning') {
            balance += transaction.amount;
          } else if (transaction.category === 'withdraw' || transaction.category === 'bet') {
            balance -= transaction.amount;
          }
        }
      }
    return balance;
  }
}
