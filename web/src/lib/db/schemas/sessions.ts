import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { addDays } from 'date-fns';

import { users } from './users';

export const sessions = sqliteTable(
	'session',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		sessionToken: text().unique().notNull(),
		userId: text().notNull(),
		expiresAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => addDays(new Date(), 15)),
		createdAt: integer({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(t) => [index('session_user_idx').on(t.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type Session = InferSelectModel<typeof sessions>;
export type SessionInsert = InferInsertModel<typeof sessions>;
