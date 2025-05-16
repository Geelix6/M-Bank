import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class GiftService {
  readonly REGISTER_GIFT_AMOUNT: number = 10000;

  constructor(private readonly prisma: PrismaService) {}

  async registerGift(user: UserCredentialsDto): Promise<number> {
    const { userId } = user;

    try {
      await this.prisma.gift.create({
        data: {
          userId,
        },
      });
      return this.REGISTER_GIFT_AMOUNT;
    } catch (e) {
      console.log(e);
      throw new RpcException('GIFT_REGISTER_FAILED');
    }
  }

  async deleteGift(user: UserCredentialsDto) {
    const { userId } = user;

    try {
      await this.prisma.gift.delete({ where: { userId } });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('GIFT_DELETION_FAILED');
    }
  }
}
