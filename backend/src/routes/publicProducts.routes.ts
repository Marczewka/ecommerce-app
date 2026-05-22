import express from "express";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";
import {
    getProduct,
    getProducts,
} from "../controllers/products.controllers.js";

const router = express.Router();

// GET /categories{/:categorySlug}/?search=query
router.get("/categories{/:categorySlug}", optionalAuth, getProducts);

// GET /:productSlug
router.get("/:productSlug", optionalAuth, getProduct);

export default router;
