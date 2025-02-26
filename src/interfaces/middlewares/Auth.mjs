import JwtService from "../../application/services/jswtService.mjs";

const jwtService = new JwtService();

const isTokenCorrect = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtener el encabezado Authorization
    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó el token" });
    }

    const token = authHeader.split(' ')[1]; // Extraemos el token después de "Bearer "
    if (!token) {
        return res.status(401).json({ message: "Token no encontrado" });
    }

    try {
        const decoded = jwtService.verifyToken(token);  // Verificar el token
        req.user = decoded;  // Almacenar el usuario decodificado en la solicitud
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
};

export { isTokenCorrect, verifyRole };
