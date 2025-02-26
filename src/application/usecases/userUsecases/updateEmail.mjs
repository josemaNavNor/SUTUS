class UpdateEmail{
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async execute(id, newEmail){
        const updateEmail = await this.userRepository.updateEmail(id, newEmail);
        return updateEmail;
    }
}

export default UpdateEmail;