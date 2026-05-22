import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
    createAdminCategory,
    deleteAdminCategory,
    getAdminCategories,
    updateAdminCategory,
} from "../controllers/categories.controllers.js";

const router = express.Router();

// GET
router.get("/", authenticateToken, isAdmin, getAdminCategories);

// POST
router.post("/", authenticateToken, isAdmin, createAdminCategory);

// PUT /:id
router.put("/:id", authenticateToken, isAdmin, updateAdminCategory);

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, deleteAdminCategory);

export default router;
