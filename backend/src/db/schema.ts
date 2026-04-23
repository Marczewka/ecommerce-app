import { sql } from "drizzle-orm";
import {
  check,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: varchar("title", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    description: text("description"),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    image: text("image"),
  },
  (table) => [
    check("price_check", sql`${table.price} >= 0`),
    index("title_trgm_idx").using("gin", sql`${table.title} gin_trgm_ops`),
    index("category_id_idx").on(table.categoryId),
  ],
);

export type InsertCategories = typeof categories.$inferInsert;
export type SelectCategories = typeof categories.$inferSelect;

export type InsertProducts = typeof products.$inferInsert;
export type SelectProducts = typeof products.$inferSelect;
