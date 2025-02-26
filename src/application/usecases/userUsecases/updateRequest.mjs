class updateRequest{
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(idRequest, nuevoEstado, nuevoArchivo){
        const updateRequestsUser = await this.userRepository.updateRequestUser(idRequest, nuevoEstado, nuevoArchivo);

        return updateRequestsUser;
    }
}

export default updateRequest;