import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GiftService } from './gift.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller()
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @MessagePattern({ cmd: 'register' })
  async handleGiftRegister(
    @Payload() user: UserCredentialsDto,
  ): Promise<boolean> {
    try {
      return await this.giftService.registerGift(user);
    } catch {
      throw new RpcException('GIFT_REGISTER_FAILED');
    }
  }
}
