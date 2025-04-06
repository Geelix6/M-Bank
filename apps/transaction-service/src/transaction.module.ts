import { Module } from '@nestjs/common';
import { AppController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [TransactionService],
})
export class AppModule {}
