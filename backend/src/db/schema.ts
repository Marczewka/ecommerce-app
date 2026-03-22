import { sql } from "drizzle-orm";
import {
  check,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("client"),
});

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: text("image"),
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
    images: text("images").array(),
  },
  (table) => [check("price_check", sql`${table.price} >= 0`)],
);

export const orders = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    status: varchar("status", { length: 255 }).default("pending"),
    shippingAddress: text("shipping_address").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [check("total_price_check", sql`${table.totalPrice} >= 0`)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    orderId: integer("order_id")
      .references(() => orders.id, { onDelete: "restrict" })
      .notNull(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [check("unit_price_check", sql`${table.unitPrice} >= 0`)],
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertCategories = typeof categories.$inferInsert;
export type SelectCategories = typeof categories.$inferSelect;

export type InsertProducts = typeof products.$inferInsert;
export type SelectProducts = typeof products.$inferSelect;

export type InsertOrders = typeof orders.$inferInsert;
export type SelectOrders = typeof orders.$inferSelect;

export type InsertOrderItems = typeof orderItems.$inferInsert;
export type SelectOrderItems = typeof orderItems.$inferSelect;
