import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/me", (req, res) => {
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
        const userData = jwt.verify(token, secret) as {
            id: number;
            username: string;
            role: string;
        };

        return res.status(200).json(userData);
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

export default router;
