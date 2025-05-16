import { Module } from '@nestjs/common';
import { AppController } from './api-gateway.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
