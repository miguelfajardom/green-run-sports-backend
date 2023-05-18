import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BetDto {
  @ApiProperty({
    type: Number,
    description: 'User ID (if authenticated user is placing the bet)',
    required: false,
    example: 1
  })
  @IsNumber()
  @IsOptional()
  user_id: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the bet to place',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  bet_id: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the event for the bet',
    example: 2
  })
  @IsNumber()
  @IsNotEmpty()
  event_id: number;

  @ApiProperty({
    type: Number,
    description: 'Amount to bet',
    example: 100
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    type: Number,
    description: 'The odds for the bet (if available)',
    required: false,
    example: 2.5
  })
  @IsNumber()
  @IsOptional()
  odd: number;
}

export class PlaceBetDto {
  @ApiProperty({
    type: [BetDto],
    description: 'An array of bets to place',
    example: [{ bet_id: 1, event_id: 2, amount: 100 }]
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets: BetDto[];
}