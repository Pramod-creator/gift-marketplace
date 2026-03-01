import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", protect, authorizeRoles("admin"), createCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

export default router;