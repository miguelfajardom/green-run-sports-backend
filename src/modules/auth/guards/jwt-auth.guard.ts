import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/auth.decorator';
import { RevokedToken } from 'src/common/entities/revoked_token.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, 
    private reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RevokedToken) private revokedTokenRepository: Repository<RevokedToken>
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepository.findOneBy({id: payload.id})

      if (!user || new Date(user.updated_at) > new Date(payload.iat * 1000)) {
        await this.revokedTokenRepository.save({token})
        throw new UnauthorizedException('Token revoked');
      }
      
      request['user'] = payload;
    } catch (error) {
      throw error
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
