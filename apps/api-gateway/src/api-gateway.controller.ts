import {
  Controller,
  Post,
  Body,
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

@Controller()
export class AppController {
  private sagaOrchestrator: ClientProxy;

  constructor() {
    this.sagaOrchestrator = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT ?? '3004', 10),
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
  @Post('/api/gifts')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async claimGift(@Body() user: UserCredentialsDto): Promise<number> {
    const { userId } = user;

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
  async makeTransaction(@Body() transaction: TransactionDto): Promise<void> {
    const { fromUserId, toUserId, amount } = transaction;

    try {
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

      throw new HttpException(
        'Failed to make transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
