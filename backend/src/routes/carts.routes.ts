import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
    createCartItem,
    deleteCartItem,
    getMyCart,
    updateCartItem,
} from "../controllers/carts.controllers.js";

const router = express.Router();

// GET /my-cart
router.get("/my-cart", authenticateToken, getMyCart);

// POST /cartItems/:id
router.post("/products/:id", authenticateToken, createCartItem);

// PUT /cartItems/:id
router.put("/products/:id", authenticateToken, updateCartItem);

// DELETE /cartItems/:id
router.delete("/products/:id", authenticateToken, deleteCartItem);

export default router;
