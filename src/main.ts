import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '../images'), {
    prefix: '/img',
  });
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('ChainCrew-Scheduler') // 标题
    .setDescription('后台管理系统接口文档') // 描述
    .setVersion('1.0') // 版本
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVICE_PORT);
}
bootstrap();
