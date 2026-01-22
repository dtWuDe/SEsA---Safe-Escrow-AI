import { OTPPurpose } from "./otp.types";
import { OTPRepository } from "./otp.repository.prisma";
import { OTPServiceInterface } from "./opt.service.interface";
import { OTP } from "./otp.types";
export class OTPService implements OTPServiceInterface {
    constructor(
        private readonly otpRepo: OTPRepository,
    ) {}

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async createOTP(userId: string, purpose: OTPPurpose): Promise<string> {
        const code = this.generateOtp();

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await this.otpRepo.save(userId, purpose, code, new Date(), expiresAt);   

        return code;
    }

    async verifyOTP(userId: string, purpose: OTPPurpose, code: string): Promise<boolean> {
        const otp = await this.otpRepo.findValid(userId, purpose, code);

        if (!otp) return false;
        
        const MAX_ATTEMPTS = 5;

        if (otp.attemptCount >= MAX_ATTEMPTS) return false;

        await this.otpRepo.markUsed(otp.id);

        return true;
    }
}