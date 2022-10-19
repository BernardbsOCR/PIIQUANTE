const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.authorization.split(' ')[1];
        const userId = jwt.verify(token, 'RANDOM_SECRET_KEY');
        req.auth = {
            userId: userId
        }

        next();
    }
    catch (error) {
        res.status(401).json({ error });
    }
}