import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders } from "../db/schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const allOrders = await db.select().from(orders);
  res.json(allOrders);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, Number(id)));

  if (order.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(order[0]);
});

router.post("/", async (req, res) => {
  const insertedProduct = await db.insert(orders).values(req.body).returning();
  res.status(201).json(insertedProduct[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await db
    .update(orders)
    .set(req.body)
    .where(eq(orders.id, Number(id)))
    .returning();

  if (updatedProduct.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(updatedProduct[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await db
    .delete(orders)
    .where(eq(orders.id, Number(id)))
    .returning();

  if (deletedProduct.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(deletedProduct[0]);
});

export default router;
