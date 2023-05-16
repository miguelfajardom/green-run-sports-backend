import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}