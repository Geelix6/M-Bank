import { Injectable } from '@nestjs/common';

export interface IUser {
  accountNumber: number;
  name: string;
  balance: number;
}

// временная база данных
const accounts: {
  [key: number]: IUser;
} = {
  // имя --> account number
  123: {
    name: 'john',
    accountNumber: 123,
    balance: 124000,
  },
  124: {
    name: 'ben',
    accountNumber: 124,
    balance: 78500,
  },
};

@Injectable()
export class TransactionService {
  getAccount(accountNumber?: number): IUser | undefined {
    if (!accountNumber) {
      return;
    }

    return accounts[accountNumber];
  }
}
