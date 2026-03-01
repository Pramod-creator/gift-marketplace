import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkout } from "../controllers/orderController.js";

const router = express.Router();

router.post("/checkout", protect, checkout);

export default router;