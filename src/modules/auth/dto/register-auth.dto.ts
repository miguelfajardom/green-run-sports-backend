import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';
export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty()
    role_id: number;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    first_name: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    last_name: string;
  
    @IsNotEmpty()
    @IsString()
    phone: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    user_name: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    address: string;
  
    @IsNotEmpty()
    @IsString()
    gender: string;
  
    @IsNotEmpty()
    birth_date: Date;
  
    @IsNotEmpty()
    country_id: number;
  
    @IsNotEmpty()
    @IsString()
    city: string;
    
    @IsOptional()
    category: number;
  
    @IsNotEmpty()
    @IsString()
    document_id: string;
}