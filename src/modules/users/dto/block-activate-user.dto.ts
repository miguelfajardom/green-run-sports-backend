import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class BlockorActivateUserDto {
    @ApiProperty({
      type: Number,
      description: 'User ID',
      example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
  }