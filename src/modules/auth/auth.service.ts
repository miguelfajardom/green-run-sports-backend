import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
        const findUser =  await this.userRepository.findOne({where: {email}})
        if(!findUser) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        const checkPassword = await compare(password, findUser.password)
        if(!checkPassword) throw new HttpException('INVALID_PASSWORD', HttpStatus.FORBIDDEN);

        const payload = {id: findUser.id, user_name: findUser.user_name, role: findUser.role_id, user_state: findUser.user_state}
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
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


}
