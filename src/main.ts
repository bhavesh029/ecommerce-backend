import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));

  const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription('API for managing products, cart, and coupons in an e-commerce application')
      .setVersion('1.0')
      .addTag('Products')
      .addTag('Cart')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}

// FIX: Handle the promise rejection to satisfy the linter
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});