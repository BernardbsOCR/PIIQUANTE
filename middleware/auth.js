const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const headers = req.rawHeaders;
        let token = "";

        for(const header of headers) {
            if(header.indexOf('Bearer') > -1) {
                token = header.split(' ')[1];
            }
        }
        
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };

        next();
    }
    catch (error) {
        res.status(401).json({ error });
    }
}