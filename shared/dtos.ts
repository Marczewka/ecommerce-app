import type {
    Category,
    Product,
    User,
    Cart,
    CartItem,
} from "../backend/src/db/schema.js";
import type {
    NewCategory,
    NewProduct,
    NewUser,
    NewCart,
    NewCartItem,
} from "../backend/src/db/schema.js";
import { z } from "zod";

export const UserRegisterSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username has to be at least 3 characters long")
        .max(20, "Username has to be at most 20 characters long"),
    password: z
        .string()
        .min(8, "Password has to be at least 8 characters long")
        .max(20, "Password has to be at most 20 characters long")
        .regex(
            /[A-Z]/,
            "Password has to contain at least one uppercase letter",
        ),
});

export interface ErrorRes {
    message: string;
}

export interface ValidationErrorRes {
    errors: string[];
    properties?: {
        username?: { errors: string[] };
        password?: { errors: string[] };
    };
}

// USER
export type UserRole = "admin" | "user";

export type UserRes = Pick<User, "id" | "username"> & {
    role: UserRole;
};

export type UserAdminRes = Omit<User, "passwordHash">;

// AUTH
export type AuthReq = z.infer<typeof UserRegisterSchema>;

export interface AuthRes {
    message: string;
    user: UserRes;
    token: string;
}

// PRODUCT
export type ProductRes = Pick<
    Product,
    "id" | "title" | "slug" | "price" | "image"
>;

export interface ProductItemRes extends ProductRes {
    quantity: number;
}

export interface ProductDetailsRes extends ProductItemRes {
    description: string | null;
}

export interface ProductListRes {
    categoryName?: string;
    products: ProductItemRes[];
}

export type ProductAdminReq = Omit<
    NewProduct,
    "id" | "createdAt" | "updatedAt"
>;

export type ProductAdminRes = Product;

// CATEGORY
export type CategoryRes = Pick<Category, "id" | "name" | "slug">;

export type CategoryAdminRes = Category;

export type CategoryAdminReq = Omit<
    NewCategory,
    "id" | "createdAt" | "updatedAt"
>;

// CART
export type CartItemRes = Pick<CartItem, "id" | "productId" | "quantity">;

export interface CartAdminRes {
    cartId: number;
    username: string;
    productTitle: string;
    quantity: number;
    price: string;
}
