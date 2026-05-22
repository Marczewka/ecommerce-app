import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct,
} from "../controllers/products.controllers.js";

const router = express.Router();

// GET
router.get("/", authenticateToken, isAdmin, getAdminProducts);

// POST
router.post("/", authenticateToken, isAdmin, createAdminProduct);

// PUT /:id
router.put("/:id", authenticateToken, isAdmin, updateAdminProduct);

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, deleteAdminProduct);

export default router;
