import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const nestApp = await NestFactory.create(AppModule, { cors: true });
  nestApp.setGlobalPrefix('v1');
  const config = new DocumentBuilder()
    .setTitle('OnlineBanking API')
    .setDescription('Super easy online banking API 💵')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);
  nestApp.useGlobalFilters(new GlobalExceptionFilter());
  nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = nestApp.get(ConfigService);
  await nestApp.listen(configService.get('API_PORT'));
  logger.log(`App listening on ${configService.get('API_PORT')}`);
}
bootstrap();
