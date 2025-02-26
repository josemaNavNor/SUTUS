class manageBenefits{
    constructor(benefitrequestsRepository){
        this.benefitrequestsRepository = benefitrequestsRepository;
    }

    async createTypeOfRequest(benefitrequestData){
        const benefitrequest = await this.benefitrequestsRepository.createbenefitRequest({
            tipo_solicitud: benefitrequestData.tipo_solicitud
        });

        if (!benefitrequest) {
            throw new Error('Error al crear el tipo de solicitud. No se generó ningun tipo de solicitud.');
        }

        return{
            mensaje: benefitrequest.message
        }
    }
    async findTypeOfRequest(id){
        const typeOfRequest = await this.benefitrequestsRepository.getbenefitRequest(id);
        
        return typeOfRequest;
    }
}

export default manageBenefits;