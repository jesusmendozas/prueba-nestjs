import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/infrastructure/database/mysql/schemas/*.schema.ts',
  out: './src/infrastructure/database/mysql/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'subscriptions_db',
  },
  verbose: true,
  strict: true,
});

