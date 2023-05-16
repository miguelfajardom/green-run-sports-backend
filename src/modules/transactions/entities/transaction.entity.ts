import { TransactionCategoryEnum } from 'src/enums/transaction-category.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { UserBet } from 'src/modules/user_bets/entities/user_bet.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionCategoryEnum,
  })
  category: TransactionCategoryEnum;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.ACTIVE,
  })
  status: TransactionStatus;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updated_at: Date;

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn({type: 'timestamp'})
  deleted_at: Date;

  @ManyToOne(() => UserBet, userBet => userBet.transactions)
  @JoinColumn({name: 'user_bet_id'})
  userBet: UserBet;

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({name: 'user_id'})
  user: User;
  
}
