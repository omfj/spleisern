import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const accounts = sqliteTable(
	'account',
	{
		id: text().primaryKey(),
		provider: text({ enum: ['account-number'] }).notNull(),
		providerAccountId: text().notNull(),
		userId: text().notNull(),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [
		uniqueIndex('account_provider_providerAccountId_idx').on(t.provider, t.providerAccountId),
		index('account_userId_idx').on(t.userId)
	]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));
