import { Router } from "express";
import { authController } from "./auth.controller";

import { createAppContainer } from "src/app/app.container";

export function createAuthRoutes(): Router {
    const { authService } = createAppContainer();
    const router = Router();
    console.log("🚀 Creating AuthRoutes");
    // Routes
    return authController(authService);
}
