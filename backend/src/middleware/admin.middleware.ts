import type { Request, Response, NextFunction } from "express";
import type { MessageRes } from "../../../shared/dtos.js";

export const isAdmin = (
    req: Request,
    res: Response<MessageRes>,
    next: NextFunction,
) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin permissions required" });
    }
};
