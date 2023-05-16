import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBetDto } from './create-user_bet.dto';

export class UpdateUserBetDto extends PartialType(CreateUserBetDto) {}
