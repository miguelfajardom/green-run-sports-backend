import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('balance/:id')
  calculateUserBalance(@Param('id') id: number){
    return this.usersService.calculateUserBalance(id)
  }

  // @Post('deposit')

  // @Post('deposit')
  // async deposit(@Body() depositData: any): Promise<any> {
  //   const transaction = await this.usersService.deposit(depositData);
  //   return { message: 'Deposit successful', transaction };
  // }

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
