import { relations, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { settlements } from './settlements';
import { accounts } from './accounts';

export const users = sqliteTable('user', {
	id: text().primaryKey(),
	name: text().notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	settlements: many(settlements),
	accounts: many(accounts)
}));

export type User = InferSelectModel<typeof users>;
