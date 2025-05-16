import { Injectable } from '@nestjs/common';

@Injectable()
export class SagaOrchestratorService {
  getHello(): string {
    return 'Hello World!';
  }
}
