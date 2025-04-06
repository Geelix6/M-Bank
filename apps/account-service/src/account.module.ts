import { Module } from '@nestjs/common';
import { AppController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AccountService],
})
export class AppModule {}
