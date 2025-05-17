import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const maxRetries = 10;
    const retryDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        return;
      } catch {
        if (attempt === maxRetries) {
          process.exit(1);
        }
        await new Promise((res) => setTimeout(res, retryDelay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
