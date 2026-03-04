import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkout, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, getMyOrders);
router.post("/checkout", protect, checkout);

export default router;