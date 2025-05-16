import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

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

  // не забываем про защиту роутов, этот защищать не нужно, а все на /api надо будет
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
}
