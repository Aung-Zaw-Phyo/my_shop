import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          return error.constraints[Object.keys(error.constraints)[0]];
        });
        return new UnprocessableEntityException(result);
      },
      stopAtFirstError: true,
    }),
    new ValidationPipe({
      whitelist: true
    })
  );
  useContainer(app.select(AppModule), {fallbackOnErrors: true});
  await app.listen(5000);
}
bootstrap();
