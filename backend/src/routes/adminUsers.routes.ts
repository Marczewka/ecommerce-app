import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
    deleteAdminUser,
    getAdminUsers,
    updateAdminUser,
} from "../controllers/users.controllers.js";

const router = express.Router();

// GET
router.get("/", authenticateToken, isAdmin, getAdminUsers);

// PUT
router.put("/:id", authenticateToken, isAdmin, updateAdminUser);

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, deleteAdminUser);

export default router;
