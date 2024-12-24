import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'abhinav',
  host: 'localhost',
  database: 'hydrate-me',
  password: 'abhinav#2002#2014',
  port: 5432,
});

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useValue: pool,
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
