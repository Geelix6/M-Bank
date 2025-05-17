import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionCredentialsDto } from './dto/transaction-credentials.dto';
import { TransactionDetailsDto } from './dto/transaction-details.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'transaction.make' })
  async makeTransaction(
    @Payload() transaction: TransactionDto,
  ): Promise<string> {
    try {
      return await this.transactionService.makeTransaction(transaction);
    } catch {
      throw new RpcException('TRANSACTION_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'transaction.delete' })
  async deleteTransaction(
    @Payload() transaction: TransactionCredentialsDto,
  ): Promise<boolean> {
    try {
      return await this.transactionService.deleteTransaction(transaction);
    } catch {
      throw new RpcException('TRANSACTION_DELETION_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'transaction.history' })
  async getTransactionsHistory(
    @Payload() user: UserCredentialsDto,
  ): Promise<TransactionDetailsDto[]> {
    try {
      return await this.transactionService.getTransactionsHistory(user);
    } catch {
      throw new RpcException('TRANSACTION_HISTORY_FAILED');
    }
  }
}
