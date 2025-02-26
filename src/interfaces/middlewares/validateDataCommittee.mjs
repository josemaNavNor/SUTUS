export function validateDataCommittee(req, res, next){
    const {userId, departamentoId, puesto} = req.body;

    if(isNaN(userId) || isNaN(departamentoId) || typeof puesto !== 'string'){
        return res.status(400).json({ message: 'userId o roleId o puesto no son datos validos' });
    }

    req.body.userId = parseInt(userId, 10);
    req.body.departamentoId = parseInt(departamentoId, 10);

    next();
}