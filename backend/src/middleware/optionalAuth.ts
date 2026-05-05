import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !process.env.JWT_SECRET) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            id: number;
            role: string;
        };

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        next();
    }
};
