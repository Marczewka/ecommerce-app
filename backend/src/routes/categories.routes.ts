import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
    createAdminCategory,
    deleteAdminCategory,
    getAdminCategories,
    getCategories,
    updateAdminCategory,
} from "../controllers/categories.controllers.js";

const router = express.Router();

// GET /
router.get("/", getCategories);

// ADMIN
// GET /admin
router.get("/admin", authenticateToken, isAdmin, getAdminCategories);

// POST /admin
router.post("/admin", authenticateToken, isAdmin, createAdminCategory);

// PUT /admin/:id
router.put("/admin/:id", authenticateToken, isAdmin, updateAdminCategory);

// DELETE /admin/:id
router.delete("/admin/:id", authenticateToken, isAdmin, deleteAdminCategory);

export default router;
