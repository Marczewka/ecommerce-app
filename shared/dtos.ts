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

export interface MessageRes {
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
type User = {
    id: number;
    username: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
};

type NewUser = {
    username: string;
    passwordHash: string;
    role: string;
};

export const USER_ROLES = ["admin", "client"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserRes = Pick<User, "id" | "username"> & {
    role: UserRole;
};

export type UserAdminReq = NewUser;

export type UserUpdateAdminReq = Omit<
    UserAdminReq,
    "username" | "passwordHash"
>;

export type UserAdminRes = Omit<User, "passwordHash">;

// AUTH
export type AuthReq = z.infer<typeof UserRegisterSchema>;

export interface AuthRes {
    message: string;
    user: UserRes;
    token: string;
}

// PRODUCT
type Product = {
    id: number;
    createdAt: Date;
    title: string;
    slug: string;
    price: string;
    description: string | null;
    categoryId: number;
    image: string | null;
};

type NewProduct = {
    title: string;
    slug: string;
    price: string;
    categoryId: number;
    image?: string | null | undefined;
    description?: string | null | undefined;
};

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

export type ProductAdminReq = NewProduct;

export type ProductAdminRes = Product;

// CATEGORY
type Category = {
    id: number;
    name: string;
    slug: string;
    createdAt: Date;
};

type NewCategory = {
    name: string;
    slug: string;
};

export type CategoryRes = Pick<Category, "id" | "name" | "slug">;

export type CategoryAdminRes = Category;

export type CategoryAdminReq = Omit<
    NewCategory,
    "id" | "createdAt" | "updatedAt"
>;

// CART
type CartItem = {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    updatedAt: Date;
};

export type CartItemRes = Pick<CartItem, "id" | "productId" | "quantity">;
