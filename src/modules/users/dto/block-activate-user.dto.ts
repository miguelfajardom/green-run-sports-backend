import { IsNotEmpty } from "class-validator";

export class BlockorActivateUserDto {
    @IsNotEmpty()
    user_id: number
}