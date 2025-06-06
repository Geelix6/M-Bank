import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserUsernameDto } from './dto/user-username.dto';
import { UserDataDto } from './dto/user-data.dto';
import { ChangeBalaceDto } from './dto/change-balance.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.register' })
  async handleUserRegister(@Payload() user: CreateUserDto): Promise<boolean> {
    try {
      return await this.userService.registerUser(user);
    } catch {
      throw new RpcException('REGISTER_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.delete' })
  async handleUserDelete(
    @Payload() user: UserCredentialsDto,
  ): Promise<boolean> {
    try {
      return await this.userService.deleteUser(user);
    } catch {
      throw new RpcException('REGISTER_FAILED');
    }
  }

  @MessagePattern({ cmd: 'user.getAll' })
  async getAllUsers(): Promise<UserDataDto[]> {
    try {
      return await this.userService.getUsers();
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('GET_USER_BALANCE_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.getUuid' })
  async getUuidFromUsername(
    @Payload() user: UserUsernameDto,
  ): Promise<UserCredentialsDto> {
    try {
      return await this.userService.getUuidFromUsername(user);
    } catch {
      throw new RpcException('GET_USER_BALANCE_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.data' })
  async getUserBalance(
    @Payload() user: UserCredentialsDto,
  ): Promise<UserDataDto> {
    try {
      return await this.userService.getData(user);
    } catch {
      throw new RpcException('GET_USER_BALANCE_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.credit' })
  async handleUserCredit(@Payload() dto: ChangeBalaceDto): Promise<boolean> {
    try {
      return await this.userService.credit(dto);
    } catch {
      throw new RpcException('CREDIT_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'user.debit' })
  async handleUserDebit(@Payload() dto: ChangeBalaceDto): Promise<boolean> {
    try {
      return await this.userService.debit(dto);
    } catch (e) {
      console.log(e);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('DEBIT_FAILED');
    }
  }
}
