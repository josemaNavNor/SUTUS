class createRequest{
    constructor(userRepository){
        this.userRepository = userRepository;
    }
    
    async execute(userId, fecha_solicitud, estado, requestid, documento_solicitud, archivo_adicional){
        const solicitud = await this.userRepository.createRequest(
            userId, 
            fecha_solicitud, 
            estado, 
            requestid, 
            documento_solicitud, 
            archivo_adicional
        );
        return{mensaje: solicitud.message};
    }

    async getNewFolio(){
        const { folio } = await this.userRepository.getNextFolio();
        return folio;
    }
}

export default createRequest;