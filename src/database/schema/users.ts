import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('user_roles', [
  'customer',
  'organizer',
  'superAdmin',
]);

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase Auth User ID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoles('role').notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});
