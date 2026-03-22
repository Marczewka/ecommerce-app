import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (user.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(user[0]);
});

router.post("/", async (req, res) => {
  const insertedUser = await db.insert(users).values(req.body).returning();
  res.status(201).json(insertedUser[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedUser = await db
    .update(users)
    .set(req.body)
    .where(eq(users.id, Number(id)))
    .returning();

  if (updatedUser.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(updatedUser[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, Number(id)))
    .returning();

  if (deletedUser.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json(deletedUser[0]);
});

export default router;
