const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowedRoles.includes(req.user.details.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};

module.exports = roleAuth;