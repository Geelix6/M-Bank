import { IsUUID, IsNumber, IsDate, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

type TransactionType = 'GIFT' | 'TRANSACTION';

export class TransactionHistoryDto {
  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @IsString()
  @IsIn(['GIFT', 'TRANSACTION'])
  type: TransactionType;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDate()
  time: Date;

  @IsString()
  fromUsername: string;

  @IsString()
  fromFirstName: string;

  @IsString()
  fromLastName: string;

  @IsString()
  toUsername: string;

  @IsString()
  toFirstName: string;

  @IsString()
  toLastName: string;
}
