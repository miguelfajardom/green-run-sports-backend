import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty({
    type: Number,
    description: 'ID of the user role',
    example: 1,
  })
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({
    type: String,
    description: 'First name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of the user',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User username',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  user_name: string;

  @ApiProperty({
    type: String,
    description: 'User password (min length: 6, max length: 20)',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    type: String,
    description: 'User address',
    example: '123 Street, City',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;

  @ApiProperty({
    type: String,
    description: 'User gender',
    example: 'male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    type: Date,
    description: 'User birth date',
    example: '1990-01-01',
  })
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({
    type: Number,
    description: 'ID of the country',
    example: 1,
  })
  @IsNotEmpty()
  country_id: number;

  @ApiProperty({
    type: String,
    description: 'User city',
    example: 'City',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    type: Number,
    description: 'Category ID (optional)',
    required: false,
    example: 1,
  })
  @IsOptional()
  category: number;

  @ApiProperty({
    type: String,
    description: 'User document ID',
    example: 'ABC123XYZ',
  })
  @IsNotEmpty()
  @IsString()
  document_id: string;
}
