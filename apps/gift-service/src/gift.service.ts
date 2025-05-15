import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class GiftService {
  constructor(private readonly prisma: PrismaService) {}

  async registerGift(user: UserCredentialsDto): Promise<boolean> {
    const { userId } = user;

    try {
      await this.prisma.gift.create({
        data: {
          userId,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('GIFT_REGISTER_FAILED');
    }
  }
}
