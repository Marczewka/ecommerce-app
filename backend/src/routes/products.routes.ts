import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    getProduct,
    getProducts,
    updateAdminProduct,
} from "../controllers/products.controllers.js";

const router = express.Router();

// GET /categories{/:categorySlug}/?search=query
router.get("/categories{/:categorySlug}", optionalAuth, getProducts);

// GET /:productSlug
router.get("/:productSlug", optionalAuth, getProduct);

// ADMIN
// GET /admin
router.get("/admin", authenticateToken, isAdmin, getAdminProducts);

// POST /admin
router.post("/admin", authenticateToken, isAdmin, createAdminProduct);

// PUT /admin/:id
router.put("/admin/:id", authenticateToken, isAdmin, updateAdminProduct);

// DELETE /admin/:id
router.delete("/admin/:id", authenticateToken, isAdmin, deleteAdminProduct);

export default router;
