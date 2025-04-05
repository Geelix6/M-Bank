// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './api-gateway.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import { Controller, Get } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

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
  @Get('api/trigger')
  async trigger() {
    const payload = { payload: 'Тестовое сообщение' };
    // Отправляем сообщение с командой 'trigger' в MS1
    const response = await this.client
      .send({ cmd: 'trigger' }, payload)
      .toPromise();
    return response;
  }
}
