import express from "express";
import type { Request, Response } from "express";
import { authenticateToken } from "../middleware/auth.js";
import type { ErrorRes, UserRes } from "../../../shared/dtos.js";

const router = express.Router();

// GET /me
router.get(
    "/me",
    authenticateToken,
    (req: Request, res: Response<UserRes | ErrorRes>) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        res.json(req.user);
    },
);

export default router;
