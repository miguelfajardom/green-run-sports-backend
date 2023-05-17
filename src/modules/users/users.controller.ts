import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { UserGuard } from '../auth/guards/user.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';
import { UserUpdateDTO } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('balance/')
  @UseGuards(UserGuard)
  getUserBalance(@User() user: UserTokenInterface) {
    return this.usersService.calculateUserBalance(user.id);
  }

  @Get('balance/:id')
  @UseGuards(AdminGuard)
  getUserBalanceById(@Param('id') id: number) {
    return this.usersService.calculateUserBalance(id);
  }

  @Post('deposit')
  @UseGuards(UserGuard)
  deposit(
    @Body() depositDto: CreateTransactionDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.deposit(user, depositDto);
  }

  @Post('withdraw')
  @UseGuards(UserGuard)
  withdraw(
    @Body() withdrawDto: CreateTransactionDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.withdraw(user, withdrawDto);
  }

  @Get('transactions')
  @UseGuards(UserGuard)
  getTransactions(
    @Query('category') category: TransactionCategoryEnum,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.getTransactions(user, category);
  }

  @Get('all-transactions')
  @UseGuards(AdminGuard)
  getAllTransactions(
    @Query('category') category: TransactionCategoryEnum,
    @Query('user_id') user_id: number,
  ) {
    return this.usersService.getTransactions(null, category, user_id);
  }

  @Post('block-user')
  @UseGuards(AdminGuard)
  blockUser(
    @Body() blockUserDto: BlockorActivateUserDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.blockUser(user, blockUserDto);
  }

  @Post('activate-user')
  @UseGuards(AdminGuard)
  activateUser(@Body() activateUserDto: BlockorActivateUserDto) {
    return this.usersService.activateUser(activateUserDto);
  }

  @Post('update')
  @UseGuards(UserGuard)
  update(
    @User() user: UserTokenInterface,
    @Body() userUpdateDTO: UserUpdateDTO,
  ) {
    return this.usersService.update(user, userUpdateDTO);
  }

  @Post('update/:id')
  @UseGuards(AdminGuard)
  updateUser(
    @User() user: UserTokenInterface,
    @Body() userUpdateDTO: UserUpdateDTO,
    @Param('id') user_id: number
  ) {
    return this.usersService.update(user, userUpdateDTO, user_id);
  }
}
