import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

interface Data {
  accountNumber?: number;
}

@Controller()
export class AppController {
  constructor(private readonly transactionService: TransactionService) {}

  // Обрабатываем сообщение с командой 'process'
  @MessagePattern({ cmd: 'process' })
  processMessage(data: Data) {
    console.log('MS2 получил данные:', data);

    const account = this.transactionService.getAccount(data.accountNumber);

    if (!account) {
      return { message: 'Нет такого пользователя' };
    }

    return account;
  }

  // @Get()
  // getHello(): string {
  //   return this.transactionService.getHello();
  // }
}
