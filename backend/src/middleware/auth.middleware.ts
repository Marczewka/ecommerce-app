import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { MessageRes, UserRes, UserRole } from "../../../shared/dtos.js";

export const authenticateToken = (
    req: Request,
    res: Response<MessageRes>,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as UserRes;

        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
