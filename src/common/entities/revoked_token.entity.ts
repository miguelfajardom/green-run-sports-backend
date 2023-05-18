import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class RevokedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000 }) 
  token: string;

  @CreateDateColumn()
  revokedAt: Date;
}
