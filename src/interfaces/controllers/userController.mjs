import path from 'path';

class UserController {
  constructor(createRequestUseCase, authUseCase, updatePassword, Updateemail,listRequests, updateRequest, refreshTokenUseCase) {
    this.createRequestUseCase = createRequestUseCase;
    this.authUseCase = authUseCase;
    this.updatePassword = updatePassword;
    this.Updateemail = Updateemail;
    this.listRequests = listRequests;
    this.updateRequest = updateRequest;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async login(req, res) {
    const { email, password } = req.body;
    // console.log("datos desde el controlador:" + { email, password });
    try {
      const { accessToken, refreshToken, userId, role} = await this.authUseCase.auth(
        email,
        password
      );
      res.status(200).json({ accessToken, refreshToken, userId, role});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const newAccessToken = this.refreshTokenUseCase.execute(refreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  }

  async newPassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const updatedUser = await this.updateUserUseCase.execute(id, password);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async newEmail(req, res){
    try {
      const { id } = req.params;
      const { email } = req.body;
      const updatedUser = await this.Updateemail.execute(id, email);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createRequest(req, res) {
    try {
      const { userId, fecha_solicitud, estado, requestid } = req.body;

      // Obtener los nombres de los archivos subidos con el número aleatorio
      const documento_solicitud = req.files["pdf"]?.[0]?.filename;
      const archivo_adicional =
        req.files["archivo_adicional"]?.[0]?.filename || null;


      // Llamar al caso de uso con los datos procesados
      const result = await this.createRequestUseCase.execute(
        userId,
        fecha_solicitud,
        estado,
        requestid,
        documento_solicitud,
        archivo_adicional
      );

      // Responder con éxito
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  }

  async getFolio(req, res){
    try {
      const folio = await this.createRequestUseCase.getNewFolio();
      res.status(200).json({
        folio,
    });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listAllRequestByUser(req, res){
    try {
        const { id } = req.params;
        const requestsUser = await this.listRequests.execute(id);
        res.status(200).json(requestsUser);
    } catch (error) {
        res.status(500).json({ message:  error.message });
    }
  }

  async updateRequestUser(req, res){
    try {
        const { id } = req.params;
        const {nuevoEstado, nuevoArchivo} = req.body;
        console.log('Datos recibidos en el controlador:', { id, nuevoEstado, nuevoArchivo });

        if (!id || !nuevoEstado || !nuevoArchivo) {
            return res.status(400).json({ message: 'Datos incompletos recibidos.' });
        }

        const result = await this.updateRequest.execute(id, nuevoEstado, nuevoArchivo);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message:  error.message });
    }
  }
}

export default UserController;



