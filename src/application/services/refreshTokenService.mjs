import jwt from 'jsonwebtoken';

class RefreshTokenService {
    generateRefreshToken(payload) {
      const secretKey = process.env.JWT_REFRESH_SECRET_KEY;  
      const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '7d' });
      return refreshToken;
    }
  
    verifyRefreshToken(refreshToken) {
      const secretKey = process.env.JWT_REFRESH_SECRET_KEY;
      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        return decoded;
      } catch (error) {
        throw new Error('Refresh token inválido o expirado');
      }
    }
  }
  
  export default RefreshTokenService;
  