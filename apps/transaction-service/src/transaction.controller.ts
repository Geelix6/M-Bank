import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

interface IUserAccountNumber {
  accountNumber?: number;
}

@Controller()
export class AppController {
  constructor(private readonly transactionService: TransactionService) {}

  // Обрабатываем сообщение с командой 'process'
  @MessagePattern({ cmd: 'process' })
  processMessage(data: IUserAccountNumber) {
    console.log('MS2 получил данные:', data);

    const account = this.transactionService.getAccount(data.accountNumber);

    if (!account) {
      return {
        message:
          'Нет пользователя с таким номером. Возможно стоит разворачивать запрос еще на уровне account service',
      };
    }

    return account;
  }
}
