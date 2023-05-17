import { SportStatusEnum } from 'src/enums/sport-status.enum';
import { Bet } from 'src/modules/bets/entities/bet.entity';
import { Event } from 'src/modules/events/entities/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({name: 'sports'})
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: SportStatusEnum,
    nullable: true
  })
  status: string;

  @OneToMany(() => Event, event => event.sport)
  events: Event[];

  @OneToMany(() => Bet, bet => bet.sport)
  bets: Bet[];  
  
  
}