const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = {
    authenticate: (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userData = decoded;
            next();
        } catch (error) {
            console.error('Error authenticating user:', error);
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
};

module.exports = authMiddleware;
