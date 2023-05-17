import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { GenericStatusEnum } from "src/enums/generic-status.num";
import { TransactionCategoryEnum } from "src/enums/transaction-category.enum";

export class CreateTransactionDto {
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
  
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsEnum(TransactionCategoryEnum)
  category: TransactionCategoryEnum

}