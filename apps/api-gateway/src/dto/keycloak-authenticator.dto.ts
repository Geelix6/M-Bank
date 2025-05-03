import { IsNotEmpty, IsString } from 'class-validator';

export class KeycloakAuthenticatorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  // @IsString()
  // @IsNotEmpty()
  // firstName: string;
}
