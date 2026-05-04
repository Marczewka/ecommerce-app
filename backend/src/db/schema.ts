import { sql } from "drizzle-orm";
import {
    check,
    decimal,
    index,
    integer,
    pgTable,
    text,
    timestamp,
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

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull().default("client"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const carts = pgTable(
    "carts",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        userId: integer("user_id")
            .references(() => users.id)
            .notNull()
            .unique(),
        totalPrice: decimal("total_price", {
            precision: 12,
            scale: 2,
        }).notNull(),
        status: varchar("status", { length: 255 }).default("pending"),
        shippingAddress: text("shipping_address").notNull(),
    },
    (table) => [check("total_price_check", sql`${table.totalPrice} >= 0`)],
);

export const cartItems = pgTable(
    "cart_items",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        cartId: integer("cart_id").references(() => carts.id),
        productId: integer("product_id").references(() => products.id),
        itemQuantity: integer("item_quantity").notNull(),
        unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
    },
    (table) => [
        check("item_quantity_check", sql`${table.itemQuantity} >= 0`),
        check("unit_price_check", sql`${table.unitPrice} >= 0`),
    ],
);
