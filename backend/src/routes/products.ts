import express from "express";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, categories } from "../db/schema.js";

const router = express.Router();

// GET /?search=searchQuery
router.get("/", async (req, res) => {
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
  }

  const relevance = search
    ? sql<number>`similarity(${products.title}, ${search})`
    : sql<number>`1`;

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
  const product = await db
    .select({
      title: products.title,
      price: products.price,
      description: products.description,
      image: products.image,
    })
    .from(products)
    .where(eq(products.slug, productSlug));

  if (product.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(product[0]);
});

// POST /
router.post("/", async (req, res) => {
  const insertedProduct = await db
    .insert(products)
    .values(req.body)
    .returning();
  res.status(201).json(insertedProduct[0]);
});

// PUT /:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await db
    .update(products)
    .set(req.body)
    .where(eq(products.id, Number(id)))
    .returning();

  if (updatedProduct.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(updatedProduct[0]);
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await db
    .delete(products)
    .where(eq(products.id, Number(id)))
    .returning();

  if (deletedProduct.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(deletedProduct[0]);
});

export default router;
