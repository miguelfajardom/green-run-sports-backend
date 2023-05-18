import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: Number,
    description: 'Role ID',
    example: 1,
  })
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({
    type: String,
    description: 'First name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'Last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Email address',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Username',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  user_name: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    type: String,
    description: 'Address',
    example: '123 Main St',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;

  @ApiProperty({
    type: String,
    description: 'Gender',
    example: 'Male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    type: String,
    description: 'Birth date',
    example: '1990-01-01',
  })
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({
    type: Number,
    description: 'Country ID',
    example: 1,
  })
  @IsNotEmpty()
  country_id: number;

  @ApiProperty({
    type: String,
    description: 'City',
    example: 'New York',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    type: String,
    description: 'Category',
    example: 'Category Name',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    type: String,
    description: 'Document ID',
    example: 'ABC123',
  })
  @IsNotEmpty()
  @IsString()
  document_id: string;
}
