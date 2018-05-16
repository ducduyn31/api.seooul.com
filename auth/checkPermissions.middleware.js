import ROLES from '../auth/roles.enum';
import jwt from 'jsonwebtoken';

export default (role, required) => {
    return (req, res, next) => {
        let monitor = req.query.monitor;

        if (required) {
            let userRole = res.locals.tokenPayload.role;
            if (ROLES[userRole] && ROLES[userRole].getLevel() >= role) {
                res.responder.appendToken(jwt.sign(res.locals.tokenPayload, process.env.SECRET_ADMIN, {expiresIn: '1h'}));
            } else {
                res.responder.removeToken().setError('Access Restricted').status(402).setMessage('You need to be a higher leveled monitor to access this path');
            }
        } else if (monitor) {
            let userRole = res.locals.tokenPayload.role;
            if (ROLES[userRole] && ROLES[userRole].getLevel() >= role) {
                res.responder.appendToken(jwt.sign(res.locals.tokenPayload, process.env.SECRET_ADMIN, {expiresIn: '1h'}));
            } else {
                res.responder.removeToken().setError('Access Restricted').status(402).setMessage('You need to be a higher leveled monitor to access this path');
            }
        }
        next();
    }
}
