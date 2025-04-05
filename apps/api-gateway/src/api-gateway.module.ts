import { Module } from '@nestjs/common';
import { AppController } from './api-gateway.controller';
import { AppService } from './api-gateway.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
