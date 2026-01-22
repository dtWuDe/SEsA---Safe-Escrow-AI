// Simple smoke test to verify Jest + TypeScript setup
import { AuthService } from "../../../modules/auth/auth.service";

describe("Auth Service Test", () => {
    it("should register user successfully", async () => {
        const mockUser = { id: "user-1", email: "test@example.com" };
        const mockCode = "123456";

        const mockUserService = {
            createUser: jest.fn().mockResolvedValue(mockUser),
            getByEmail: jest.fn(),
            getById: jest.fn(),
        };

        const mockTokenService = {
            signAccessToken: jest.fn(),
            signRefreshToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
        };

        const mockRefreshTokenRepo = {
            save: jest.fn(),
            find: jest.fn(),
            revoke: jest.fn(),
            revokeAll: jest.fn(),
        };

        const mockOtpService = {
            createOTP: jest.fn().mockResolvedValue(mockCode),
        };

        const mockHasher = {
            hash: jest.fn().mockResolvedValue("hashed123"),
            compare: jest.fn().mockResolvedValue(true),
        };

        const authService = new AuthService(
            mockTokenService as any,
            mockRefreshTokenRepo as any,
            mockUserService as any,
            mockOtpService as any,
            mockHasher as any,
        );

        const result = await authService.register("test@example.com", "password123");

        expect(result.code).toBe(mockCode);
        expect(mockUserService.createUser).toHaveBeenCalledWith("test@example.com", "password123");
        expect(mockOtpService.createOTP).toHaveBeenCalledWith("user-1", "EMAIL_VERIFICATION");
    });

    it("should throw error when user creation fails during register", async () => {
        const mockUserService = {
            createUser: jest.fn().mockResolvedValue(null),
        };

        const authService = new AuthService(
            {} as any,
            {} as any,
            mockUserService as any,
            {} as any,
            {} as any
        );

        await expect(authService.register("test@example.com", "password123")).rejects.toThrow("USER_NOT_CREATED");
    });

    it("should logout user successfully", async () => {
        const mockRefreshTokenRepo = {
            revoke: jest.fn().mockResolvedValue(undefined),
        };

        const authService = new AuthService(
            {} as any,
            mockRefreshTokenRepo as any,
            {} as any,
            {} as any,
            {} as any
        );

        await authService.logout("refresh-token-123");

        expect(mockRefreshTokenRepo.revoke).toHaveBeenCalledWith("refresh-token-123");
    });

    it("should logout all sessions successfully", async () => {
        const mockRefreshTokenRepo = {
            revokeAll: jest.fn().mockResolvedValue(undefined),
        };

        const authService = new AuthService(
            {} as any,
            mockRefreshTokenRepo as any,
            {} as any,
            {} as any,
            {} as any
        );

        await authService.logoutAll("user-1");

        expect(mockRefreshTokenRepo.revokeAll).toHaveBeenCalledWith("user-1");
    });
});
