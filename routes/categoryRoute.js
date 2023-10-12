import express from "express";
import { createCategory, deleteCategory, listCategories } from "../controllers/categoryController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/create", createCategory);
router.post("/delete", deleteCategory);
router.get("/list", listCategories);

export default router;