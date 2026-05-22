import express from "express";
import { getCategories } from "../controllers/categories.controllers.js";

const router = express.Router();

// GET
router.get("/", getCategories);

export default router;
