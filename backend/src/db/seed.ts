import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, products } from "./schema.js";
import slugify from "slugify";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
    try {
        console.log("Fetching data...");
        const productsResponse = await fetch(
            "https://fakestoreapi.com/products",
        );

        const productsData = (await productsResponse.json()) as any[];

        console.log("Clearing existing data...");
        await db.execute(
            sql`TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE`,
        );

        console.log("Seeding categories...");
        const uniqueCategories = [
            ...new Set(productsData.map((p) => p.category)),
        ];
        const insertedCategories = await db
            .insert(categories)
            .values(
                uniqueCategories.map((category) => ({
                    name: category,
                    slug: slugify(category, { lower: true }),
                })),
            )
            .returning();

        const categoryMap: Record<string, number> = Object.fromEntries(
            insertedCategories.map((c) => [c.name, c.id]),
        );

        console.log("Seeding products...");
        await db.insert(products).values(
            productsData.map((p) => {
                const categoryId = categoryMap[p.category];
                if (!categoryId) {
                    throw new Error(`No ID found for category: ${p.category}`);
                }
                return {
                    id: p.id,
                    title: p.title,
                    slug: slugify(p.title, { lower: true }),
                    price: p.price,
                    description: p.description,
                    categoryId: categoryId,
                    image: p.image,
                };
            }),
        );

        console.log("Database successfully seeded!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
