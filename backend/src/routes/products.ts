import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, categories } from "../db/schema.js";

const router = express.Router();

// GET /?categorySlug=categorySlug
router.get("/", async (req, res) => {
  const { categorySlug } = req.query;
  let query = db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      price: products.price,
      description: products.description,
      images: products.images,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .$dynamic();
  if (typeof categorySlug === "string") {
    query = query.where(eq(categories.slug, categorySlug));
  }
  const filteredProducts = await query;
  res.json(filteredProducts);
});

// GET /:productSlug
router.get("/:productSlug", async (req, res) => {
  const { productSlug } = req.params;
  const product = await db
    .select()
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
