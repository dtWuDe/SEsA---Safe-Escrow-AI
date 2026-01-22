export interface TokenPayload {
    sub: string;
    type: 'access' | 'refresh';
}

export interface AccessTokenPayload extends TokenPayload {
    email: string;
}

export interface RefreshTokenPayload extends TokenPayload {}