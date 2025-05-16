import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './api-gateway.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
