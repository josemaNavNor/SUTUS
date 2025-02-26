class RefreshTokenUseCase {
    constructor(refreshTokenService){
        this.refreshTokenService = refreshTokenService;
    }

    async execute(refreshToken){
        if (!refreshToken) {
            throw new Error("No se proporcionó el refresh token");
        }
        try {
            const decoded = this.refreshTokenService.verifyRefreshToken(refreshToken);
            const newAccessToken = this.refreshTokenService.generateRefreshToken({
                userId: decoded.userId,
                role: decoded.role,
            });
            return newAccessToken;
        } catch (error) {
            throw new Error("Refresh token inválido o expirado");
        }
    }
}

export default RefreshTokenUseCase;