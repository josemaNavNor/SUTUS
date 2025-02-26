class CreateUser{
  constructor(userRepository, hashService){
    this.userRepository = userRepository;
    this.hashService = hashService;
  }
  async execute(user){
    const hashedPassword = await this.hashService.hashing(user.password);

    const newUser = await this.userRepository.createUser({
      username: user.username,
      password: hashedPassword,
      email: user.email,
    });

    return newUser;
  }
}

export default CreateUser;



