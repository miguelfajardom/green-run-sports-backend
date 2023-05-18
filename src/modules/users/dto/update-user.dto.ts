import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class UserUpdateDTO {
  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({
    type: String,
    description: 'Last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    type: String,
    description: 'Email address',
    example: 'example@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    description: 'Username',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @ApiProperty({
    type: String,
    description: 'Address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    type: String,
    description: 'Gender',
    example: 'Male',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    type: String,
    description: 'City',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    type: Number,
    description: 'Country ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  country_id?: number;
}
