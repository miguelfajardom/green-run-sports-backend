import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UserGuard } from '../auth/guards/user.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from 'src/common/decorators/user.decorator';

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
    @Body() depositDto: CreateDepositDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.deposit(user, depositDto);
  }

  // @Post('withdraw')
  // async withdraw(@Body() withdrawData: any): Promise<any> {
  //   const transaction = await this.usersService.withdraw(withdrawData);
  //   return { message: 'Withdrawal successful', transaction };
  // }

  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   return await this.usersService.update(id, updateUserDto);
  // }

  // @Get(':id/balance')
  // async getBalance(@Param('id') id: number): Promise<number> {
  //   const balance = await this.usersService.getBalance(id);
  //   return { balance };
  // }

  // @Get(':id/transactions')
  // async getTransactions(
  //   @Param('id') id: number,
  //   @Query('category') category: string,
  // ): Promise<any> {
  //   const transactions = await this.usersService.getTransactions(id, category);
  //   return { transactions };
  // }
}
