import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories, products } from "../db/schema.js";

const router = express.Router();

// GET /
router.get("/", async (req, res) => {
  const allCategories = await db.select().from(categories);
  res.json(allCategories);
});

// GET /:categorySlug
router.get("/:categorySlug", async (req, res) => {
  const { categorySlug } = req.params;
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug));

  if (category.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(category[0]);
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
