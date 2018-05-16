import jwt from 'jsonwebtoken';

export default (req, res, next) => {

    let token = req.body.token || req.query.token || req.header['x-access-token'];

    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.SECRET, (err) => {
                if (err) {return res.status(401).json({success: false, message: 'Authentication failed'});}
            });

            req.decoded = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false
            });
        }
    } else {
        return res.status(403).json({success: false, message: 'No token provided'});
    }
};
