import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('GreenRun - Sports Documentation')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('Users', 'Auth')
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
