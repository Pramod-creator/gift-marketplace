import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCartItem);
router.delete("/:id", protect, removeFromCart);

export default router;