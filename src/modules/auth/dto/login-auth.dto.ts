import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({
      type: String,
      description: 'User email',
      example: 'example@example.com'
    })
    @IsEmail()
    email: string;
  
    @ApiProperty({
      type: String,
      description: 'User password (min length: 6)',
      example: 'password123'
    })
    @MinLength(6)
    password: string;
  }