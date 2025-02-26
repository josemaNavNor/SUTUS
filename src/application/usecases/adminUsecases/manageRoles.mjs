class ManageRoles{
    constructor(rolRepository){
        this.rolRepository = rolRepository;
    }

    async createRol(){
        const rol = await this.rolRepository.create({
            rol: rolData.rol
        });

        if (!rol) {
            throw new Error('Error al crear el departamento. No se generó un rol');
        }

        return{
            mensaje: rol.message
        };
    }

    async findAllRoles(){
        const roles = await this.rolRepository.listAllroles();

        return roles;
    }

    async findRol(id){
        const rol = await this.deparmentRepository.getRoleById(id);
        
        return rol;
    }
}

export default ManageRoles;