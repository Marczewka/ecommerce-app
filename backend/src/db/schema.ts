import { sql, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import {
    check,
    decimal,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
    varchar,
} from "drizzle-orm/pg-core";
import type { UserRole } from "../../../shared/dtos.js";

export const categories = pgTable("categories", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable(
    "products",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        title: varchar("title", { length: 255 }).notNull().unique(),
        slug: varchar("slug", { length: 255 }).notNull().unique(),
        price: decimal("price", { precision: 12, scale: 2 }).notNull(),
        description: text("description"),
        categoryId: integer("category_id")
            .references(() => categories.id, { onDelete: "restrict" })
            .notNull(),
        image: text("image"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
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
    role: varchar("role", { length: 255 })
        .$type<UserRole>()
        .notNull()
        .default("client"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const carts = pgTable("carts", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
});

export const cartItems = pgTable(
    "cart_items",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        cartId: integer("cart_id")
            .notNull()
            .references(() => carts.id, { onDelete: "cascade" }),
        productId: integer("product_id")
            .notNull()
            .references(() => products.id),
        quantity: integer("quantity").notNull().default(1),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        unique("cart_product_unique").on(table.cartId, table.productId),
        check("quantity_check", sql`${table.quantity} > 0`),
    ],
);

export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type User = InferSelectModel<typeof users>;
export type Cart = InferSelectModel<typeof carts>;
export type CartItem = InferSelectModel<typeof cartItems>;

export type NewCategory = InferInsertModel<typeof categories>;
export type NewProduct = InferInsertModel<typeof products>;
export type NewUser = InferInsertModel<typeof users>;
export type NewCart = InferInsertModel<typeof carts>;
export type NewCartItem = InferInsertModel<typeof cartItems>;
