import { Injectable } from '@nestjs/common';

// временная база данных
const users: {
  [key: string]: number;
} = {
  // имя --> account number
  john: 123,
  ben: 124,
};

@Injectable()
export class AccountService {
  getUser(username: string): number | undefined {
    return users[username];
  }
}
