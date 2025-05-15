import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(transaction: TransactionDto): Promise<boolean> {
    try {
      const { fromUserId, toUserId, amount } = transaction;

      await this.prisma.transaction.create({
        data: {
          fromUserId,
          toUserId,
          amount,
          type: toUserId == fromUserId ? 'GIFT' : 'TRANSACTION',
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('TRANSACTION_FAILED');
    }
  }
}
