import { Injectable } from '@nestjs/common';

export interface IUser {
  accountNumber: number;
  name: string;
  balance: number;
}

// временная база данных - account number --> IUser
const accounts: Record<number, IUser> = {
  123: {
    name: 'dan 1',
    accountNumber: 123,
    balance: 124000,
  },
  124: {
    name: 'dan 2',
    accountNumber: 124,
    balance: 78500,
  },
};

@Injectable()
export class TransactionService {
  getAccount(accountNumber: number): IUser {
    return accounts[accountNumber];
  }
}
