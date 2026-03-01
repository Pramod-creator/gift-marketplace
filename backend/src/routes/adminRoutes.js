import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  toggleUserStatus,
  getAllOrders,
  adminDeactivateProduct
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/toggle", protect, authorizeRoles("admin"), toggleUserStatus);
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
router.put("/products/:id/deactivate", protect, authorizeRoles("admin"), adminDeactivateProduct);

export default router;