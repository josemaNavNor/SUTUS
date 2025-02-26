class UserRepository {
    async createUser(user) {
        throw new Error('Metodo no implementado');
    }
    async updateUserRole(userId, roleId) {
        throw new Error('Metodo no implementado');
    }
    async createRequest(userId, fecha_solicitud, estado, requestid, documento_solicitud, archivo_adicional){
        throw new Error('Metodo no implementado');
    }
}
export default UserRepository;