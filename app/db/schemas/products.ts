import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

import { membersToProducts, settlements } from ".";

export const products = sqliteTable(
  "product",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    settlementId: text("settlement_id")
      .notNull()
      .references(() => settlements.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    settlementIdx: index("product_settlement_idx").on(t.settlementId),
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  settlement: one(settlements, {
    fields: [products.settlementId],
    references: [settlements.id],
  }),
  members: many(membersToProducts),
}));

export type Product = InferSelectModel<typeof products>;
export type ProductInsert = InferInsertModel<typeof products>;
