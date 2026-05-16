import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRes } from "../../../shared/dtos.js";

export const optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.user = null;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !process.env.JWT_SECRET) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserRes;

        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
        };

        next();
    } catch {
        next();
    }
};
