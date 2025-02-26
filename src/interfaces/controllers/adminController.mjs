class adminController{
    constructor(manageRequests,assingUserRoleUseCase,uploadFileRegulationsUseCase){
        this.manageRequests = manageRequests;
        this.assingUserRoleUseCase = assingUserRoleUseCase;
        this.uploadFileRegulationsUseCase = uploadFileRegulationsUseCase
    }

    async listAllRequest(req, res){
        try{
            const list = await this.manageRequests.findSAllRequests();
            res.status(200).json(list);
        }
        catch(error){
            res.status(500).json({ message:  error.message });
        }
    }

    async updateStatus(req, res){
        try{
            const {idRequest} = req.params;
            const {estado} = req.body;

            console.log(idRequest);
            console.log(estado);

            const newStatus = await this.manageRequests.updateStatus(idRequest, estado);
            res.status(200).json(newStatus);
        }
        catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    async discardRequest(req, res){
        try {
            const {idRequest} = req.params;
            const requestDiscarded = await this.manageRequests.removeRequest(idRequest);
            res.status(200).json(requestDiscarded);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async assignRole(req, res){
        try{
            const {userId, roleId} = req.params;
            const result = await this.assingUserRoleUseCase.execute(userId, roleId);
            res.status(200).json(result);
        }
        catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    async uploadFileRegulation(req, res){
        try{
            const file = req.file;
            const scriptPath = 'C:\\Users\\Chapi\\Documents\\PaginaWebSutus\\Sindicato-Sutus-PaginaWeb\\src\\infrastructure\\scripts\\extractextfile.py';
            const result = await this.uploadFileRegulationsUseCase.execute(scriptPath, file.path);
            res.status(200).json({ content: result});
        }catch (error){
            res.status(400).json({message: error.message});
        }
    }
}

export default adminController;