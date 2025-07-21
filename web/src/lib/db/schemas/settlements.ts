import { type InferSelectModel, type InferInsertModel, sql, relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { members } from './members';
import { products } from './products';
import { users } from './users';

export const settlements = sqliteTable('settlement', {
	id: text().primaryKey(),
	name: text().notNull(),
	description: text(),
	owner: text().notNull(),
	isPublic: integer({ mode: 'boolean' }).notNull(),
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const settlementsRelations = relations(settlements, ({ one, many }) => ({
	products: many(products),
	members: many(members),
	owner: one(users, {
		fields: [settlements.owner],
		references: [users.id]
	})
}));

export type Settlement = InferSelectModel<typeof settlements>;
export type SettlementInsert = InferInsertModel<typeof settlements>;
