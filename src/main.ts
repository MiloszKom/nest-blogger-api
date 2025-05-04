import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { TypeORMExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Blogger API')
    .setVersion('1.0')
    .addTag('test tag')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
