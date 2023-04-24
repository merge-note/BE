import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleWare";

const userRoutes = Router();

// User API routes
userRoutes.post("/signup", userController.signup);
userRoutes.post("/signin", userController.signin);
userRoutes.post("/oauth", userController.oAuth);
userRoutes.post("/email-verification", userController.verifyEmail);
userRoutes.delete("/", authMiddleware, userController.deleteUser);

export default userRoutes;
