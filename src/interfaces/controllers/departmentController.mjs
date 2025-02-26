class departmentController{
    constructor(manageDeparment){
        this.manageDeparment = manageDeparment;
    }

    async create(req, res){
        try{
            const department = await this.manageDeparment.createDepartment(req.body);
            res.status(201).json(department);
        }
        catch(error){
            res.status(500).json({ message: error.message});
        }
    }

    async listAllDeparments(req, res){
        try {
            const deparments = await this.manageDeparment.findAllDeparments();
            res.status(200).json(deparments);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async listDeparment(req, res){
        try {
            const {id} = req.params;
            const deparment = await this.manageDeparment.findDeparment(id);
            res.status(200).json(deparment);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }
}

export default departmentController;