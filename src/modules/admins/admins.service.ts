import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { BlockorActivateUserDto } from './dto/block-activate-user.dto';
import { Bet } from '../bets/entities/bet.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Bet) private betRepository: Repository<Bet>,
  ) {}

  async blockUser(blockUserDto: BlockorActivateUserDto): Promise<any> {
    try {
      const userToBlock = await this.userRepository.findOne({
        where: { id: blockUserDto.user_id },
      });

      if (userToBlock.role_id.name === 'admin') {
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
