import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import "../loadEnv.js";

if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL found");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);
