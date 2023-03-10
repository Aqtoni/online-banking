import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/http-exception.filter';


async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('OnlineBanking API')
    .setDescription('Super easy online banking API 💵')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);
  nestApp.useGlobalFilters(new GlobalExceptionFilter());
  nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await nestApp.listen(3000);
}
bootstrap();
