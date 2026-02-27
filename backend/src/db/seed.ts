import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { categories, products } from "./schema.js";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  try {
    console.log("Fetching data...");
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch("https://api.escuelajs.co/api/v1/categories"),
      fetch("https://api.escuelajs.co/api/v1/products"),
    ]);

    const categoriesData: string[] = await categoriesResponse.json();
    const productsData: any[] = await productsResponse.json();

    console.log("Clearing existing data...");
    await db.delete(products);
    await db.delete(categories);

    console.log("Seeding categories...");
    await db.insert(categories).values(
      categoriesData.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
      })),
    );

    console.log("Seeding products...");
    await db.insert(products).values(
      productsData.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        description: p.description,
        categoryId: p.category.id,
        images: p.images,
      })),
    );

    console.log("✅ Database successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
