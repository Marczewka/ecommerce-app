import { db } from "../db/index.js";
import { carts, cartItems, products } from "../db/schema.js";
import { eq, and, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import type {
    CartItemRes,
    MessageRes,
    ProductItemRes,
} from "../../../shared/dtos.js";

// GET /my-cart
export async function getMyCart(
    req: Request,
    res: Response<ProductItemRes[] | MessageRes>,
) {
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
}

// POST /cartItems/:id
export async function createCartItem(
    req: Request<{ id: string }>,
    res: Response<CartItemRes | MessageRes>,
) {
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
            quantity: 1,
        })
        .onConflictDoNothing({
            target: [cartItems.cartId, cartItems.productId],
        })
        .returning();

    res.status(201).json(newItem);
}

// PUT /cartItems/:id
export async function updateCartItem(
    req: Request<{ id: string }>,
    res: Response<CartItemRes | MessageRes>,
) {
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
}

// DELETE /cartItems/:id
export async function deleteCartItem(
    req: Request<{ id: string }>,
    res: Response<CartItemRes | MessageRes>,
) {
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
}
