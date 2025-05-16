import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
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
      await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('DEBIT_FAILED');
    }
  }
}
