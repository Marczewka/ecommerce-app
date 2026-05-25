import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, cartItems, carts, categories } from "../db/schema.js";
import type { Request, Response } from "express";
import type {
    MessageRes,
    ProductDetailsRes,
    ProductListRes,
    ProductAdminReq,
    ProductAdminRes,
} from "../../../shared/dtos.js";
import slugify from "slugify";
import { or } from "drizzle-orm";

// GET /categories{/:categorySlug}/?search=query
export async function getProducts(
    req: Request<{ categorySlug?: string }, {}, {}, { search?: string }>,
    res: Response<ProductListRes | MessageRes>,
) {
    const categorySlug = req.params.categorySlug;
    const { search } = req.query;
    const userId = req.user?.id;

    let categoryData = null;

    if (categorySlug && typeof categorySlug !== "string") {
        return res.status(400).json({ message: "Invalid category slug" });
    }

    if (categorySlug) {
        [categoryData] = await db
            .select({ id: categories.id, name: categories.name })
            .from(categories)
            .where(eq(categories.slug, categorySlug))
            .limit(1);

        if (!categoryData) {
            return res.status(404).json({ message: "Category not found" });
        }
    }

    const filters = [];
    if (categoryData) {
        filters.push(eq(products.categoryId, categoryData.id));
    }

    if (search) {
        filters.push(sql`
            (${products.title} ILIKE ${"%" + search + "%"}
            OR 
            (set_limit(0.10) IS NOT NULL AND ${products.title} % ${search}))
        `);
    }

    const relevance = search
        ? sql<number>`similarity(${products.title}, ${search})`
        : sql<number>`1`;

    const query = db
        .select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            price: products.price,
            image: products.image,
            quantity: (userId
                ? sql<number>`COALESCE(${cartItems.quantity}, 0)`
                : sql<number>`0`
            ).as("quantity"),
        })
        .from(products);

    if (userId) {
        query
            .leftJoin(carts, eq(carts.userId, userId))
            .leftJoin(
                cartItems,
                and(
                    eq(cartItems.productId, products.id),
                    eq(cartItems.cartId, carts.id),
                ),
            );
    }

    const productList = await query
        .where(and(...filters))
        .orderBy(search ? desc(relevance) : products.id);

    res.json({
        ...(categoryData && { categoryName: categoryData.name }),
        products: productList,
    });
}

// GET /:productSlug
export async function getProduct(
    req: Request<{ productSlug: string }>,
    res: Response<ProductDetailsRes | MessageRes>,
) {
    const { productSlug } = req.params;
    const userId = req.user?.id;

    if (typeof productSlug !== "string") {
        return res.status(400).json({ message: "Invalid product slug" });
    }

    const query = db
        .select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            price: products.price,
            description: products.description,
            image: products.image,
            quantity: (userId
                ? sql<number>`COALESCE(${cartItems.quantity}, 0)`
                : sql<number>`0`
            ).as("quantity"),
        })
        .from(products)
        .where(eq(products.slug, productSlug));

    if (userId) {
        query
            .leftJoin(carts, eq(carts.userId, userId))
            .leftJoin(
                cartItems,
                and(
                    eq(cartItems.productId, products.id),
                    eq(cartItems.cartId, carts.id),
                ),
            );
    }

    const [product] = await query;

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
}

// ADMIN
// GET
export async function getAdminProducts(
    _req: Request,
    res: Response<ProductAdminRes[]>,
) {
    const allProducts = await db.select().from(products);

    res.json(allProducts);
}

// POST
export async function createAdminProduct(
    req: Request<{}, {}, ProductAdminReq>,
    res: Response<ProductAdminRes | MessageRes>,
) {
    const { title, slug, price, description, categoryId, image } = req.body;

    if (Number(price) < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
    }

    const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(categoryId)))
        .limit(1);

    if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    const [existingProduct] = await db
        .select({ title: products.title, slug: products.slug })
        .from(products)
        .where(or(eq(products.title, title), eq(products.slug, slug)))
        .limit(1);

    if (existingProduct) {
        if (existingProduct.title === title) {
            return res
                .status(400)
                .json({ message: "Product with this title already exists" });
        }
        if (existingProduct.slug === slug) {
            return res
                .status(400)
                .json({ message: "Product with this slug already exists" });
        }
    }

    const [insertedProduct] = await db
        .insert(products)
        .values({
            title,
            slug: slug,
            price: price,
            description: description,
            categoryId: categoryId,
            image: image,
        })
        .returning();

    res.status(201).json(insertedProduct);
}

// PUT /:id
export async function updateAdminProduct(
    req: Request<{ id: string }, {}, ProductAdminReq>,
    res: Response<ProductAdminRes | MessageRes>,
) {
    const { id } = req.params;
    const { title, slug, price, description, categoryId, image } = req.body;

    if (Number(price) < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
    }

    const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(categoryId)))
        .limit(1);

    if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    const [existingProduct] = await db
        .select({ id: products.id, title: products.title, slug: products.slug })
        .from(products)
        .where(or(eq(products.title, title), eq(products.slug, slug)))
        .limit(1);

    if (existingProduct && existingProduct.id !== Number(id)) {
        if (existingProduct.title === title) {
            return res
                .status(400)
                .json({ message: "Product with this title already exists" });
        }
        if (existingProduct.slug === slug) {
            return res
                .status(400)
                .json({ message: "Product with this slug already exists" });
        }
    }

    const [updatedProduct] = await db
        .update(products)
        .set({
            title,
            slug: slug,
            price: price,
            description: description,
            categoryId: categoryId,
            image: image,
        })
        .where(eq(products.id, Number(id)))
        .returning();

    if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
}

// DELETE /:id
export async function deleteAdminProduct(
    req: Request<{ id: string }>,
    res: Response<ProductAdminRes | MessageRes>,
) {
    const { id } = req.params;

    const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, Number(id)))
        .returning();

    if (!deletedProduct)
        return res.status(404).json({ message: "Product not found" });
    res.json(deletedProduct);
}
