import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async registerUser(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // имитируем задержку
    if (Math.random() < 0.5) throw new Error('DB down');

    const createdAt = new Date().toISOString();
    const initialBalance = 10000;

    console.log(
      `User ${userId} registered with initial balance ${initialBalance} at ${createdAt}`,
    );
    return;
  }
}
