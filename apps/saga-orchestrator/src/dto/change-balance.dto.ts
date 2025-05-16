import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeBalaceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
