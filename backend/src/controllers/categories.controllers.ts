import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import type { Request, Response } from "express";
import type {
    CategoryAdminReq,
    CategoryAdminRes,
    CategoryRes,
    MessageRes,
} from "@shared/dtos.js";
import slugify from "slugify";
import { or } from "drizzle-orm";

// GET /
export async function getCategories(
    _req: Request,
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
// GET
export async function getAdminCategories(
    _req: Request,
    res: Response<CategoryAdminRes[]>,
) {
    const allCategories = await db.select().from(categories);

    res.json(allCategories);
}

// POST
export async function createAdminCategory(
    req: Request<{}, {}, CategoryAdminReq>,
    res: Response<CategoryAdminRes | MessageRes>,
) {
    const { name, slug } = req.body;

    const generatedSlug = slug || slugify(name, { lower: true });

    const [existingCategory] = await db
        .select()
        .from(categories)
        .where(
            or(eq(categories.name, name), eq(categories.slug, generatedSlug)),
        );

    if (existingCategory) {
        if (existingCategory.name === name) {
            return res
                .status(400)
                .json({ message: "Category with this name already exists" });
        }
        if (existingCategory.slug === generatedSlug) {
            return res
                .status(400)
                .json({ message: "Category with this slug already exists" });
        }
    }

    const [insertedCategory] = await db
        .insert(categories)
        .values({ name, slug: generatedSlug })
        .returning();

    res.status(201).json(insertedCategory);
}

// PUT /:id
export async function updateAdminCategory(
    req: Request<{ id: string }, {}, CategoryAdminReq>,
    res: Response<CategoryAdminRes | MessageRes>,
) {
    const { id } = req.params;
    const { name, slug } = req.body;

    const generatedSlug = slug || slugify(name, { lower: true });

    const [existingCategory] = await db
        .select()
        .from(categories)
        .where(
            or(eq(categories.name, name), eq(categories.slug, generatedSlug)),
        );

    if (existingCategory && existingCategory.id !== Number(id)) {
        if (existingCategory.name === name) {
            return res
                .status(400)
                .json({ message: "Category with this name already exists" });
        }
        if (existingCategory.slug === generatedSlug) {
            return res
                .status(400)
                .json({ message: "Category with this slug already exists" });
        }
    }

    const [updatedCategory] = await db
        .update(categories)
        .set({ name, slug: generatedSlug })
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
}

// DELETE /:id
export async function deleteAdminCategory(
    req: Request<{ id: string }>,
    res: Response<CategoryAdminRes | MessageRes>,
) {
    const { id } = req.params;

    const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, Number(id)))
        .returning();

    if (!deletedCategory)
        return res.status(404).json({ message: "Category not found" });
    res.json(deletedCategory);
}
