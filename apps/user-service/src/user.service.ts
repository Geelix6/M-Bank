import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserUsernameDto } from './dto/user-username.dto';
import { UserDataDto } from './dto/user-data.dto';
import { ChangeBalaceDto } from './dto/change-balance.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(user: CreateUserDto): Promise<boolean> {
    const { userId, username, email, firstName, lastName } = user;

    try {
      await this.prisma.user.create({
        data: {
          id: userId,
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('REGISTER_FAILED');
    }
  }

  async deleteUser(user: UserCredentialsDto) {
    const { userId } = user;

    try {
      await this.prisma.user.delete({ where: { id: userId } });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('USER_DELETION_FAILED');
    }
  }

  async getUuidFromUsername(
    user: UserUsernameDto,
  ): Promise<UserCredentialsDto> {
    const { username } = user;
    try {
      const userData = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!userData) {
        throw new RpcException('USER_NOT_FOUND');
      }

      return { userId: userData.id };
    } catch (e) {
      console.log(e);
      throw new RpcException('GET_USER_BALANCE_FAILED');
    }
  }

  async getData(user: UserCredentialsDto): Promise<UserDataDto> {
    const { userId } = user;
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userData) {
        throw new RpcException('USER_NOT_FOUND');
      }

      return { ...userData, balance: userData.balance.toNumber() };
    } catch (e) {
      console.log(e);
      throw new RpcException('GET_USER_BALANCE_FAILED');
    }
  }

  async credit(dto: ChangeBalaceDto) {
    const { userId, amount } = dto;

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('CREDIT_FAILED');
    }
  }

  async debit(dto: ChangeBalaceDto) {
    const { userId, amount } = dto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new RpcException('USER_NOT_FOUND');
      }
      if (user.balance.toNumber() < amount) {
        throw new RpcException('NOT_ENOUGH_BALANCE');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });
      return true;
    } catch (e) {
      console.log(e);
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('DEBIT_FAILED');
    }
  }
}
