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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("client"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    categoryId: integer("category_id").references(() => categories.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    stockQuantity: integer("stock_quantity").default(0),
    image_url: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check("price_check", sql`${table.price} >= 0`),
    check("stock_quantity_check", sql`${table.stockQuantity} >= 0`),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id),
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
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").references(() => orders.id),
    productId: integer("product_id").references(() => products.id),
    orderQuantity: integer("order_quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    check("order_quantity_check", sql`${table.orderQuantity} >= 0`),
    check("unit_price_check", sql`${table.unitPrice} >= 0`),
  ],
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
