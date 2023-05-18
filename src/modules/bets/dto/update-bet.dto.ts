import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsEnum, IsNotIn } from 'class-validator';
import { BetStatusEnum } from 'src/enums/bet-status.enum';

export class UpdateBetDto {
  @ApiProperty({
    enum: BetStatusEnum,
    description: 'Bet status',
    example: BetStatusEnum.ACTIVE
  })
  @IsNotEmpty()
  @IsEnum(BetStatusEnum)
  @IsNotIn([BetStatusEnum.SETTLED])
  status: BetStatusEnum;
}
