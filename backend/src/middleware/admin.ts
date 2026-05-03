import type { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user && (req as any).user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin permissions required" });
    }
};
