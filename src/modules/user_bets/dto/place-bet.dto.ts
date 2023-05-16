import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateUserBetDto } from './create-user_bet.dto';
import { UserBet } from '../entities/user_bet.entity';

export class PlaceBetDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets: BetDto[];
}

export class BetDto extends CreateUserBetDto{

  @IsNumber()
  @IsOptional()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  bet_id: number;

  @IsNumber()
  @IsNotEmpty()
  event_id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  odd: number;
}
