
class EmployeeController{
    constructor(manageEmployee){
        this.manageEmployee = manageEmployee;
    }
    async create(req, res){
        try{
            const result = await this.manageEmployee.createEmployee(req.body)
            res.status(201).json(result);
        }
        catch(error){
            res.status(500).json({ message: error.message });
        }
    }
    async addcommittee(req, res){
        try{
            const {userId, departamentoId, puesto} = req.body;
            const result = await this.manageEmployee.addEmployeeatCommittee(userId, departamentoId, puesto);
            res.status(200).json(result);
        }catch(error){
            res.status(400).json({ message: error.message });
        }
    }
    async listAllEmployeess(req, res){
        try {
            const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const list = await this.manageEmployee.findAllEmployees(token);
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async listEmployee(req, res){
        try {
            const { id } = req.params;
            const employee = await this.manageEmployee.findEmployee(id);
            res.status(200).json(employee);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async update(req, res){
        try {
            const { id } = req.params;
            const dataEmployee = req.body;
            const result = await this.manageEmployee.updateEmployee(id, dataEmployee);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async delete(req, res){
        try {
            const { id } = req.params;
            const result = await this.manageEmployee.deleteEmployee(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async generateNewPassword(req, res) {
        try {
          const { id } = req.params;
          const { password } = req.body;
          const updatedUser = await this.manageEmployee.generateNewPass(id, password);
          res.status(200).json(updatedUser);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
    }

    async generateNewEmail(req, res) {
        try {
          const { id } = req.params;
          const { correo } = req.body;
          const updatedUser = await this.manageEmployee.generateNewEmail(id, correo);
          res.status(200).json(updatedUser);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
    }
}

export default EmployeeController;