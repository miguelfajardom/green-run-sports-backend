import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

export async function calculateUserBalance(id: number, userRepository: Repository<User>): Promise<any> {
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