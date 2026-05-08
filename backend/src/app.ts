import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import usersRouter from "./routes/users.js";
import cartsRouter from "./routes/carts.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(
    cors({
        origin: ["https://grzegorzmarczewski.me", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
});

export default app;
