import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authMe } from "../controllers/auth.controllers.js";

const router = express.Router();

// GET /me
router.get("/me", authenticateToken, authMe);

export default router;
