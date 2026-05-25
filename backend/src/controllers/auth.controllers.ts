import type { Request, Response } from "express";
import type { MessageRes, UserRes } from "../../../shared/dtos.js";

// GET /me
export function authMe(req: Request, res: Response<UserRes | MessageRes>) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
}
