import {
  type InferSelectModel,
  type InferInsertModel,
  relations,
} from "drizzle-orm";
import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

import { members, products } from ".";

export const membersToProducts = sqliteTable(
  "members_to_products",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, {
        onDelete: "cascade",
      }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.productId] }),
  })
);

export const membersToProductsRelations = relations(
  membersToProducts,
  ({ one }) => ({
    member: one(members, {
      fields: [membersToProducts.memberId],
      references: [members.id],
    }),
    product: one(products, {
      fields: [membersToProducts.productId],
      references: [products.id],
    }),
  })
);

export type MembersToProducts = InferSelectModel<typeof membersToProducts>;
export type MembersToProductsInsert = InferInsertModel<
  typeof membersToProducts
>;
