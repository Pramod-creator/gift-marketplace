import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getMyProducts } from "../controllers/sellerController.js";
import { getMyOrders } from "../controllers/sellerOrderController.js";

const router = express.Router();

router.get("/products", protect, authorizeRoles("seller"), getMyProducts);
router.get("/orders", protect, authorizeRoles("seller"), getMyOrders);

export default router;