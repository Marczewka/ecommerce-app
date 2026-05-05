import express from "express";
import { and, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, cartItems, carts } from "../db/schema.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// GET /?search=searchQuery
router.get("/", optionalAuth, async (req, res) => {
    const { search } = req.query;

    const filters = [];

    if (search) {
        filters.push(sql`
            (
                ${products.title} ILIKE ${"%" + search + "%"}
                OR 
                (set_limit(0.10) IS NOT NULL AND ${products.title} % ${search})
            )
        `);
        const relevance = sql<number>`similarity(${products.title}, ${search})`;
    }

    const relevance = search
        ? sql<number>`similarity(${products.title}, ${search})`
        : sql<number>`1`;

    const userId = req.user?.id;

    if (userId) {
        const productList = await db
            .select({
                title: products.title,
                slug: products.slug,
                price: products.price,
                image: products.image,
                quantityInCart: cartItems.quantity,
            })
            .from(products)
            .leftJoin(cartItems, eq(cartItems.productId, products.id))
            .where(and(...filters))
            .orderBy(() => (search ? desc(relevance) : products.id));

        return res.json(productList);
    }
    const productList = await db
        .select({
            title: products.title,
            slug: products.slug,
            price: products.price,
            image: products.image,
        })
        .from(products)
        .where(and(...filters))
        .orderBy(() => (search ? desc(relevance) : products.id));

    res.json(productList);
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
