import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "./rol.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { Bet } from "src/modules/bets/entities/bet.entity";
import { UserBet } from "src/modules/user_bets/entities/user_bet.entity";
import { Country } from "src/common/entities/country.entity";
import { UserStatusEnum } from "src/enums/user-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column()
  last_name: string;

  @ApiProperty({ example: '+123456789', description: 'Phone number of the user' })
  @Column()
  phone: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email address of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  @Column({ unique: true })
  user_name: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @Column()
  password: string;

  @ApiProperty({ example: '123 Street', description: 'Address of the user' })
  @Column()
  address: string;

  @ApiProperty({ example: 'Male', description: 'Gender of the user' })
  @Column()
  gender: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birth date of the user' })
  @Column({ type: 'datetime' })
  birth_date: Date;

  @ApiProperty({ example: 'City', description: 'City of the user' })
  @Column()
  city: string;

  @ApiProperty({ example: 1, description: 'Category of the user' })
  @Column({ nullable: true })
  category: number;

  @ApiProperty({ example: '123456789', description: 'Document ID of the user' })
  @Column()
  document_id: string;

  @ApiProperty({ 
    example: 'ACTIVE',
    description: 'State of the user',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  @Column()
  user_state: string;

  @ApiProperty({ example: 1, description: 'Role ID of the user' })
  @Column()
  role_id: number;

  @ApiProperty({ example: 1, description: 'Country ID of the user' })
  @Column()
  country_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ example: true, description: 'Indicates if the user is deleted' })
  @Column({ nullable: true })
  deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Roles, { eager: true })
  @JoinColumn({ name: 'role_id' })
  rol: Roles;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => UserBet, userBet => userBet.user_id)
  userBets: UserBet[];
}