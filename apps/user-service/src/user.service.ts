import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(user: CreateUserDto): Promise<boolean> {
    try {
      await this.prisma.user.create({
        data: {
          id: user.userId,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: 10000,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('REGISTER_FAILED');
    }
  }
}
