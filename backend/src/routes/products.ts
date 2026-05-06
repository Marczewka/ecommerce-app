import express from "express";
import { and, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, cartItems, carts, categories } from "../db/schema.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// GET /categories{/:categorySlug}/?search=query
router.get("/categories{/:categorySlug}", optionalAuth, async (req, res) => {
    const categorySlug = req.params.categorySlug;
    const { search } = req.query;
    const userId = req.user?.id;

    let categoryData = null;

    if (categorySlug && typeof categorySlug !== "string") {
        return res.status(400).json({ message: "Invalid category slug" });
    }

    if (categorySlug) {
        categoryData = await db
            .select({ id: categories.id, name: categories.name })
            .from(categories)
            .where(eq(categories.slug, categorySlug))
            .limit(1)
            .then((rows) => rows[0]);

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
            quantityInCart: userId
                ? cartItems.quantity
                : sql<number>`0`.as("quantity_in_cart"),
        })
        .from(products);

    if (userId) {
        query.leftJoin(cartItems, eq(cartItems.productId, products.id));
    }

    const productList = await query
        .where(and(...filters))
        .orderBy(() => (search ? desc(relevance) : products.id));

    res.json({
        ...(categoryData && { categoryName: categoryData.name }),
        products: productList,
    });
});

// GET /:productSlug
router.get("/:productSlug", async (req, res) => {
    const { productSlug } = req.params;
    const [product] = await db
        .select({
            title: products.title,
            price: products.price,
            description: products.description,
            image: products.image,
        })
        .from(products)
        .where(eq(products.slug, productSlug));

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// POST /
router.post("/", authenticateToken, isAdmin, async (req, res) => {
    const [insertedProduct] = await db
        .insert(products)
        .values(req.body)
        .returning();
    res.status(201).json(insertedProduct);
});

// PUT /:id
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const [updatedProduct] = await db
        .update(products)
        .set(req.body)
        .where(eq(products.id, Number(id)))
        .returning();

    if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
});

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, Number(id)))
        .returning();

    if (!deletedProduct)
        return res.status(404).json({ message: "Product not found" });
    res.json(deletedProduct);
});

export default router;
