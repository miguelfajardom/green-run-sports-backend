import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BlockorActivateUserDto {
    @ApiProperty({
      type: Number,
      description: 'User ID',
      example: 1
    })
    @IsNotEmpty()
    user_id: number;
  }