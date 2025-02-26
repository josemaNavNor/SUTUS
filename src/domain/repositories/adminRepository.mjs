class adminRepository{
    async listRequests(){
        throw new Error('Metodo listRequests no implementado');
    }
    async updateRequestStatus(idRequest, newState){
        throw new Error('Metodo updateRequestStatus no implementado');
    }
    async assignUserRole(userId, roleId) {
        throw new Error('Metodo assignUserRole no implementado');
    }
    async addEmployeeatCommittee(userId, departamentoId, puesto){
        throw new Error('Metodo  addEmployeeatCommittee no implementado');
    }
}
export default adminRepository;