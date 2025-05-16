import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './saga-orchestrator.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '3004', 10);
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
  console.log(`saga-orchestrator запущен на порту ${port}`);
}
void bootstrap();
