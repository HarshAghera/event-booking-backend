import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase UUID string
  email: text('email').notNull().unique(),
  name: text('name').notNull(), // Add name
  createdAt: timestamp('created_at').defaultNow(),
});
