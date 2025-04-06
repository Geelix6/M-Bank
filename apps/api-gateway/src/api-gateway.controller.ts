import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

interface IUser {
  name: string;
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
  async trigger(@Body() user: IUser) {
    const payload = { name: user.name };
    // Отправляем сообщение с командой 'trigger' в MS1
    const response = await this.client
      .send({ cmd: 'trigger' }, payload)
      .toPromise();
    return response;
  }
}
