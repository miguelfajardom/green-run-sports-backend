import { BetOptionEnum } from 'src/enums/bet-option.enum';
import { BetResultEnum } from 'src/enums/bet-result.enum';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BetsResultDto {
  @ApiProperty({
    type: String,
    enum: BetOptionEnum,
    description: 'Bet option',
    example: BetOptionEnum.WIN,
  })
  @IsNotEmpty()
  @IsEnum(BetOptionEnum)
  bet_option: string;

  @ApiProperty({
    type: String,
    enum: BetResultEnum,
    description: 'Bet result',
    example: BetResultEnum.WON,
  })
  @IsNotEmpty()
  @IsEnum(BetResultEnum)
  result: string;
}

export class SettleBetDto {
  @ApiProperty({
    type: [BetsResultDto],
    description: 'Array of bet options and their results',
    example: [
      {
        bet_option: BetOptionEnum.WIN,
        result: BetResultEnum.WON,
      },
      {
        bet_option: BetOptionEnum.LOSE,
        result: BetResultEnum.LOST,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BetsResultDto)
  betOptions: BetsResultDto[];
}

