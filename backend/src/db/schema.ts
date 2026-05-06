import { relations, sql } from "drizzle-orm";
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

export const carts = pgTable("carts", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => users.id)
        .notNull()
        .unique(),
});

export const cartItems = pgTable(
    "cart_items",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        cartId: integer("cart_id")
            .notNull()
            .references(() => carts.id),
        productId: integer("product_id")
            .notNull()
            .references(() => products.id),
        quantity: integer("item_quantity").notNull().default(1),
    },
    (table) => [
        unique("cart_product_unique").on(table.cartId, table.productId),
        check("item_quantity_check", sql`${table.quantity} > 0`),
    ],
);

export const usersRelations = relations(users, ({ many }) => ({
    carts: many(carts),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(users, {
        fields: [carts.userId],
        references: [users.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    product: one(products, {
        fields: [cartItems.productId],
        references: [products.id],
    }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    cartItems: many(cartItems),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));
