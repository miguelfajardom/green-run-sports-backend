import { UserStatusEnum } from "src/enums/user-status.enum"
import { Roles } from "src/modules/users/entities/rol.entity"

export interface UserTokenInterface extends Request {
    id: number,
    user_name: string
    role: any
    user_sate: UserStatusEnum
  }