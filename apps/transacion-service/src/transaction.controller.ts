import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'createTransaction' })
  async createTransaction(
    @Payload() transaction: TransactionDto,
  ): Promise<boolean> {
    try {
      return await this.transactionService.createTransaction(transaction);
    } catch {
      throw new RpcException('TRANSACTION_FAILED');
    }
  }
}
