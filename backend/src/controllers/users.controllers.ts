import bcrypt from "bcrypt";
import { users, carts } from "../db/schema.js";
import { db } from "../db/index.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { UserRegisterSchema } from "../../../shared/dtos.js";
import type {
    AuthReq,
    AuthRes,
    ErrorRes,
    UserAdminRes,
    UserRole,
    ValidationErrorRes,
} from "../../../shared/dtos.js";
import type { Request, Response } from "express";

// POST /register
export async function register(
    req: Request<{}, {}, AuthReq>,
    res: Response<AuthRes | ErrorRes | ValidationErrorRes>,
) {
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
        throw new Error("JWT_SECRET is missing");
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
            role: newUser.role as UserRole,
        },
        token: token,
    });
}

// POST /login
export async function login(
    req: Request<{}, {}, AuthReq>,
    res: Response<AuthRes | ErrorRes>,
) {
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
        throw new Error("JWT_SECRET is missing");
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
            role: user.role as UserRole,
        },
        token: token,
    });
}

// ADMIN
// GET
export async function getAdminUsers(
    _req: Request,
    res: Response<UserAdminRes[]>,
) {
    const safeUsers = await db
        .select({
            id: users.id,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt,
        })
        .from(users);

    res.json(safeUsers);
}

// PUT /:id
export async function updateAdminUser(
    req: Request<{ id: string }, {}, { role: UserRole }>,
    res: Response<UserAdminRes | ErrorRes>,
) {
    const { id } = req.params;
    const { role } = req.body;

    const [updatedUser] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, Number(id)))
        .returning({
            id: users.id,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt,
        });

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
}

// DELETE /:id
export async function deleteAdminUser(
    req: Request<{ id: string }>,
    res: Response<UserAdminRes | ErrorRes>,
) {
    const { id } = req.params;
    const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, Number(id)))
        .returning({
            id: users.id,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt,
        });

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(deletedUser);
}
