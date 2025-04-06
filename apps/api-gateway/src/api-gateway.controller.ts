import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

interface IUserPhoneNumber {
  phoneNumber: string;
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

  // HTTP‑маршрут, который вызывается React‑приложением
  @Post('api/user')
  async trigger(@Body() user: IUserPhoneNumber) {
    const payload = { phoneNumber: user.phoneNumber };
    // Отправляем сообщение с командой 'trigger' в MS1
    const response = await this.client
      .send({ cmd: 'trigger' }, payload)
      .toPromise();
    return response;
  }
}
