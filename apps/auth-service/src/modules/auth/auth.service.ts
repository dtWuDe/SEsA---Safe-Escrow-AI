import { TokenService } from "./token.service";
import { AuthServiceInterface } from "./auth.service.interface";
import { UserService } from "../user/user.service";
import { AccessTokenPayload, RefreshTokenPayload } from "./token.types";
import { Hasher } from "../../lib/crypto/hasher";
import { OTPService } from "../otp/otp.service";
import { OTPPurpose } from "../otp/otp.types";
import { SessionService } from "../session/session.service";
import { decode } from "punycode";

export class AuthService implements AuthServiceInterface {
    constructor(
        private readonly tokenService: TokenService,
        private readonly user: UserService,
        private readonly otpService: OTPService,
        private readonly hasher: Hasher,
        private readonly sessionService: SessionService
    ) {};

    async register(email: string, password: string): Promise<{ code: string }> {
        const user = await this.user.createUser(email, password);
        if (!user) {
            throw new Error("USER_NOT_CREATED");
        }

        const purpose: OTPPurpose = 'EMAIL_VERIFICATION';
        const code = await this.otpService.createOTP(user.id, purpose);

        if (!code) {
            throw new Error("OTP_NOT_CREATED");
        }
        
        return { code };
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const user = await this.user.getByEmail(email);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        if (!user.isVerified) {
            throw new Error("USER_NOT_VERIFIED");
        }

        const isPasswordValid = await this.hasher.verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("INVALID_PASSWORD");
        }

        const payload: AccessTokenPayload = {
            sub: user.id,
            email: user.email,
            type: 'access',
        };

        // Generate access and refresh tokens
        const accessToken = this.tokenService.signAccessToken(payload);

        // Save refresh token
        const { refreshToken } = await this.sessionService.createSession(user.id);

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const stored = await this.sessionService.validateSession(refreshToken);

        if (!stored) {
            throw new Error("REFRESH_TOKEN_NOT_FOUND");
        }

        const user = await this.user.getById(stored.sub);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const newPayload: AccessTokenPayload = {
            sub: user.id,
            email: user.email,
            type: 'access',
        };

        // Generate new access and refresh tokens
        const newAccessToken = this.tokenService.signAccessToken(newPayload);

        // Update refresh token
        const { refreshToken: newRefreshToken } = await this.sessionService.refreshSession(refreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: string, refreshToken: string): Promise<void> {
        const decoded = await this.sessionService.validateSession(refreshToken);

        if (!decoded) 
            throw new Error("INVALID_REFRESH_TOKEN");

        if (decoded.sub !== userId) 
            throw new Error("INVALID_REFRESH_TOKEN");
        
        await this.sessionService.revokeSession(refreshToken);
    }

    async logoutAll(userId: string, refreshToken: string): Promise<void> {
        const decoded = await this.sessionService.validateSession(refreshToken);
        if (!decoded) 
            throw new Error("INVALID_REFRESH_TOKEN");
        
        if (decoded.sub !== userId) 
            throw new Error("INVALID_REFRESH_TOKEN");

        await this.sessionService.revokeAllSessions(userId);
    }

    async verifyEmail(userId: string, code: string): Promise<void> {
        const valid = await this.otpService.verifyOTP(
            userId, 
            'EMAIL_VERIFICATION', 
            code
        );
        
        if (!valid) throw new Error("INVALID_OTP");

        await this.user.markEmailVerified(userId);
    }
}