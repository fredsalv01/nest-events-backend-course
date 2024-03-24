import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EntityNotFoundErrorFilter } from './entity-not-found-error.entity';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    // logger: ['error', 'warn', 'debug'],
    // }
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  await app.listen(3000);
}
bootstrap();
