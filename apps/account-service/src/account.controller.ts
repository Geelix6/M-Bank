import { Controller, Get } from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AccountService } from './account.service';

interface Data {
  name: string;
}

@Controller()
export class AppController {
  private client: ClientProxy;

  constructor(private readonly accountService: AccountService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3002 },
    });
  }

  // Обрабатываем сообщение с командой 'trigger'
  @MessagePattern({ cmd: 'trigger' })
  async handleTrigger(data: Data) {
    console.log('MS1 получил сообщение:', data);

    const dataToMS2 = {
      accountNumber: this.accountService.getUser(data.name),
    };

    // Пересылаем данные во второй микросервис с командой 'process'
    const response = await this.client
      .send({ cmd: 'process' }, dataToMS2)
      .toPromise();
    return response;
  }

  // @Get()
  // getHello(): string {
  //   return this.accountService.getHello();
  // }
}
