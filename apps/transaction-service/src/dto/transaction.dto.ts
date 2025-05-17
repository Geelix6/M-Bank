import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  fromUserId: string;

  @IsString()
  @IsNotEmpty()
  toUserId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
