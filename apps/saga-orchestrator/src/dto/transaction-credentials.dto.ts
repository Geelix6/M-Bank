import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionCredentialsDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
