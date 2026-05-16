import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
    deleteAdminUser,
    getAdminUsers,
    login,
    register,
} from "../controllers/users.controllers.js";

const router = express.Router();

// POST /register
router.post("/register", register);

// POST /login
router.post("/login", login);

// ADMIN
// GET /admin
router.get("/admin", authenticateToken, isAdmin, getAdminUsers);

// DELETE /admin/:id
router.delete("/admin/:id", authenticateToken, isAdmin, deleteAdminUser);

export default router;
