import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted: true, // throw error if extra props
    transform: true, // auto-transform payload to DTO class
  }))
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
