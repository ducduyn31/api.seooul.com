import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import HTTPlogger from 'morgan';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';

import logger from './logger';
import theResponder from './middleware/response.middleware';

const app = express();
const debug = Debug('api-seooul-com:app');

// uncomment after placing your favicon in /public
app.use(HTTPlogger('dev', {
    skip: (req,res) => res.statusCode < 400,
    stream: fs.createWriteStream(path.join(__dirname, 'log/failed_access.log'), {flags: 'a'})
}));
app.use(HTTPlogger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'log/access.log'), {flags: 'a'})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: (origin, cb) => {
        if (process.env.ENVIRONMENT === 'development') {
            return cb(null, true);
        }

        if (!origin) {
            return cb(new Error('Require Origin'), false);
        }
    }
}));

mongoose.connect(process.env.MONGODB_URL + '').catch(reason => logger.error(reason));

import Response from './fancy-response/response';

app.use((req,res, next) => {
    res.responder = new Response(req,res);
    next();
});

import index from './routes/index';
import auth from './routes/auth';

app.use('/', index);
app.use('/auth', auth);



app.use(theResponder);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
    debug('Caught exception: %j', err);
    process.exit(1);
});

export default app;
