import { IsNotEmpty,IsEnum, IsNotIn } from 'class-validator';
import { BetStatusEnum } from 'src/enums/bet-status.enum';

export class UpdateBetDto{
  @IsNotEmpty()
  @IsEnum(BetStatusEnum)
  @IsNotIn([BetStatusEnum.SETTLED])
  status: BetStatusEnum;
}
