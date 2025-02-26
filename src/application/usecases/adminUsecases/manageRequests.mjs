class ManageRequests{
    constructor(adminRepository, dateFormatterService){
        this.adminRepository = adminRepository;
        this.dateFormatterService = dateFormatterService;
    }

    async findSAllRequests(){
        const requests = await this.adminRepository.listRequests();

        return this.dateFormatterService.formatdate(requests);
    }

    async updateStatus(idRequest, newState){
        const status = await this.adminRepository.updateRequestStatus(idRequest, newState);
        return status;
    }

    async removeRequest(idRequest){
        const requestDeleted = await this.adminRepository.eliminatedRequest(idRequest)
        return requestDeleted;
    }
}

export default ManageRequests;