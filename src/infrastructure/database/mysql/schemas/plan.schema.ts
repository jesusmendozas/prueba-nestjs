import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  json,
} from 'drizzle-orm/mysql-core';

export const plans = mysqlTable('plans', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  durationInDays: int('duration_in_days').notNull(),
  features: json('features').$type<string[]>().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type PlanSchema = typeof plans.$inferSelect;
export type NewPlanSchema = typeof plans.$inferInsert;

