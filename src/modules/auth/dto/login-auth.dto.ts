import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength} from "class-validator";

export class LoginAuthDto {
    @ApiProperty({
      type: String,
      description: 'User name',
      example: 'jonndoe'
    })
    @IsString()
    user_name: string;
  
    @ApiProperty({
      type: String,
      description: 'User password (min length: 6)',
      example: 'password123'
    })
    @MinLength(6)
    password: string;
  }