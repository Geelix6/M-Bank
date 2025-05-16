import { Module } from '@nestjs/common';
import { SagaOrchestratorController } from './saga-orchestrator.controller';
import { SagaOrchestratorService } from './saga-orchestrator.service';

@Module({
  imports: [],
  controllers: [SagaOrchestratorController],
  providers: [SagaOrchestratorService],
})
export class AppModule {}
