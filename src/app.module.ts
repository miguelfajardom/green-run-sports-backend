import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsModule } from './modules/bets/bets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserBetsModule } from './modules/user_bets/user_bets.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ActiveUserMiddleware } from './common/middlewares/active-user/active-user.middleware';
import { User } from './modules/users/entities/user.entity';
import { CommonController } from './common/controllers/common/common.controller';
import { Event } from './common/entities/event.entity';
import { Country } from './common/entities/country.entity';
import { CommonService } from './common/controllers/common/common.service';
import { Sport } from './common/entities/sport.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_URI,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Event, Country, Sport]),
    UsersModule,
    BetsModule,
    TransactionsModule,
    AuthModule,
    UserBetsModule
  ],
  controllers: [AppController, CommonController],
  providers: [
    AppService,
    CommonService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ActiveUserMiddleware
  ],
})
export class AppModule{
}