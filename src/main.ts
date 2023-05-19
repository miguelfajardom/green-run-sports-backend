import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
async function bootstrap() {
  // dotenv.config();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('GreenRun - Sports Documentation')
    .setDescription(`
      There are two default users and roles:\n
      Users: (administrator, user)\n
      Roles: (1: admin, 2: user)\n
      Additionally, you will find pre-created events and bets for various sports.\n
      You can search for them using the (/events, /bets) endpoints\n
      Furthermore, I have included two common endpoints for retrieving countries and sports`
    )
    .setVersion('1.0')
    .addTag('Common')
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Administrators')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validateCustomDecorators: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
