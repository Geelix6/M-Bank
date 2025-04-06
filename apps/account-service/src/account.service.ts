import { Injectable } from '@nestjs/common';

// временная база данных
const users: {
  [key: string]: number;
} = {
  // номер телефона --> account number
  89055461034: 123,
  89588237565: 124,
};

@Injectable()
export class AccountService {
  getUser(username: string): number | undefined {
    return users[username];
  }
}
