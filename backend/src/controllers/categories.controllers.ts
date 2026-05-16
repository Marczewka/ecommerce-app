import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import type { Request, Response } from "express";
import type {
    CategoryAdminReq,
    CategoryAdminRes,
    CategoryRes,
    ErrorRes,
} from "../../../shared/dtos.js";

// GET /
export async function getCategories(
    req: Request,
    res: Response<CategoryRes[]>,
) {
    const allCategories = await db
        .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
        })
        .from(categories);

    res.json(allCategories);
}

// ADMIN
// GET /admin
export async function getAdminCategories(
    req: Request,
    res: Response<CategoryAdminRes[]>,
) {
    const allCategories = await db.select().from(categories);

    res.json(allCategories);
}

// POST /admin
export async function createAdminCategory(
    req: Request<{}, {}, CategoryAdminReq>,
    res: Response<CategoryAdminRes | ErrorRes>,
) {
    const [insertedCategory] = await db
        .insert(categories)
        .values(req.body)
        .returning();

    res.status(201).json(insertedCategory);
}

// PUT /admin/:id
export async function updateAdminCategory(
    req: Request<{ id: string }, {}, CategoryAdminReq>,
    res: Response<CategoryAdminRes | ErrorRes>,
) {
    const { id } = req.params;
    const [updatedCategory] = await db
        .update(categories)
        .set(req.body)
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
}

// DELETE /admin/:id
export async function deleteAdminCategory(
    req: Request<{ id: string }>,
    res: Response<CategoryAdminRes | ErrorRes>,
) {
    const { id } = req.params;
    const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!deletedCategory)
        return res.status(404).json({ message: "Category notfound" });
    res.json(deletedCategory);
}
