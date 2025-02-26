class UpdatePassword{
    constructor(userRepository, hashService){
        this.userRepository = userRepository;
        this.hashService = hashService;
    }

    async execute(id, password){
        const newsHashPassword = await this.hashService.hashing(password);
        const updateUser = await this.userRepository.updatePass(id, newsHashPassword);
        return updateUser;
    }
}

export default UpdatePassword;