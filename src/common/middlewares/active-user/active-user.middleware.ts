import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActiveUserMiddleware implements NestMiddleware {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user.id;
      const user = await this.userRepository.findOne({where: {id}})

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.user_state !== 'active') {
        throw new HttpException('User is not active', HttpStatus.UNAUTHORIZED);
      }

      // Agrega el usuario a la solicitud
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized' });
    }

    
  }
}
