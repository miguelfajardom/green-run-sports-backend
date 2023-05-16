import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'countries'})
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({ length: 2 })
  alpha2: string;

  @Column({ length: 3 })
  alpha3: string;

  @Column({ type: 'smallint', unsigned: true })
  numeric_code: number;

  @Column({ length: 30  })
  calling_code: string;

  @Column()
  language: string;

  @Column()
  currency: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
