import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './transaction.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Обрабатываем сообщение с командой 'process'
  @MessagePattern({ cmd: 'process' })
  processMessage(data: any) {
    console.log('MS2 получил данные:', data);
    return { message: 'Ответ от MS2: сообщение обработано' };
  }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
