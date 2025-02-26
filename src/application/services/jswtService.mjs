import jwt from 'jsonwebtoken';

class JwtService {
  generateToken(payload) {
    const secretKey = process.env.JWT_SECRET_KEY; 
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
    return token;
  }

  verifyToken(token) {
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

export default JwtService;
