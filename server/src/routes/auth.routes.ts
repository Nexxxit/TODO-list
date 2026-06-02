import { Router } from "express";
import { loginController } from "../controllers/auth.contoller";

const router = Router()

const authRouter = router.post("/login", loginController)

export default authRouter