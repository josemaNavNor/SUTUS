class benefitrequestsControllerr{
    constructor(manageBenefits){
        this.manageBenefits = manageBenefits;
    }

    async create(req, res){
        try{
            const benefitrequests = await this.benefitrequestsUseCase.createTypeOfRequest(req.body);
            res.status(201).json(benefitrequests);
        }
        catch(error){
            res.status(500).json({ message: error.message});
        }
    }

    async getTypeOfRequest(req, res){
        try {
            const {id} = req.params;
            const benefit = await this.manageBenefits.findTypeOfRequest(id);
            res.status(200).json(benefit);
        } catch (error) {
            res.status(500).json({ message:  error.message });
        }
    }
}

export default benefitrequestsControllerr;