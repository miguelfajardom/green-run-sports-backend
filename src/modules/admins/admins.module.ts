import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminController } from './admins.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from '../bets/entities/bet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bet]),],
  controllers: [AdminController],
  providers: [AdminsService]
})
export class AdminsModule {}
