import { AuthService } from "../auth.service";
import { Router, type Router as ExpressRouter } from "express";
import { LoginDto, RegisterDto } from "../auth.dto";
import { asyncHandler } from "src/lib/asyncHandler";
// import { authMiddleware } from '../../middleware/auth.middleware';

export function authController(authService: AuthService): ExpressRouter {
    const router = Router();

    router.post('/register', asyncHandler(async(req, res) => {
        const { email, password } = RegisterDto.parse(req.body);
        const { code } = await authService.register(email, password);
        res.json({ code });
    }))

    router.post('/login', asyncHandler(async(req, res) => {
        const { email, password } = LoginDto.parse(req.body);
        const { accessToken, refreshToken } = await authService.login(email, password);
        res.json({ accessToken, refreshToken });
    }))

    router.post('/refresh', asyncHandler(async(req, res) => {
        const { refreshToken } = req.body;
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
        res.json({ accessToken, refreshToken: newRefreshToken });
    }))

    router.post('/logout', asyncHandler(async(req, res) => {
        const { userId, refreshToken } = req.body;
        await authService.logout(userId, refreshToken);
        res.json({ success: true });
    }))

    router.post('/logout-all', asyncHandler(async(req: any, res) => {
        const { userId, refreshToken } = req.body;
        await authService.logoutAll(userId, refreshToken);
        res.json({ success: true });
    }))

    router.post('/verify-email', asyncHandler(async(req, res) => {
        const { userId, code } = req.body;
        await authService.verifyEmail(userId, code);
        res.json({ success: true });
    }))

    return router;
}