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
import { ApiProperty } from '@nestjs/swagger';
@Entity({ name: 'bets' })
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: 'OPTION_A',
    description: 'Bet option',
    enum: BetOptionEnum,
  })
  @Column({ name: 'bet_option', type: 'enum', enum: BetOptionEnum })
  bet_option: string;

  @ApiProperty({ 
    example: 'active',
    description: 'Status of the bet',
    enum: BetStatusEnum,
    default: 'active',
  })
  @Column({ name: 'status', type: 'enum', enum: BetStatusEnum, default: 'active' })
  status: string;

  @ApiProperty({ example: 'Bet name', description: 'Name of the bet' })
  @Column()
  name: string;

  @ApiProperty({ example: 2.5, description: 'Odd of the bet' })
  @Column({ type: 'float' })
  odd: number;

  @ApiProperty({ example: 1, description: 'Sport ID of the bet' })
  @Column({ name: 'sport_id' })
  sport_id: number;

  @ApiProperty({ example: 1, description: 'Event ID of the bet' })
  @Column({ name: 'event_id' })
  event_id: number;

  @ApiProperty({ 
    example: 'WON',
    description: 'Result of the bet',
    enum: BetResultEnum,
    nullable: true,
  })
  @Column({ name: 'result', type: 'enum', enum: BetResultEnum, nullable: true })
  result: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ApiProperty({ example: true, description: 'Indicates if the bet is deleted' })
  @Column({ name: 'deleted', default: null })
  deleted: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => Sport, sport => sport.bets)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @ManyToOne(() => Event, event => event.bets, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => UserBet, userBet => userBet.bet_id)
  userBets: UserBet[];

  @AfterUpdate()
  async createTransactionsOnWinningOptions() {
    const event = this.event;

    await BetsService.createTransactionsOnWinningOptions(this, event);
  }
}