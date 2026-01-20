import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription('Task & SubTask APIs')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const configService = app.get(ConfigService);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  const port =configService.get<number>('PORT') || 4444;
  console.log(port)
  await app.listen(port);
}

bootstrap();

