import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { getSubordinatesController } from "../controllers/users.controller"

const router = Router()

router.get("/subordinates", authMiddleware, getSubordinatesController)

export default router
