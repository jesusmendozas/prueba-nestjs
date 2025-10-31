import { drizzle } from 'drizzle-orm/mysql2';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import * as schema from './schemas';

export const DRIZZLE_ORM = Symbol('DRIZZLE_ORM');

export const drizzleProvider = {
  provide: DRIZZLE_ORM,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const pool: Pool = createPool({
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      user: configService.get<string>('DATABASE_USER'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    return drizzle(pool, { schema, mode: 'default' });
  },
};

