import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const jwksUri =
      process.env.JWKS_URI ??
      'http://localhost:8080/auth/realms/mbank/protocol/openid-connect/certs';

    super(<StrategyOptionsWithoutRequest>{
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
    });
  }

  validate() {
    return {};
  }
}
