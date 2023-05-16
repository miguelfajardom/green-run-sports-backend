import { IsEnum, IsNotEmpty } from "class-validator";
import { GenericStatusEnum } from "src/enums/generic-status.num";
import { TransactionCategoryEnum } from "src/enums/transaction-category.enum";

export class CreateTransactionDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionCategoryEnum)
  @IsNotEmpty()
  category: TransactionCategoryEnum;
}