import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "./rol.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { Bet } from "src/modules/bets/entities/bet.entity";
import { UserBet } from "src/modules/user_bets/entities/user_bet.entity";
import { Country } from "src/modules/countries/entities/country.entity";
import { UserStatusEnum } from "src/enums/user-status.enum";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    first_name: string
    
    @Column()
    last_name: string
    
    @Column()
    phone: string
    
    @Column({unique: true})
    email: string
    
    @Column({unique: true})
    user_name: string
    
    @Column()
    password: string
    
    @Column()
    address: string
    
    @Column()
    gender: string
    
    @Column({type: 'datetime'})
    birth_date: Date
    
    @Column()
    city: string
    
    @Column({nullable: true})
    category: number
    
    @Column()
    document_id: string
    
    @Column({
        type: 'enum',
        enum: UserStatusEnum,
        default: UserStatusEnum.ACTIVE
      })
    user_state: string
    
    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date
    
    @Column({nullable: true})
    deleted: Boolean
    
    @DeleteDateColumn()
    deleted_at: Date
    
    @ManyToOne(() => Roles, { eager: true})
    @JoinColumn({ name: 'role_id'})
    role_id: Roles;

    @ManyToOne(() => Country, { eager: true })
    @JoinColumn({ name: 'country_id' })
    country_id: Country;
  
    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

    @OneToMany(() => UserBet, userBet => userBet.user_id)
    userBets: UserBet[];

}
