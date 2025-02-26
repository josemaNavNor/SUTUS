class manageDeparment{
    constructor(deparmentRepository){
        this.deparmentRepository = deparmentRepository
    }

    async createDepartment(departmentData){
        const department = await this.deparmentRepository.create({
            nombre_departamento: departmentData.departamento
        });

        
        if (!department) {
            throw new Error('Error al crear el departamento. No se generó un departamento.');
        }

        return{
            mensaje: department.message
        }
    }

    async findAllDeparments(){
        const deparments = await this.deparmentRepository.getDeparments();
        
        return deparments;
    }

    async findDeparment(id){
        const deparment = await this.deparmentRepository.getDeparment(id);
        
        return deparment;
    }
}

export default manageDeparment;