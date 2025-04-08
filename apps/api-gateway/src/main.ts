import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';

async function bootstrap() {
  // Создаём HTTP‑приложение
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`HTTP Gateway запущен на порту ${port}`);
}
void bootstrap();
