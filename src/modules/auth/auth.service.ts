import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { Roles } from '../users/entities/rol.entity';
import { UserStatusEnum } from 'src/enums/user-status.enum';
import { GenericStatusEnum } from 'src/enums/generic-status.num';
dotenv.config();

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    private jwtService: JwtService
  ){

  }
  
  async register(userObject: RegisterAuthDto): Promise<any> {    
    try {
      const { password } = userObject;
      const plainToHash = await hash(password, 10);
      const newUser = { ...userObject, password: plainToHash };
      await this.userRepository.save((newUser as {}));
      return { 
        status_code: HttpStatus.CREATED,
        status_message: 'User created successfully',
        data: newUser };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
      } else if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(error.sqlMessage, HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Unable to create user', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  

  async login(userObject: LoginAuthDto){
    try {

        const {email, password} = userObject
        
        const findUser =  await this.userRepository.findOneBy({email})
        if(!findUser) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        const checkPassword = await compare(password, findUser.password)
        if(!checkPassword) throw new HttpException('INVALID_PASSWORD', HttpStatus.FORBIDDEN);
        
        if(findUser.user_state !== UserStatusEnum.ACTIVE) 
        throw new HttpException('The specified user is either blocked or no longer exists', HttpStatus.FORBIDDEN);
        
        const roleUser = await this.rolesRepository.findOneBy({id: findUser.role_id})
        if(!roleUser || roleUser.state !== GenericStatusEnum.ACTIVE) throw new HttpException('The assigned role is invalid or does not exist', HttpStatus.FORBIDDEN);

        const payload = {id: findUser.id, user_name: findUser.user_name, role: findUser.rol.name, user_state: findUser.user_state}
        const token = this.jwtService.sign(payload)

        const data = {
          user: findUser,
          token          
        }

        return {status_code: HttpStatus.OK, status_message: 'User found', data: data}
    } catch (error) {
        if(error instanceof HttpException) {
            throw error;
        } else {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


}
