import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GiftService } from './gift.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller()
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'gift.register' })
  async handleGiftRegister(
    @Payload() user: UserCredentialsDto,
  ): Promise<number> {
    try {
      return await this.giftService.registerGift(user);
    } catch {
      throw new RpcException('GIFT_REGISTER_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'gift.delete' })
  async handleGiftDelete(
    @Payload() user: UserCredentialsDto,
  ): Promise<boolean> {
    try {
      return await this.giftService.deleteGift(user);
    } catch {
      throw new RpcException('GIFT_DELETION_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'gift.time' })
  async handleGiftStatus(@Payload() user: UserCredentialsDto): Promise<Date> {
    try {
      return await this.giftService.getGiftStatus(user);
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('GIFT_STATUS_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'gift.claim' })
  async handleGiftClaim(@Payload() user: UserCredentialsDto): Promise<number> {
    try {
      return await this.giftService.claimGift(user);
    } catch (e) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException('GIFT_CLAIM_FAILED');
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'gift.rollback' })
  async handleGiftRollback(
    @Payload() user: UserCredentialsDto,
  ): Promise<boolean> {
    try {
      return await this.giftService.rollbackGift(user);
    } catch {
      throw new RpcException('GIFT_ROLLBACK_FAILED');
    }
  }
}
