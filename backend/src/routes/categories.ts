import express from "express";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { cartItems, categories, products } from "../db/schema.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// GET /
router.get("/", async (req, res) => {
    const allCategories = await db.select().from(categories);

    res.json(allCategories);
});

// GET /:categorySlug?search=searchQuery
router.get("/:categorySlug", optionalAuth, async (req, res) => {
    const { categorySlug } = req.params;
    const { search } = req.query;

    if (typeof categorySlug !== "string") {
        return res.status(400).json({ message: "Invalid category slug" });
    }

    const category = await db
        .select({
            id: categories.id,
            name: categories.name,
        })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1)
        .then((rows) => rows[0]);

    if (!category)
        return res.status(404).json({ message: "Category not found" });

    const filters = [eq(products.categoryId, category.id)];

    if (search) {
        filters.push(sql`
        (
            ${products.title} ILIKE ${"%" + search + "%"}
            OR 
            (set_limit(0.10) IS NOT NULL AND ${products.title} % ${search})
        )
    `);
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

        return res.json({
            categoryName: category.name,
            products: productList,
        });
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

    res.json({
        categoryName: category.name,
        products: productList,
    });
});

// POST /
router.post("/", authenticateToken, isAdmin, async (req, res) => {
    const [insertedCategory] = await db
        .insert(categories)
        .values(req.body)
        .returning();

    res.status(201).json(insertedCategory);
});

// PUT /:id
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const [updatedCategory] = await db
        .update(categories)
        .set(req.body)
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });

    res.json(updatedCategory);
});

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!deletedCategory)
        return res.status(404).json({ message: "Category notfound" });

    res.json(deletedCategory);
});

export default router;
