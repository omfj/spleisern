import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { settlements, membersToProducts } from ".";

export const members = sqliteTable(
  "member",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    settlementId: text("settlement_id")
      .notNull()
      .references(() => settlements.id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    settlementIdx: index("member_settlement_idx").on(t.settlementId),
  })
);

export const membersRelations = relations(members, ({ one, many }) => ({
  settlement: one(settlements, {
    fields: [members.settlementId],
    references: [settlements.id],
  }),
  products: many(membersToProducts),
}));

export type Member = InferSelectModel<typeof members>;
export type MemberInsert = InferInsertModel<typeof members>;
