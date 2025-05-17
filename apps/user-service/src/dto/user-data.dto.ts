import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDataDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Type(() => Number)
  @IsNumber()
  balance: number;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}
