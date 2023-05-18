import { EventStatusEnum } from 'src/enums/event-status';
import { Bet } from 'src/modules/bets/entities/bet.entity';
import { Sport } from 'src/common/entities/sport.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity({name: 'events'})
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  sport_id: number

  @Column({
    type: 'enum',
    enum: EventStatusEnum,
    nullable: true
  })
  status: string;

  @ManyToOne(() => Sport, sport => sport.events)
  @JoinColumn({name: 'sport_id'})
  sport: Sport;

  @OneToMany(() => Bet, bet => bet.event)
  bets: Bet[];
}

