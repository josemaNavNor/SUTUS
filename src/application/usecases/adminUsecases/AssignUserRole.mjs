class AssingUserRole{
    constructor(adminRepository){
        this.adminRepository = adminRepository;
    }

    async execute(userId, roleId){

        const addRol = await this.adminRepository.assignUserRole(userId, roleId);

        return{mensaje: addRol.message};
    }
}

export default AssingUserRole;