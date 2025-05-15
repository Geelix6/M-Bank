import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './transaction.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '3003', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      },
    },
  );
  await app.listen();
  console.log(`transaction-service запущен на порту ${port}`);
}
void bootstrap();
