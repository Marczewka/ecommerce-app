import express from "express";
import type { Request, Response, NextFunction } from "express";
import productsRouter from "./routes/products.js";

const app = express();

app.use("/products", productsRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
