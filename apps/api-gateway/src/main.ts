import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';

async function bootstrap() {
  // Создаём HTTP‑приложение
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('HTTP Gateway запущен на http://localhost:3000');
}
bootstrap();
