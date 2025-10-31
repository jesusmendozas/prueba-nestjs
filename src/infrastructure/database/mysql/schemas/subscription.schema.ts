import {
  mysqlTable,
  serial,
  int,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';
import { users } from './user.schema';
import { plans } from './plan.schema';

export const subscriptions = mysqlTable(
  'subscriptions',
  {
    id: serial('id').primaryKey(),
    userId: int('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    planId: int('plan_id')
      .notNull()
      .references(() => plans.id),
    status: varchar('status', { length: 20 }).notNull().default('active'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    statusIdx: index('status_idx').on(table.status),
  }),
);

export type SubscriptionSchema = typeof subscriptions.$inferSelect;
export type NewSubscriptionSchema = typeof subscriptions.$inferInsert;

