import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { TransactionDto } from './dto/transaction.dto';
import { ChangeBalaceDto } from './dto/change-balance.dto';
import { TransactionCredentialsDto } from './dto/transaction-credentials.dto';

@Controller()
export class SagaOrchestratorController {
  private userClient: ClientProxy;
  private giftClient: ClientProxy;
  private transactionClient: ClientProxy;

  constructor() {
    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT ?? '3001', 10),
      },
    });

    this.giftClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT ?? '3002', 10),
      },
    });

    this.transactionClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT ?? '3003', 10),
      },
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'saga.register' })
  async handleUserRegister(@Payload() user: CreateUserDto): Promise<boolean> {
    const { userId } = user;
    const compensations: (() => Promise<boolean>)[] = [];

    try {
      await firstValueFrom(
        this.userClient
          .send<boolean, CreateUserDto>({ cmd: 'user.register' }, { ...user })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('USER_SERVICE_ERROR'));
            }),
          ),
      );
      compensations.push(
        async () =>
          await firstValueFrom(
            this.userClient.send<boolean, UserCredentialsDto>(
              { cmd: 'user.delete' },
              { userId },
            ),
          ),
      );

      const amount = await firstValueFrom(
        this.giftClient
          .send<
            number,
            UserCredentialsDto
          >({ cmd: 'gift.register' }, { userId })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('GIFT_SERVICE_ERROR'));
            }),
          ),
      );
      compensations.push(
        async () =>
          await firstValueFrom(
            this.giftClient.send<boolean, UserCredentialsDto>(
              { cmd: 'gift.delete' },
              { userId },
            ),
          ),
      );

      const transactionId = await firstValueFrom(
        this.transactionClient
          .send<
            string,
            TransactionDto
          >({ cmd: 'transaction.make' }, { fromUserId: userId, toUserId: userId, amount })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(
                () => new RpcException('MAKE_TRANSACTION_ERROR'),
              );
            }),
          ),
      );
      compensations.push(
        async () =>
          await firstValueFrom(
            this.transactionClient.send<boolean, TransactionCredentialsDto>(
              { cmd: 'transaction.delete' },
              { transactionId },
            ),
          ),
      );

      await firstValueFrom(
        this.userClient
          .send<
            boolean,
            ChangeBalaceDto
          >({ cmd: 'user.credit' }, { userId, amount })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('USER_CREDIT_ERROR'));
            }),
          ),
      );

      return true;
    } catch {
      for (const undo of compensations.reverse()) {
        try {
          await undo();
        } catch (err) {
          console.log(`Произошла ошибка ${err}`);
        }
      }
      throw new RpcException('REGISTER_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'saga.claimGift' })
  async handleGiftClaim(@Payload() user: UserCredentialsDto): Promise<number> {
    const { userId } = user;
    const compensations: (() => Promise<boolean>)[] = [];
    let winAmount: number;

    try {
      winAmount = await firstValueFrom(
        this.giftClient
          .send<number, UserCredentialsDto>({ cmd: 'gift.claim' }, { userId })
          .pipe(
            timeout(10000),
            catchError((_e) => {
              const e = _e as RpcException;
              return throwError(() => new RpcException(e.message));
            }),
          ),
      );
      compensations.push(
        async () =>
          await firstValueFrom(
            this.giftClient.send<boolean, UserCredentialsDto>(
              { cmd: 'gift.rollback' },
              { userId },
            ),
          ),
      );

      const transactionId = await firstValueFrom(
        this.transactionClient
          .send<
            string,
            TransactionDto
          >({ cmd: 'transaction.make' }, { fromUserId: userId, toUserId: userId, amount: winAmount })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('USER_SERVICE_ERROR'));
            }),
          ),
      );
      compensations.push(
        async () =>
          await firstValueFrom(
            this.transactionClient.send<boolean, TransactionCredentialsDto>(
              { cmd: 'transaction.delete' },
              { transactionId },
            ),
          ),
      );

      await firstValueFrom(
        this.userClient
          .send<
            boolean,
            ChangeBalaceDto
          >({ cmd: 'user.credit' }, { userId, amount: winAmount })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('USER_SERVICE_ERROR'));
            }),
          ),
      );

      return winAmount;
    } catch (_e) {
      const e = _e as RpcException;
      for (const undo of compensations.reverse()) {
        try {
          await undo();
        } catch (err) {
          console.log(`Произошла ошибка ${err}`);
        }
      }
      throw new RpcException(e.message);
    }
  }
}
