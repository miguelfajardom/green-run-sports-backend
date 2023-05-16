import { BetResultEnum } from 'src/enums/bet-result.enum';
import { BetStatusEnum } from 'src/enums/bet-status.enum';
import { Event } from 'src/modules/events/entities/event.entity';
import { Sport } from 'src/modules/sports/entities/sport.entity';
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
} from 'typeorm';

@Entity({ name: 'bets' })
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bet_option: string;

  @Column({
    type: 'enum',
    enum: BetStatusEnum,
    default: 'active',
  })
  status: string;

  @Column()
  name: string;

  @Column()
  odd: number;

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

  @Column({ default: false })
  deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  // @ManyToOne(() => User, (user) => user.bets)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  //TODO determinar si elimino o no el eager, false: carga lenta, mejora rendimiento. true: trae todos los datos asocidados en la relacion
  @ManyToOne(() => Sport, (sport) => sport.bets, { eager: true })
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @ManyToOne(() => Event, (event) => event.bets, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;
  
  @OneToMany(() => UserBet, (userBet) => userBet.bet_id)
  userBets: UserBet[];
}
