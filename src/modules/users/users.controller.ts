import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';
import { UserGuard } from '../auth/guards/user.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';
import { UserUpdateDTO } from './dto/update-user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('events')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Retrieve all events created in database' })
  @ApiQuery({
    name: 'sport_id',
    description:
      'Filter by sport ID (optional). Possible sports: 1-Football, 2-Tennis, 3-Basketball, 4-Golf',
    required: false,
    type: 'number',
  })
  getEvents(
    @Query('sport_id') sport_id: number,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.getEvents(user.id, sport_id);
  }

  @Get('balance/')
  @UseGuards(UserGuard)
  @ApiTags('Users')
  @ApiOperation({ summary: 'Retrieve balance' })
  getUserBalance(@User() user: UserTokenInterface) {
    return this.usersService.calculateUserBalance(user);
  }

  @Get('balance/:id')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Retrieve the balance of a user based on their ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve its balance',
  })
  getUserBalanceById(
    @Param('id') id: number,
    @User() user: UserTokenInterface
    ) {
    return this.usersService.calculateUserBalance(user, id);
  }

  @Post('deposit')
  @UseGuards(UserGuard)
  @ApiTags('Users')
  @ApiOperation({ summary: 'Make a deposit' })
  deposit(
    @Body() depositDto: CreateTransactionDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.deposit(user, depositDto);
  }

  @Post('withdraw')
  @UseGuards(UserGuard)
  @ApiTags('Users')
  @ApiOperation({ summary: 'Make a withdrawal' })
  withdraw(
    @Body() withdrawDto: CreateTransactionDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.withdraw(user, withdrawDto);
  }

  @Get('transactions')
  @UseGuards(UserGuard)
  @ApiTags('Users')
  @ApiOperation({
    summary: 'List all user transactions. It can be filtered too by category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description:
      'Transaction category (optional). Possible values: deposit, withdraw, bet, winning.',
  })
  getTransactions(
    @User() user: UserTokenInterface,
    @Query('category') category: TransactionCategoryEnum,
  ) {
    return this.usersService.getTransactions(user, category);
  }

  @Get('all-transactions')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({
    summary: 'List all user transactions. It can be filtered too by category',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description:
      'Transaction category (optional). Possible values: deposit, withdraw, bet, winning.',
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    description: 'Transaction user_id (optional).',
  })
  getAllTransactions(
    @Query('category') category: TransactionCategoryEnum,
    @Query('user_id') user_id: number,
  ) {
    return this.usersService.getTransactions(null, category, user_id);
  }

  @Post('block-user')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Block an user' })
  blockUser(
    @Body() blockUserDto: BlockorActivateUserDto,
    @User() user: UserTokenInterface,
  ) {
    return this.usersService.blockUser(user, blockUserDto);
  }

  @Post('activate-user')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Activate an user' })
  activateUser(
    @Body() activateUserDto: BlockorActivateUserDto,
    @User() user: UserTokenInterface
    ) {
    return this.usersService.activateUser(user, activateUserDto);
  }

  @Put('update')
  @ApiTags('Users')
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Update logged user' })
  update(
    @User() user: UserTokenInterface,
    @Body() userUpdateDTO: UserUpdateDTO,
  ) {
    return this.usersService.update(user, userUpdateDTO);
  }

  @Put('update/:id')
  @UseGuards(AdminGuard)
  @ApiTags('Administrators')
  @ApiOperation({ summary: 'Update an user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User id to update',
  })
  updateUser(
    @User() user: UserTokenInterface,
    @Body() userUpdateDTO: UserUpdateDTO,
    @Param('id') user_id: number,
  ) {
    return this.usersService.update(user, userUpdateDTO, user_id);
  }
}
