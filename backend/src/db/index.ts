import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL found in .env");

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
