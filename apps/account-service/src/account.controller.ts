import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RpcException,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AccountService } from './account.service';

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

  constructor(private readonly accountService: AccountService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3002 },
    });
  }

  // Обрабатываем сообщение с командой 'trigger'
  @MessagePattern({ cmd: 'trigger' })
  async handleTrigger(data: IUserPhoneNumber): Promise<IUser> {
    console.log('MS1 получил сообщение:', data);

    const accountNumber = this.accountService.getUser(data.phoneNumber);

    if (!accountNumber) {
      throw new RpcException({
        status: 'error',
        message: 'User not found',
      });
    }

    const payload = { accountNumber };

    const response = await firstValueFrom<IUser>(
      this.client.send({ cmd: 'process' }, payload),
    );
    return response;
  }
}
