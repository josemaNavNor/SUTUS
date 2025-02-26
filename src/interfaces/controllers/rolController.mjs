class rolController{
    constructor(manageRoles){
        this.manageRoles = manageRoles;
    }

    async create(req, res){
        try{
            const rol = await this.manageRoles.createRol(req.body)
            res.status(201).json(rol);
        }
        catch(error){
            res.status(500).json({ message: error.message});
        }
    }

    async listRoles(req, res){
        try {
            const list = await this.manageRoles.findAllRoles();
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }

    async listRol(req, res){
        try {
            const {id} = req.params;
            const deparment = await this.manageRoles.findRol(id);
            res.status(200).json(deparment);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }
}

export default rolController;