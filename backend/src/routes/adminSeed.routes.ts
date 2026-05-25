import express from "express";
import { seed } from "../controllers/seed.controllers.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST
router.post("/", authenticateToken, isAdmin, seed);

export default router;
