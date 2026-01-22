import { Router } from "express";
import { createUserController } from "./modules/user/user.controller";
import { createAuthRoutes } from "./modules/auth/api/auth.router";

export function createRouters(): Router {
    const router = Router();
    router.use("/v1/users", createUserController);
    router.use("/v1/auth", createAuthRoutes());
    return router;
}