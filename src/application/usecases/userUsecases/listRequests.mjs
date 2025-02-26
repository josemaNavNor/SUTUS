class listRequests{
    constructor(userRepository, dateFormatterService) {
        this.userRepository = userRepository;
        this.dateFormatterService = dateFormatterService;
    }

    async execute(idUser){
        const requestsUser = await this.userRepository.listRequestsByUser(idUser);

        return this.dateFormatterService.formatdate(requestsUser);
    }
}

export default listRequests;