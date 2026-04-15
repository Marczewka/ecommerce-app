import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
