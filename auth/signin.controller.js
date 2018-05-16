import jwt from 'jsonwebtoken';
import logger from '../logger';
import {UserModel} from '../models/user.model';
import md5 from 'md5';

function signIn(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    UserModel.findOne({
        username: username
    }).exec().then(user => {
        if (user && md5(password + user.salt) === user.password) {
            //res.status(200).json({success: true, token: jwt.sign({username: user.username, email: user.email, random: Math.floor(Math.random()*100)}, process.env.SECRET, { expiresIn: '1h'})});
            let tokenPayload = {username: user.username, email: user.email, role: user.role, random: Math.floor(Math.random()*100)};
            let token = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '1h'});
            res.locals.tokenPayload = tokenPayload;
            res.locals.token = token;
            res.status(200).responder.setMessage(`Successful Log In. Welcome ${user.role} ${user.first_name}`).appendToken(token);
        } else {
            res.responder.status(401).setMessage('Please retry logging in').setError('Invalid authorization.');
        }
        next();
    }).catch(reason => {
        res.responder.status(500).setMessage('Internal Error');
        logger.error(reason);
        next();
    });
}

export default signIn;
