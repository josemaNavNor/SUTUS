export function validateRoleAssignment(req, res, next){
    const { userId, roleId } = req.body;

    if (isNaN(userId) || isNaN(roleId)) {
        return res.status(400).json({ message: 'userId o roleId no son números válidos' });
    }

    req.body.userId = parseInt(userId, 10);
    req.body.roleId = parseInt(roleId, 10);

    next();
}