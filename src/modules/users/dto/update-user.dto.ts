import { IsOptional, IsString, IsEmail, IsEnum, IsDate, MinLength, MaxLength } from 'class-validator';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { CreateUserDto } from './create-user.dto';

export class UserUpdateDTO{
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  user_name?: string;
  
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country_id?: number;
}
