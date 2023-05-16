import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';

@ApiBearerAuth()
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // @Post()
  // createTransaction(
  //   @Body() createTransactionDto: CreateTransactionDto,
  //   @User() user: UserTokenInterface) {
  //   return this.transactionsService.createTransaction(user, createTransactionDto, 'bet');
  // }

}
