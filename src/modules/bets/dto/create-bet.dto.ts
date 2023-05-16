import { IsNotEmpty, IsEnum, IsPositive } from "class-validator";
import { BetResultEnum } from "src/enums/bet-result.enum";
import { BetStatusEnum } from "src/enums/bet-status.enum";

export class CreateBetDto {
    @IsNotEmpty()
    bet_option: string;
  
    @IsEnum(BetStatusEnum)
    status: BetStatusEnum;
  
    @IsNotEmpty()
    name: string;
  
    @IsPositive()
    odd: number;
  
    @IsNotEmpty()
    sport_id: number;
  
    @IsNotEmpty()
    event_id: number;
  }