import { type InferSelectModel, type InferInsertModel, relations } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

import { membersToProducts, settlements } from '.';

export const products = sqliteTable(
	'product',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		price: integer().notNull(),
		settlementId: text()
			.notNull()
			.references(() => settlements.id, {
				onDelete: 'cascade'
			})
	},
	(t) => [index('product_settlement_idx').on(t.settlementId)]
);

export const productsRelations = relations(products, ({ one, many }) => ({
	settlement: one(settlements, {
		fields: [products.settlementId],
		references: [settlements.id]
	}),
	members: many(membersToProducts)
}));

export type Product = InferSelectModel<typeof products>;
export type ProductInsert = InferInsertModel<typeof products>;
