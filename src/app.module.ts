import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsModule } from './modules/bets/bets.module';
import { EventsModule } from './modules/events/events.module';
import { SportsModule } from './modules/sports/sports.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserBetsModule } from './modules/user_bets/user_bets.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ActiveUserMiddleware } from './common/middlewares/active-user/active-user.middleware';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '7619064lM_*',
      database: 'greenrunsports',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    BetsModule,
    TransactionsModule,
    SportsModule,
    EventsModule,
    AuthModule,
    UserBetsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ActiveUserMiddleware
  ],
})
export class AppModule{
}
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(ActiveUserMiddleware)
//       .exclude({ path: 'auth/register', method: RequestMethod.POST })
//       .forRoutes('*');
//   }
// }
