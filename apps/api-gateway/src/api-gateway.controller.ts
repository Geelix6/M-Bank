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
import { KeycloakAuthenticatorDto } from './dto/keycloak-authenticator.dto';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

// interface IUserPhoneNumber {
//   phoneNumber: string;
// }

// interface IUser {
//   name: string;
//   accountNumber: number;
//   balance: number;
// }

@Controller()
export class AppController {
  // private accountClient: ClientProxy;
  private userClient: ClientProxy;

  constructor() {
    // this.accountClient = ClientProxyFactory.create({
    //   transport: Transport.TCP,
    //   options: {
    //     host: process.env.ACCOUNT_SERVICE_HOST || 'localhost',
    //     port: parseInt(process.env.ACCOUNT_SERVICE_PORT ?? '3001', 10),
    //   },
    // });

    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.USER_SERVICE_PORT ?? '3001', 10),
      },
    });
  }

  // здесь приписку api надо будет убрать, потому что api проксируется через nginx
  // и к любом api можно делать запросы извне
  // все остальные эндпоинты будут защищены JWT токенами
  // а этот оставим открытым для keycloak
  // но при этом снаружи добраться до этого пути будет нельзя, ведь в реверс-прокси не будет проксирования этого пути
  // но это все надо протестировать
  @Post('/api/webhook/keycloak')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async keycloakWebhook(@Body() body: KeycloakAuthenticatorDto): Promise<void> {
    try {
      await firstValueFrom(
        this.userClient.send({ cmd: 'register' }, { ...body }).pipe(
          timeout(10000),
          catchError(() => {
            return throwError(() => new RpcException('USER_SERVICE_ERROR'));
          }),
        ),
      );
      return;
    } catch (err) {
      console.error('Error in user-service call', err);
      throw new HttpException(
        'Failed to register user in user-service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('api/user')
  // async trigger(@Body() user: IUserPhoneNumber): Promise<IUser> {
  //   const payload = { phoneNumber: user.phoneNumber };

  //   try {
  //     // Отправляем сообщение в MS1
  //     const response = await firstValueFrom<IUser>(
  //       this.accountClient.send({ cmd: 'trigger' }, payload),
  //     );
  //     return response;
  //   } catch (error) {
  //     console.error('Ошибка в API Gateway:', error);

  //     let errorMessage: string;
  //     if (error && typeof error === 'object' && 'message' in error) {
  //       errorMessage = (error as { message: string }).message;
  //     } else {
  //       errorMessage = 'Internal server error';
  //     }

  //     // Преобразуем RpcException из MS1 в HttpException для клиента
  //     throw new HttpException(
  //       errorMessage || 'Internal server error',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
