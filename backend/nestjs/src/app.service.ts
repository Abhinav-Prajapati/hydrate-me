import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('DATABASE_POOL') private readonly dbPool: any) {}

  async getUsers(): Promise<any[]> {
    const result = await this.dbPool.query('SELECT * FROM users');
    return result.rows;
  }
  async addUser(name: string, email: string): Promise<void> {
    await this.dbPool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [
      name,
      email,
    ]);
  }
}
