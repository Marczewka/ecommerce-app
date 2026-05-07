import express from "express";
import bcrypt from "bcrypt";
import { users, carts } from "../db/schema.js";
import { db } from "../db/index.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

const UserRegisterSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username has to be at least 3 characters long")
        .max(20, "Username has to be at most 20 characters long"),
    password: z
        .string()
        .min(8, "Password has to be at least 8 characters long")
        .max(20, "Password has to be at most 20 characters long")
        .regex(
            /[A-Z]/,
            "Password has to contain at least one uppercase letter",
        ),
});

// GET /
router.get("/", authenticateToken, isAdmin, async (req, res) => {
    const safeUsers = await db
        .select({
            id: users.id,
            username: users.username,
        })
        .from(users);

    res.json(safeUsers);
});

// POST /register
router.post("/register", async (req, res) => {
    const result = await UserRegisterSchema.safeParseAsync(req.body);

    if (!result.success) {
        return res.status(400).json(z.treeifyError(result.error));
    }

    const { username, password } = result.data;

    const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

    if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
        .insert(users)
        .values({
            username,
            passwordHash: hashedPassword,
        })
        .returning({
            id: users.id,
            username: users.username,
            role: users.role,
        });

    if (newUser) {
        await db.insert(carts).values({
            userId: newUser.id,
        });
    }

    if (!newUser) {
        return res.status(400).json({ message: "User not created" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
    );

    res.json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
        },
        token: token,
    });
});

// POST /login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

    if (!user) {
        return res
            .status(401)
            .json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ message: "Invalid username or password" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
    );

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
        token: token,
    });
});

// DELETE /:id
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const deletedUser = await db
        .delete(users)
        .where(eq(users.id, Number(id)))
        .returning();

    if (deletedUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(deletedUser[0]);
});

export default router;
