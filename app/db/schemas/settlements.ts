import {
  InferSelectModel,
  InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { members } from "./members";
import { products } from "./products";

export const settlements = sqliteTable("settlement", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(),
  isPublic: integer("is_public", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const settlementsRelations = relations(settlements, ({ many }) => ({
  products: many(products),
  members: many(members),
}));

export type Settlement = InferSelectModel<typeof settlements>;
export type SettlementInsert = InferInsertModel<typeof settlements>;
