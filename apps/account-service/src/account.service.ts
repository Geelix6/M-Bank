import { Injectable } from '@nestjs/common';

// Временная база данных: номер телефона -> account number
const users: Record<string, number> = {
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
