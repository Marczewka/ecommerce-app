import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { db } from "../db/index.js";
import { carts, cartItems, products, users } from "../db/schema.js";
import { eq, and, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import type {
    CartAdminRes,
    CartItemRes,
    ErrorRes,
    ProductItemRes,
} from "../../../shared/dtos.js";

const router = express.Router();

// GET /my-cart
router.get(
    "/my-cart",
    authenticateToken,
    async (req: Request, res: Response<ProductItemRes[] | ErrorRes>) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const userId = req.user.id;

        const itemsList = await db
            .select({
                id: products.id,
                title: products.title,
                slug: products.slug,
                price: products.price,
                image: products.image,
                quantity: cartItems.quantity,
            })
            .from(cartItems)
            .innerJoin(carts, eq(cartItems.cartId, carts.id))
            .innerJoin(products, eq(cartItems.productId, products.id))
            .where(eq(carts.userId, userId));

        res.json(itemsList);
    },
);

// POST /product/:id
router.post(
    "/products/:id",
    authenticateToken,
    async (
        req: Request<{ id: string }>,
        res: Response<CartItemRes | ErrorRes>,
    ) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const userId = req.user.id;
        const productId = Number(req.params.id);

        const [cart] = await db
            .select()
            .from(carts)
            .where(eq(carts.userId, userId));

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const [newItem] = await db
            .insert(cartItems)
            .values({
                cartId: cart.id,
                productId,
                quantity: 1,
            })
            .onConflictDoNothing({
                target: [cartItems.cartId, cartItems.productId],
            })
            .returning();

        res.status(201).json(newItem);
    },
);

// PUT /product/:id
router.put(
    "/products/:id",
    authenticateToken,
    async (
        req: Request<{ id: string }>,
        res: Response<CartItemRes | ErrorRes>,
    ) => {
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
    },
);

// DELETE /product/:id
router.delete(
    "/products/:id",
    authenticateToken,
    async (
        req: Request<{ id: string }>,
        res: Response<CartItemRes | ErrorRes>,
    ) => {
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
    },
);

// ADMIN
// GET /
router.get(
    "/",
    authenticateToken,
    isAdmin,
    async (res: Response<CartAdminRes[]>) => {
        const allCarts = await db
            .select({
                cartId: carts.id,
                username: users.username,
                productTitle: products.title,
                quantity: cartItems.quantity,
                price: products.price,
            })
            .from(carts)
            .innerJoin(users, eq(carts.userId, users.id))
            .innerJoin(cartItems, eq(carts.id, cartItems.cartId))
            .innerJoin(products, eq(cartItems.productId, products.id));

        res.json(allCarts);
    },
);

export default router;
