import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Roles } from '../users/entities/rol.entity';
import * as dotenv from 'dotenv';
import { RevokedToken } from 'src/common/entities/revoked_token.entity';
dotenv.config();
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Roles]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '20m'},
      global: true
    },)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ]
})
export class AuthModule {}
