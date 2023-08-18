import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: any;

  constructor() {
    this.connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'employees',
    });

    this.connection
      .getConnection()
      .then(() => {
        console.log('Database connection established successfully.');
      })
      .catch((error) => {
        console.error('Database connection error:', error);
      });
  }

  async query(sql: string, values?: any[]): Promise<any> {
    const [results] = await (this.connection as any).execute(sql, values);
    return results;
  }
}
