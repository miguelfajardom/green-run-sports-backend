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
  .setDescription('')
  .setVersion('1.0')
  .addTag('Authentication')
  .addTag('Administrators')
  .addTag('Users')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    validateCustomDecorators: true,
    forbidNonWhitelisted: true,
    whitelist: true    
  }));
  await app.listen(3000);
}
bootstrap();
