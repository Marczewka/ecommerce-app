import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// GET /
router.get("/", async (req, res) => {
    const allCategories = await db.select().from(categories);

    res.json(allCategories);
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
