import { IsNotEmpty, IsString } from 'class-validator';

export class UserUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
