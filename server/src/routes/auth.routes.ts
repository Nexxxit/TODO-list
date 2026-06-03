import { Router } from "express";
import { loginController } from "../controllers/auth.contoller";

const router = Router()

router.post("/login", loginController)

export default router