import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { Bet } from 'src/modules/bets/entities/bet.entity';
import { BetDto } from 'src/modules/user_bets/dto/place-bet.dto';
import { UserBet } from 'src/modules/user_bets/entities/user_bet.entity';
import { Repository } from 'typeorm';

export async function validateSufficientBalance(
  userBalance: number,
  bets: BetDto[],
): Promise<boolean> {
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  if (totalBetAmount > userBalance) {
    throw new HttpException(
      'Insufficient balance to perform the requested action. Please deposit funds to your account',
      HttpStatus.FORBIDDEN,
    );
  }
  return false;
}

export async function validateBetsStatus(bets: BetDto[], betRepository: Repository<Bet>): Promise<any> {
  try {
    
    for (const betDto of bets) {
      const bet = betRepository.findOneBy({ id: betDto.bet_id });
      if (
        !bet ||
        (await bet).status === BetStatusEnum.CANCELLED ||
        (await bet).status === BetStatusEnum.SETTLED
      ) {
        throw new HttpException(
          'One or more bets are not eligible for placement due to their status',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return true;
  } catch (error) {
    throw new InternalServerErrorException();
  }
}

export async function validateBetEvent(bets: BetDto[], betRepository: Repository<Bet>): Promise<boolean> {
    for (const betDto of bets) {
      const betExists = await betRepository
        .createQueryBuilder('bet')
        .where('bet.id = :bet_id', { bet_id: betDto.bet_id })
        .andWhere('bet.event_id = :event_id', { event_id: betDto.event_id })
        .getOne();
      if (!betExists) {
        throw new HttpException(
          `Invalid bet ID ${betDto.bet_id} for the specified event ${betDto.event_id}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return true;
  }

  export async function convertDtoToEntity(dto: BetDto): Promise<UserBet> {
    const entity = new UserBet();
    entity.odd = dto.odd;
    entity.amount = dto.amount;

    // const bet = await this.betRepository.findOneBy({id: dto.bet_id});
    // if (!bet) {
    //   throw new HttpException('Bet not found', HttpStatus.NOT_FOUND);
    // }
    entity.bet_id = dto.bet_id;
    entity.user_id = dto.user_id

    return entity;
  }