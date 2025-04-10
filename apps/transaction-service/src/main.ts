import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './transaction.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '3002', 10);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      // Судя по выводу netstat, Transaction Service слушает на адресе ::1:3002, то есть на IPv6 loopback,
      // а не на всех интерфейсах. Это означает, что другие контейнеры не могут подключиться,
      // так как они обращаются по внешнему IP, а не по localhost.
      options: {
        host: '0.0.0.0', // поэтому вот тут 0.0.0.0, чтобы приложение слушало на всех на всех интерфейсах
        port,
      },
    },
  );
  await app.listen();
  console.log(`transaction-service запущен на порту ${port}`);
}
void bootstrap();
