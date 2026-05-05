import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { db } from "../db/index.js";
import { carts, cartItems } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

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

// 2. POST /add
router.post("/add", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const { productId } = req.body;
    const userId = req.user.id;

    let [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

    if (!cart) {
        [cart] = await db
            .insert(carts)
            .values({ userId })
            .onConflictDoUpdate({
                target: carts.userId,
                set: { userId },
            })
            .returning();
    }

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
            and(
                eq(cartItems.cartId, cart.id),
                eq(cartItems.productId, productId),
            ),
        );

    if (existingItem) {
        const [updated] = await db
            .update(cartItems)
            .set({ quantity: existingItem.quantity + 1 })
            .where(eq(cartItems.id, existingItem.id))
            .returning();
        return res.json(updated);
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

// PATCH /item/:id
router.patch("/item/:id", authenticateToken, async (req, res) => {
    const { quantity } = req.body;
    const itemId = Number(req.params.id);

    if (quantity < 1)
        return res
            .status(400)
            .json({ message: "Quantity has to be greater than 0" });

    const updatedItem = await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, itemId))
        .returning();

    res.json(updatedItem[0]);
});

// DELETE /item/:id
router.delete("/item/:id", authenticateToken, async (req, res) => {
    const itemId = Number(req.params.id);

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    res.json({ message: "Item deleted from the cart" });
});

export default router;
