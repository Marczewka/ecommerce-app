import express from "express";
import cors from "cors";
import morgan from "morgan";

import adminCategories from "./routes/adminCategories.routes.js";
import adminProducts from "./routes/adminProducts.routes.js";
import adminUsersRouter from "./routes/adminUsers.routes.js";
import adminSeedRouter from "./routes/adminSeed.routes.js";

import publicAuthRouter from "./routes/publicAuth.routes.js";
import publicCartsRouter from "./routes/publicCarts.routes.js";
import publicCategoriesRouter from "./routes/publicCategories.routes.js";
import publicProductsRouter from "./routes/publicProducts.routes.js";
import publicUsersRouter from "./routes/publicUsers.routes.js";
import { interceptor } from "./middleware/interceptor.middleware.js";

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

app.use("/api/admin/categories", adminCategories);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/seed", adminSeedRouter);

app.use("/api/auth", publicAuthRouter);
app.use("/api/carts", publicCartsRouter);
app.use("/api/categories", publicCategoriesRouter);
app.use("/api/products", publicProductsRouter);
app.use("/api/users", publicUsersRouter);

app.use(interceptor);

export default app;
