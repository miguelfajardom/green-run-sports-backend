import { BetOptionEnum } from "src/enums/bet-option.enum";
import { BetResultEnum } from "src/enums/bet-result.enum";
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';

export class SettleBetDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BetsResultDto)
  betOptions: BetsResultDto[]
}

export class BetsResultDto {
  
  @IsNotEmpty()
  @IsEnum(BetOptionEnum)
  bet_option: string;

  @IsNotEmpty()
  @IsEnum(BetResultEnum)
  result: string;
}