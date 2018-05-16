import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import md5 from 'md5';
import ROLES from '../auth/roles.enum';

const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

const theSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique'],
        validate: {
            isAsync: true,
            validator: (name, cb) => {

                //Username length
                cb(name.length >= 6 && name.length <= 20, 'Username must have between 6 and 20 characters.');

                //Characters
                cb(/[a-zA-Z0-9]+/g.test(name), 'Username must contains only alphabets and numbers');
            },
            message: 'Invalid username'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            isAsync: true,
            validator: (pw, cb) => {
                //MD5 syntax
                cb(/^[a-f0-9]{32}$/i.test(pw), 'Invalid password syntax');
            },
            message: 'Invalid password'
        }
    },
    salt: {
        type: String,
        required: [true, 'Salt is required'],
        validate: {
            isAsync: true,
            validator: (s, cb) => {

                //MD5 syntax
                cb(/^[a-f0-9]{5}$/i.test(s), 'Invalid salt syntax');
            },
            message: 'Invalid salt'
        }
    },
    role: {
        type: String,
        enum: Object.keys(ROLES),
        required: [true, 'Role is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Someone used this email'],
        validate: {
            isAsync: true,
            validator: (_email, cb) => {

                // Empty email
                cb(_email.length > 0, 'Email must not be empty');

                // Email syntax
                cb(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(_email), 'Invalid email syntax');
            },
            message: 'Invalid email'
        }
    },
    verified: {
        type: Boolean,
        required: [true, 'Verification Status needed']
    },
    created_time: {
        type: String,
        required: [true, 'Created Time is required'],
        match: [/[0-9]+/g, 'Invalid time']
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        validate: {
            isAsync: true,
            validator: (fname, cb) => {

                //Simple Name Validator (International)
                cb(nameRegex.test(fname), 'Invalid First name')
            },
            message: 'Invalid First name'
        }
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        validate: {
            isAsync: true,
            validator: (lname, cb) => {

                //Simple Name Validator (International)
                cb(nameRegex.test(lname), 'Invalid Last name')
            },
            message: 'Invalid Last name'
        }
    },
    middle_name: {
        type: String,
        validate: {
            isAsync: true,
            validator: (mname, cb) => {

                if (mname.length > 0) {
                    //Simple Name Validator (International)
                    cb(nameRegex.test(mname), 'Invalid Middle name')
                } else {
                    cb(true, null);
                }
            },
            message: 'Invalid Middle name'
        }
    },
    birthday: {
        type: String,
        match: [/[0-9]+/g, 'Invalid time']
    }
});

/**
 * Initialize default values
 */
theSchema.pre('validate', function (next) {

    // Default Time
    if (!this.created_time) {
        this.created_time = Date.now();
    }

    //Generate Salt
    this.salt = (md5(Math.random()) + '').substr(Math.floor(Math.random() * 26), 5);
    let salt = this.salt;

    //Hash password
    this.password = md5(this.password + salt);

    //Default role
    if (!this.role) {
        this.role = 'User';
    }

    //Default verification status
    if (!this.verified) {
        this.verified = false;
    }

    next();
});

/**
 * Complete Signing up user
 */
theSchema.post('save', doc => {
   // TODO: Send verification email through a SMTP server
});

const model = mongoose.model('User', theSchema);

export {model as UserModel};
