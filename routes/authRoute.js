import express from "express";
import { refreshToken, signIn, signUp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/refresh-token", refreshToken);

export default router