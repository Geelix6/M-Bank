import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class GiftService {
  readonly REGISTER_GIFT_AMOUNT: number = 10000;
  readonly GIFT_CHANCES: Record<number, number> = {
    3000: 0.24,
    5000: 0.15,
    10000: 0.15,
    20000: 0.15,
    50000: 0.15,
    100000: 0.1,
    250000: 0.05,
    1000000: 0.01,
  };

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

  async getGiftStatus(user: UserCredentialsDto): Promise<Date> {
    const { userId } = user;
    try {
      const gift = await this.prisma.gift.findUnique({
        where: { userId },
      });
      if (!gift) {
        throw new RpcException('GIFT_NOT_FOUND');
      }
      return gift.notBefore;
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('GIFT_STATUS_FAILED');
    }
  }

  async claimGift(user: UserCredentialsDto): Promise<number> {
    const { userId } = user;
    const now = new Date();

    try {
      const giftRecord = await this.prisma.gift.findUnique({
        where: { userId },
      });
      if (!giftRecord) {
        throw new RpcException('GIFT_NOT_FOUND');
      }
      if (giftRecord.notBefore > now) {
        throw new RpcException('GIFT_NOT_READY');
      }

      const amount = this.getRandomPrize();
      const sixHoursLater = new Date(Date.now() + 6 * 60 * 60 * 1000);

      await this.prisma.gift.update({
        where: { userId },
        data: { notBefore: sixHoursLater },
      });
      return amount;
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('GIFT_CLAIM_FAILED');
    }
  }

  async rollbackGift(user: UserCredentialsDto) {
    const { userId } = user;
    const now = new Date();

    try {
      await this.prisma.gift.update({
        where: { userId },
        data: { notBefore: now },
      });
      return true;
    } catch (e) {
      console.log(e);
      throw new RpcException('GIFT_DELETION_FAILED');
    }
  }

  private getRandomPrize(): number {
    const entries = Object.entries(this.GIFT_CHANCES);
    const rand = Math.random();
    let cumulative = 0;

    for (const [amountStr, weight] of entries) {
      cumulative += weight;
      if (rand <= cumulative) {
        return parseInt(amountStr, 10);
      }
    }

    return parseInt(entries[entries.length - 1][0], 10);
  }
}
