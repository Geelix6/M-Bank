import { IsNotEmpty, IsString } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
