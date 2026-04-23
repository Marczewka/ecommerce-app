import express from "express";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories, products } from "../db/schema.js";

const router = express.Router();

// GET /
router.get("/", async (req, res) => {
  const allCategories = await db.select().from(categories);

  res.json(allCategories);
});

// GET /:categorySlug?search=searchQuery
router.get("/:categorySlug", async (req, res) => {
  const { categorySlug } = req.params;
  const { search } = req.query;

  const category = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!category) return res.status(404).json({ error: "Category not found" });

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

  const filteredProducts = await db
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
    products: filteredProducts,
  });
});

// POST /
router.post("/", async (req, res) => {
  const insertedCategory = await db
    .insert(categories)
    .values(req.body)
    .returning();

  res.status(201).json(insertedCategory[0]);
});

// PUT /:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCategory = await db
    .update(categories)
    .set(req.body)
    .where(eq(categories.id, Number(id)))
    .returning();

  if (updatedCategory.length === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(updatedCategory[0]);
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await db
    .delete(categories)
    .where(eq(categories.id, Number(id)))
    .returning();

  if (deletedCategory.length === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(deletedCategory[0]);
});

export default router;
