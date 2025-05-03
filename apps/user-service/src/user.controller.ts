import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  // private client: ClientProxy;

  constructor(private readonly userService: UserService) {
    // куда дальше из баланса идет запрос
    // this.client = ClientProxyFactory.create({
    //   transport: Transport.TCP,
    //   options: {
    //     host: process.env.TRANSACTION_SERVICE_HOST ?? 'localhost',
    //     port: parseInt(process.env.TRANSACTION_SERVICE_PORT ?? '3002', 10),
    //   },
    // });
  }

  @MessagePattern({ cmd: 'register' })
  async handleUserRegister(
    @Payload() payload: { userId: string },
  ): Promise<boolean> {
    try {
      await this.userService.registerUser(payload.userId);
      return true;
    } catch {
      throw new RpcException('REGISTER_FAILED');
    }
  }
}
