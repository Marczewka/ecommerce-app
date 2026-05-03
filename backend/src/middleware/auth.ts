import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
