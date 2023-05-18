import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsPositive } from "class-validator";
import { BetOptionEnum } from "src/enums/bet-option.enum";
import { BetResultEnum } from "src/enums/bet-result.enum";
import { BetStatusEnum } from "src/enums/bet-status.enum";

export class CreateBetDto {
  @ApiProperty({
    enum: BetOptionEnum,
    description: 'Bet option',
    example: 'win'
  })
  @IsNotEmpty()
  @IsEnum(BetOptionEnum)
  bet_option: string;

  @ApiProperty({
    enum: BetStatusEnum,
    description: 'Bet status',
    example: BetStatusEnum.ACTIVE
  })
  @IsEnum(BetStatusEnum)
  status: BetStatusEnum;

  @ApiProperty({
    type: String,
    description: 'Bet name',
    example: 'Football Bet'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Bet odd',
    example: 1.5
  })
  @IsPositive()
  odd: number;

  @ApiProperty({
    type: Number,
    description: 'Sport ID',
    example: 1
  })
  @IsNotEmpty()
  sport_id: number;

  @ApiProperty({
    type: Number,
    description: 'Event ID',
    example: 1
  })
  @IsNotEmpty()
  event_id: number;
  }