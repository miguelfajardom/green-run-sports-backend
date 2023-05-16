import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { GenericStatusEnum } from 'src/enums/generic-status.num';

@Entity({name: 'roles'})
export class  Roles{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({
        type: 'enum',
        enum: GenericStatusEnum,
        default: GenericStatusEnum.ACTIVE
      })
    state

    @OneToMany(() => User, user => user.role_id)
    users: User[];
}
