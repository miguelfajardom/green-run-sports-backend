import { UnauthorizedException } from "@nestjs/common";
import { UserStatusEnum } from "src/enums/user-status.enum";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

export async function calculateUserBalance(id: number, userRepository: Repository<User>): Promise<number> {
    let balance = 0;
    const user = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.transactions', 'transaction')
      .where('user.id = :id', { id })
      .getOne();

      if(user && user.transactions.length !== 0){
        for (const transaction of user.transactions) {
          if (transaction.category === 'deposit' || transaction.category === 'winning') {
            balance += transaction.amount;
          } else if (transaction.category === 'withdraw' || transaction.category === 'bet') {
            balance -= transaction.amount;
          }
        }
      }
    return balance;
  }

export async function validateUserStatus(id: number, userRepository: Repository<User>): Promise<User> {
  const findUser = await userRepository.findOneBy({id});
  
  if (!findUser || findUser.user_state !== UserStatusEnum.ACTIVE) {
    throw new UnauthorizedException(`User ${findUser?.user_name} not found or is blocked`);
  }

  return findUser
}
