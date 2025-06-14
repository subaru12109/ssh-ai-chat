import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 128 }).notNull().unique(),
  publicKey: text('public_key').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
}, table => [
  uniqueIndex('users_username_idx').on(table.username),
])

export const conversations = pgTable('conversations', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 128 }).notNull(),
  title: varchar('title', { length: 128 }).notNull(),
  conversationId: varchar('conversation_id', { length: 64 }).notNull().unique(),
  messages: jsonb('messages').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
}, table => [
  index('conversations_username_idx').on(table.username),
  uniqueIndex('conversations_conversation_id_idx').on(table.conversationId),
])
