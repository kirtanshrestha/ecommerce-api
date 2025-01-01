import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('E-Commerce API')
  .setDescription('API for managing products, users, orders, etc.')
  .setVersion('1.0')
  .addBearerAuth()  
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
