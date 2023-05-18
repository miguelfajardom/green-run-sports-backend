import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { GenericStatusEnum } from 'src/enums/generic-status.num';
import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';

export class CreateTransactionDto {
  @ApiProperty({
    type: Number,
    description: 'Amount of the transaction',
    example: 100.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    type: Number,
    description: 'User ID (optional)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    type: Number,
    description: 'User Bet ID (optional)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  user_bet_id: number;

  @ApiProperty({
    type: String,
    description: 'Description of the transaction (optional)',
    required: false,
    example: 'Payment for the bet',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Transaction category (optional)',
    required: false,
    enum: TransactionCategoryEnum,
    example: TransactionCategoryEnum.DEPOSIT,
  })
  @IsOptional()
  @IsString()
  @IsEnum(TransactionCategoryEnum)
  category: TransactionCategoryEnum;
}
