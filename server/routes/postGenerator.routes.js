import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import { generateContent } from "../controllers/postGenerator.controller.js";

const router = express.Router();

router.post("/generate-content", verifyToken, generateContent);

export default router;
