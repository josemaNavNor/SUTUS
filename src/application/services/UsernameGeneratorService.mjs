class UsernameGeneratorService{
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async generateUsername(){
    
        const lastUserId = await this.userRepository.getLastUserId();

        const nextId = lastUserId ? lastUserId + 1 : 1;

        return `usuario${nextId}`;

    }
}

export default UsernameGeneratorService;

