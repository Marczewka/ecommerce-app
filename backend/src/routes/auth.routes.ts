import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { me } from "../controllers/auth.controllers.js";

const router = express.Router();

// GET /me
router.get("/me", authenticateToken, me);

export default router;
