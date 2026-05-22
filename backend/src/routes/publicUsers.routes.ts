import express from "express";
import { login, register } from "../controllers/users.controllers.js";

const router = express.Router();

// POST /register
router.post("/register", register);

// POST /login
router.post("/login", login);

export default router;
