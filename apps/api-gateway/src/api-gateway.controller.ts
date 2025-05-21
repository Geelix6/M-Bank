import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionDetailsDto } from './dto/transaction-details.dto';
import { UserDataDto } from './dto/user-data.dto';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { UserUsernameDto } from './dto/user-username.dto';
import { TransactionHistoryDto } from './dto/transaction-history.dto';

@Controller()
export class AppController {
  private sagaOrchestrator: ClientProxy;
  private userClient: ClientProxy;
  private giftClient: ClientProxy;
  private transactionClient: ClientProxy;

  constructor() {
    this.sagaOrchestrator = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.SAGA_ORCHESTRATOR_HOST || 'localhost',
        port: parseInt(process.env.SAGA_ORCHESTRATOR_PORT ?? '3004', 10),
      },
    });

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
        host: process.env.GIFT_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.GIFT_SERVICE_PORT ?? '3002', 10),
      },
    });

    this.transactionClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.TRANSACTION_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.TRANSACTION_SERVICE_PORT ?? '3003', 10),
      },
    });
  }

  @Post('/webhook/keycloak')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async keycloakWebhook(@Body() body: CreateUserDto): Promise<void> {
    try {
      await firstValueFrom(
        this.sagaOrchestrator
          .send<boolean, CreateUserDto>({ cmd: 'saga.register' }, { ...body })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('REGISTER_ERROR'));
            }),
          ),
      );
      return;
    } catch (err) {
      console.error('Error: ', err);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/users')
  async getAllUsers() {
    const users = await firstValueFrom(
      this.userClient.send<UserDataDto>({ cmd: 'user.getAll' }, {}).pipe(
        timeout(10000),
        catchError(() => {
          return throwError(() => new RpcException('GET_USERS_ERROR'));
        }),
      ),
    );

    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/balance')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getBalance(
    @Request() req: { user: UserCredentialsDto },
  ): Promise<UserDataDto> {
    const userId = req.user.userId;
    try {
      const balance = await firstValueFrom(
        this.userClient
          .send<
            UserDataDto,
            UserCredentialsDto
          >({ cmd: 'user.data' }, { userId })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(
                () => new RpcException('GET_USER_BALANCE_ERROR'),
              );
            }),
          ),
      );
      return balance;
    } catch (err) {
      console.error('Error: ', err);
      throw new HttpException(
        'Failed to fetch balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/gifts/remain-time')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getGiftTime(
    @Request() req: { user: UserCredentialsDto },
  ): Promise<Date> {
    const userId = req.user.userId;

    const notBefore = await firstValueFrom(
      this.giftClient
        .send<Date, UserCredentialsDto>({ cmd: 'gift.time' }, { userId })
        .pipe(
          timeout(10000),
          catchError(() => {
            return throwError(() => new RpcException('GIFT_TIME_ERROR'));
          }),
        ),
    );

    return new Date(notBefore);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/gifts')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async claimGift(
    @Request() req: { user: UserCredentialsDto },
  ): Promise<number> {
    const userId = req.user.userId;

    try {
      const winAmount = await firstValueFrom(
        this.sagaOrchestrator
          .send<
            number,
            UserCredentialsDto
          >({ cmd: 'saga.claimGift' }, { userId })
          .pipe(
            timeout(10000),
            catchError((_e) => {
              const e = _e as RpcException;
              return throwError(() => e);
            }),
          ),
      );
      return winAmount;
    } catch (_e) {
      const e = _e as RpcException;
      console.error('Error: ', e);

      if (e.message == 'GIFT_NOT_READY') {
        throw new HttpException(
          'Your gift is not ready yet',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to claim gift',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/transactions')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async makeTransaction(
    @Request() req: { user: UserCredentialsDto },
    @Body()
    transaction: TransactionRequestDto,
  ): Promise<void> {
    const { toUsername, amount } = transaction;
    const fromUserId = req.user.userId;

    try {
      const { userId: toUserId } = await firstValueFrom(
        this.userClient
          .send<
            UserCredentialsDto,
            UserUsernameDto
          >({ cmd: 'user.getUuid' }, { username: toUsername })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(() => new RpcException('GET_USER_UUID_ERROR'));
            }),
          ),
      );

      if (toUserId == fromUserId) {
        throw new RpcException('CANNOT_MAKE_SELF-TRANSACTION');
      }

      await firstValueFrom(
        this.sagaOrchestrator
          .send<
            boolean,
            TransactionDto
          >({ cmd: 'saga.makeTransaction' }, { fromUserId, toUserId, amount })
          .pipe(
            timeout(10000),
            catchError((_e) => {
              const e = _e as RpcException;
              return throwError(() => e);
            }),
          ),
      );
      return;
    } catch (_e) {
      const e = _e as RpcException;
      console.error('Error: ', e);

      if (e.message == 'NOT_ENOUGH_BALANCE') {
        throw new HttpException(
          "You cannot make this transaction. You don't have enough on balance",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (e.message == 'CANNOT_MAKE_SELF-TRANSACTION') {
        throw new HttpException(
          'You cannot make self-transaction',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to make transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/transactions/history')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getTransactionsHistory(
    @Request() req: { user: UserCredentialsDto },
  ): Promise<TransactionHistoryDto[]> {
    const userId = req.user.userId;
    try {
      const transactions = await firstValueFrom(
        this.transactionClient
          .send<
            TransactionDetailsDto[],
            UserCredentialsDto
          >({ cmd: 'transaction.history' }, { userId })
          .pipe(
            timeout(10000),
            catchError(() => {
              return throwError(
                () => new RpcException('TRANSACTION_HISTORY_ERROR'),
              );
            }),
          ),
      );
      const transactionHistory: TransactionHistoryDto[] = [];

      for (const transaction of transactions) {
        const {
          username: fromUsername,
          firstName: fromFirstName,
          lastName: fromLastName,
        } = await firstValueFrom(
          this.userClient
            .send<
              UserDataDto,
              UserCredentialsDto
            >({ cmd: 'user.data' }, { userId: transaction.fromUserId })
            .pipe(
              timeout(10000),
              catchError(() => {
                return throwError(
                  () => new RpcException('GET_USER_BALANCE_ERROR'),
                );
              }),
            ),
        );

        const {
          username: toUsername,
          firstName: toFirstName,
          lastName: toLastName,
        } = await firstValueFrom(
          this.userClient
            .send<
              UserDataDto,
              UserCredentialsDto
            >({ cmd: 'user.data' }, { userId: transaction.toUserId })
            .pipe(
              timeout(10000),
              catchError(() => {
                return throwError(
                  () => new RpcException('GET_USER_BALANCE_ERROR'),
                );
              }),
            ),
        );

        transactionHistory.push({
          ...transaction,
          fromUsername,
          fromFirstName,
          fromLastName,
          toUsername,
          toFirstName,
          toLastName,
        });
      }

      return transactionHistory;
    } catch (err) {
      console.error('Error: ', err);
      throw new HttpException(
        'Failed to fetch transactions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
