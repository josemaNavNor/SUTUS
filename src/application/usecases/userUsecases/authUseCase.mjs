class AuthUseCase {
  constructor(userRepository, hashService, jwtService, refreshTokenService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.jwtService = jwtService;
    this.refreshTokenService = refreshTokenService;
  }

  async auth(email, password) {
    const user = await this.userRepository.findByEmail(email);

    const isPasswordValid = await this.hashService.compare(
      password,
      user.contraseña
    );

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }
    if (!user.estado || (user.estado != 1)) {
      throw new Error("Tu cuenta se encuentra parcialmente desabilitada, porfavor ponte en contacto con el Sindicato");
    }

    const accessToken = this.jwtService.generateToken({
      userId: user.idusuario,
      role: user.rol,
    });

    const refreshToken = this.refreshTokenService.generateRefreshToken({
      userId: user.idusuario,
      role: user.rol,
    });

    return {
      accessToken,
      refreshToken,
      userId: user.idusuario,
      role: user.rol,
    };
  }
}

export default AuthUseCase;