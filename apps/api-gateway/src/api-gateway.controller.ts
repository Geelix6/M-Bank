import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface IUserPhoneNumber {
  phoneNumber: string;
}

interface IUser {
  name: string;
  accountNumber: number;
  balance: number;
}

@Controller()
export class AppController {
  private client: ClientProxy;

  constructor() {
    // Подключаемся к микросервису 1 (порт 3001)
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3001 },
    });
  }

  @Post('api/user')
  async trigger(@Body() user: IUserPhoneNumber): Promise<IUser> {
    const payload = { phoneNumber: user.phoneNumber };

    try {
      // Отправляем сообщение в MS1
      const response = await firstValueFrom<IUser>(
        this.client.send({ cmd: 'trigger' }, payload),
      );
      return response;
    } catch (error) {
      console.error('Ошибка в API Gateway:', error);

      let errorMessage: string;
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = 'Internal server error';
      }

      // Преобразуем RpcException из MS1 в HttpException для клиента
      throw new HttpException(
        errorMessage || 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
