import "dotenv/config";

export class jwtConfig {
    static JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || (() => {
        throw new Error('JWT_ACCESS_SECRET is not set') 
    })();

    static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (() => {
        throw new Error('JWT_REFRESH_SECRET is not set') 
    })();

    static JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || 15;
    static JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || 7;
    static JWT_REFRESH_EXPIRY_DAYS: 7;
}