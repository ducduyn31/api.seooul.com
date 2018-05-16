import {UserModel} from '../models/user.model';

function register(req, res, next) {
    let user = new UserModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }).save();

    user.then( user => {
        res.status(200).json('OK');
    }).catch( err => {
        res.status(400).json({
            error: err
        })
    });

}

export default register;
