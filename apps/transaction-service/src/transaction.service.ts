import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionDetailsDto } from './dto/transaction-details.dto';
import { TransactionCredentialsDto } from './dto/transaction-credentials.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async makeTransaction(transaction: TransactionDto): Promise<string> {
    try {
      const { fromUserId, toUserId, amount } = transaction;

      const { id } = await this.prisma.transaction.create({
        data: {
          fromUserId,
          toUserId,
          amount,
          type: toUserId == fromUserId ? 'GIFT' : 'TRANSACTION',
        },
      });
      return id;
    } catch (e) {
      console.log(e);
      throw new RpcException('TRANSACTION_FAILED');
    }
  }

  async deleteTransaction(
    transaction: TransactionCredentialsDto,
  ): Promise<boolean> {
    const { transactionId } = transaction;

    try {
      await this.prisma.transaction.delete({ where: { id: transactionId } });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('TRANSACTION_DELETION_FAILED');
    }
  }

  async getTransactionsHistory(
    user: UserCredentialsDto,
  ): Promise<TransactionDetailsDto[]> {
    try {
      const { userId } = user;
      const transactionData = await this.prisma.transaction.findMany({
        where: {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
        },
        orderBy: { time: 'desc' },
      });

      return transactionData.map((el) => ({
        fromUserId: el.fromUserId,
        toUserId: el.toUserId,
        amount: el.amount.toNumber(),
        time: el.time,
        type: el.type,
      }));
    } catch (e) {
      console.error('Error fetching transaction history:', e);
      throw new RpcException('TRANSACTION_HISTORY_FAILED');
    }
  }
}
