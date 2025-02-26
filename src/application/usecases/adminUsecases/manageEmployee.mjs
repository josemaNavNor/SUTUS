class ManageEmployee{
    constructor(userRepository, employeeRepository, hashService, usernameGeneratorService){
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.hashService = hashService;
        this.usernameGeneratorService = usernameGeneratorService;
    }

    //Función para crear un empleado
    async createEmployee(employeeData){

        const hashedPassword = await this.hashService.hashing(employeeData.password);

        const employee = await this.employeeRepository.create({
            nombre: employeeData.nombre,
            primer_apellido: employeeData.primer_apellido,
            segundo_apellido: employeeData.segundo_apellido,
            curp: employeeData.curp,
            entidad: employeeData.entidad,
            domicilio: employeeData.domicilio,
            domicilio_empresa: employeeData.domicilio_empresa,
            correo: employeeData.correo,
            contraseña: hashedPassword,
            fecha_ingreso_empresa: employeeData.fecha_ingreso_empresa,
            fecha_ingreso_sindicato: employeeData.fecha_ingreso_sindicato,
            estado: employeeData.estado,
            dependientes: employeeData.dependientes,
            fecha_nacimiento: employeeData.fecha_nacimiento,
            puesto: employeeData.puesto,
            nivel_tabular: employeeData.nivel_tabular,
            dedicacion: employeeData.dedicacion,
        });

        const username = await this.usernameGeneratorService.generateUsername();

        const userId = await this.userRepository.createUser({
            username,
            password: hashedPassword,
            email: employeeData.correo,
            isActive: employeeData.estado,
            idempleado: employee.id
        });

        if (!userId) {
            throw new Error('Error al crear el usuario. No se generó un ID.');
        }
        
        return{
            mensaje: userId.message
        };
    }
    //Función para buscar a todos los empleados
    async findAllEmployees(token){
        const employees = await this.employeeRepository.getAllEmployees(token);

        return employees;
    }

    //Función para buscar un empleado
    async findEmployee(id){
        const employee = await this.employeeRepository.getEmployeeById(id);

        return employee;
    }

    async updateEmployee(id, datosActualizados) {
        if (datosActualizados.contraseña) {
            const newHashedPassword = await this.hashService.hashing(datosActualizados.contraseña);
            datosActualizados.contraseña = newHashedPassword;
        }
        
        const updatedEmployee = await this.employeeRepository.update(id, datosActualizados);
    
        if (!updatedEmployee) {
            throw new Error("Error al actualizar el usuario");
        }
    
        return {
            mensaje: updatedEmployee.message,
        };
    }
    

    async generateNewPass(id, password){
        const newsHashPassword = await this.hashService.hashing(password);
        const updateUser = await this.employeeRepository.updatePass(id, newsHashPassword);
        return updateUser;
    }

    async generateNewEmail(id, email){
        const updateUser = await this.employeeRepository.updateEmail(id, email);
        return updateUser;
    }

    async deleteEmployee(id){
        const deletedUser = await this.employeeRepository.delete(id)

        if (!deletedUser) {
            throw new Error("Error al eliminar el usuario");
        }

        return{
            mensaje: deletedUser.message,
        }
    }

    async addEmployeeatCommittee(userId, departamentoId, puesto){
        const adduser = await this.employeeRepository.addEmployeeCommittee(userId, departamentoId, puesto)

        if (!adduser) {
            throw new Error("Error al agregar el empleado al comite");
        }

        return{
            mensaje: adduser.message,
        }
    }
}

export default ManageEmployee;