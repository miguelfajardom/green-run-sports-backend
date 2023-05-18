import { UserBetStatusEnum } from 'src/enums/user-bets-status.enum';
import { Bet } from 'src/modules/bets/entities/bet.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn, OneToMany } from 'typeorm';

@Entity({name: 'user_bets'})
export class UserBet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  odd: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({
    type: 'enum',
    enum: UserBetStatusEnum,
    default: null
  })
  state: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @Column()
  bet_id: number;

  @Column()
  user_id: number;

  @OneToMany(() => Transaction, transaction => transaction.userBet)
  transactions: Transaction[];

  @ManyToOne(() => User, user => user.userBets, { eager: true })
  @JoinColumn({name: 'user_id'})
  users: number;

  @ManyToOne(() => Bet, bet => bet.userBets, { eager: true })
  @JoinColumn({name: 'bet_id'})
  bets: number;
}
