import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'register' })
  async handleUserRegister(@Payload() user: CreateUserDto): Promise<boolean> {
    try {
      return await this.userService.registerUser(user);
    } catch {
      throw new RpcException('REGISTER_FAILED');
    }
  }
}
