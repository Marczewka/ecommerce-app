import type { Request, Response } from "express";
import type { MessageRes } from "../../../shared/dtos.js";
import { db } from "../db/index.js";
import { carts, categories, products, users } from "../db/schema.js";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";
import mockData from "../db/mockData.json" with { type: "json" };

// ADMIN
// POST
export async function seed(
    _req: Request,
    res: Response<{ message: string } | MessageRes>,
) {
    console.log("Loading mock data...");
    const productsData = mockData as any[];

    await db.transaction(async (tx) => {
        console.log("Clearing existing data...");
        await tx.execute(
            sql`TRUNCATE TABLE categories, products, users, carts, cart_items RESTART IDENTITY CASCADE`,
        );

        console.log("Seeding categories...");
        const uniqueCategories = [
            ...new Set(productsData.map((p) => p.category)),
        ];

        const insertedCategories = await tx
            .insert(categories)
            .values(
                uniqueCategories.map((category) => ({
                    name: category,
                    slug: slugify(category, { lower: true }),
                })),
            )
            .returning();

        const categoryMap = Object.fromEntries(
            insertedCategories.map((c) => [c.name, c.id]),
        );

        console.log("Seeding products...");
        await tx.insert(products).values(
            productsData.map((p) => {
                const categoryId = categoryMap[p.category];
                if (!categoryId) {
                    throw new Error(`No ID found for category: ${p.category}`);
                }
                return {
                    title: p.title,
                    slug: slugify(p.title, { lower: true }),
                    price: p.price,
                    description: p.description,
                    categoryId: categoryId,
                    image: p.image,
                };
            }),
        );

        console.log("Seeding users...");
        const insertedUsers = await tx
            .insert(users)
            .values([
                {
                    username: "admin",
                    passwordHash: await bcrypt.hash("Password", 10),
                    role: "admin",
                },
                {
                    username: "client",
                    passwordHash: await bcrypt.hash("Password", 10),
                    role: "client",
                },
            ])
            .returning({
                id: users.id,
            });

        const [newAdmin, newClient] = insertedUsers;
        if (!newAdmin?.id || !newClient?.id) {
            throw new Error("User creation failed");
        }

        await tx.insert(carts).values([
            {
                userId: newAdmin.id,
            },
            {
                userId: newClient.id,
            },
        ]);
    });

    console.log("Database successfully seeded!");

    return res.status(200).json({
        message: `Seed data initialized successfully. Planted ${productsData.length} products.`,
    });
}
