import { IsOptional, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNotEmpty()
  birth_date?: Date;

  @IsOptional()
  @IsNotEmpty()
  category?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  document_id?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;
}
