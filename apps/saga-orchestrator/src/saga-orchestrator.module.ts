import { Module } from '@nestjs/common';
import { SagaOrchestratorController } from './saga-orchestrator.controller';

@Module({
  imports: [],
  controllers: [SagaOrchestratorController],
  providers: [],
})
export class AppModule {}
