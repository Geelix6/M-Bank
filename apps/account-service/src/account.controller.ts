import { Controller, Get } from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AppService } from './account.service';

@Controller()
export class AppController {
  private client: ClientProxy;

  constructor(private readonly appService: AppService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3002 },
    });
  }

  // Обрабатываем сообщение с командой 'trigger'
  @MessagePattern({ cmd: 'trigger' })
  async handleTrigger(data: any) {
    console.log('MS1 получил сообщение:', data);
    // Пересылаем данные во второй микросервис с командой 'process'
    const response = await this.client
      .send({ cmd: 'process' }, data)
      .toPromise();
    return response;
  }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
