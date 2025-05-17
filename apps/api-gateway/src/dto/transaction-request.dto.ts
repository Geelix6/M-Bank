import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TransactionRequestDto {
  @IsString()
  @IsNotEmpty()
  toUsername: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
