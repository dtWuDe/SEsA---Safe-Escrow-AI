import { UserRepository } from "../modules/user/user.repository.prisma";
import { OTPRepository } from "../modules/otp/otp.repository.prisma";
import { RefreshTokenRepository } from "../modules/session/refresh-token.repository.prisma";

import { prisma } from "../lib/prisma";
import { jwtConfig } from '../config/jwt';

import { AuthService } from "../modules/auth/auth.service";
import { TokenService } from "../modules/auth/token.service";
import { UserService } from "../modules/user/user.service";
import { OTPService } from "../modules/otp/otp.service";
import { SessionService } from "../modules/session/session.service";

import { Hasher } from "../lib/crypto/hasher";

export function createAppContainer() {
    // Infrastructure
    const user = new UserRepository(prisma);
    const otpRepo = new OTPRepository(prisma);
    const refreshTokenRepo = new RefreshTokenRepository(prisma);
    
    // Dependencies
    const hasher = new Hasher();

    // Services
    const tokenService = new TokenService(
        jwtConfig.JWT_ACCESS_SECRET,
        jwtConfig.JWT_REFRESH_SECRET
    );

    const userService = new UserService(user, hasher);
    const otpService = new OTPService(otpRepo);
    const sessionService = new SessionService(refreshTokenRepo, tokenService);
    
    const authService = new AuthService(
        tokenService,
        userService,
        otpService,
        hasher,
        sessionService
    );

    return { authService };
}