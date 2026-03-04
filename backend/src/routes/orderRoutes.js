import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkout, getMyOrders, buyProduct } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, getMyOrders);
router.post("/checkout", protect, checkout);
router.post("/buy", protect, buyProduct);

export default router;