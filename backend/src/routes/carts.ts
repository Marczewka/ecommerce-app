import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { db } from "../db/index.js";
import { carts, cartItems } from "../db/schema.js";
import { eq, and, inArray } from "drizzle-orm";

const router = express.Router();

// GET /
router.get("/", authenticateToken, isAdmin, async (req, res) => {
    const allCarts = await db.select().from(carts);
    res.json(allCarts);
});

// GET /my-cart
router.get("/my-cart", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const userId = req.user.id;

    const userCart = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
        with: {
            items: {
                with: { product: true },
            },
        },
    });

    res.json(userCart);
});

// 2. POST /product/:id
router.post("/products/:id", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const userId = req.user.id;
    const productId = Number(req.params.id);

    const [cart] = await db
        .select()
        .from(carts)
        .where(eq(carts.userId, userId))
        .limit(1);

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const [newItem] = await db
        .insert(cartItems)
        .values({
            cartId: cart.id,
            productId,
        })
        .returning();

    res.status(201).json(newItem);
});

// PATCH /product/:id
router.put("/products/:id", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const userId = req.user.id;
    const { quantity } = req.body;
    const productId = Number(req.params.id);

    if (quantity < 1)
        return res
            .status(400)
            .json({ message: "Quantity has to be greater than 0" });

    const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity })
        .where(
            and(
                eq(cartItems.productId, productId),
                inArray(
                    cartItems.cartId,
                    db
                        .select({ id: carts.id })
                        .from(carts)
                        .where(eq(carts.userId, userId)),
                ),
            ),
        )
        .returning();

    res.json(updatedItem);
});

// DELETE /product/:id
router.delete("/products/:id", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const userId = req.user.id;
    const productId = Number(req.params.id);

    await db
        .delete(cartItems)
        .where(
            and(
                eq(cartItems.productId, productId),
                inArray(
                    cartItems.cartId,
                    db
                        .select({ id: carts.id })
                        .from(carts)
                        .where(eq(carts.userId, userId)),
                ),
            ),
        );
    res.json({ message: "Item deleted from the cart" });
});

export default router;
