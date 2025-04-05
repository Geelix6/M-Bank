import { Module } from '@nestjs/common';
import { AppController } from './transaction.controller';
import { AppService } from './transaction.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
