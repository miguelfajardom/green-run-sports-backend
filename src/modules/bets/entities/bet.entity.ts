import { BetOptionEnum } from 'src/enums/bet-option.enum';
import { BetResultEnum } from 'src/enums/bet-result.enum';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { Event } from 'src/modules/events/entities/event.entity';
import { Sport } from 'src/common/entities/sport.entity';
import { UserBet } from 'src/modules/user_bets/entities/user_bet.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterUpdate,
} from 'typeorm';
import { BetsService } from '../bets.service';

@Entity({ name: 'bets' })
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BetOptionEnum,
  })
  bet_option: string;

  @Column({
    type: 'enum',
    enum: BetStatusEnum,
    default: 'active',
  })
  status: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  odd: number;

  @Column()
  sport_id: number;

  @Column()
  event_id: number;

  @Column({
    type: 'enum',
    enum: BetResultEnum,
    nullable: true,
  })
  result: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: null })
  deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Sport, (sport) => sport.bets)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @ManyToOne(() => Event, (event) => event.bets, {eager: true})
  @JoinColumn({ name: 'event_id' })
  event: Event;
  
  @OneToMany(() => UserBet, (userBet) => userBet.bet_id)
  userBets: UserBet[];

  @AfterUpdate()
  async createTransactionsOnWinningOptions() {
    const event = this.event;

    await BetsService.createTransactionsOnWinningOptions(this, event);
  }
}
