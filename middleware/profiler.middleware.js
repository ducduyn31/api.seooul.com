import EventEmitter from 'events';

const profiles = new EventEmitter();

profiles.on('route', ({req, elapsedMS}) => {
    req.resp.debugDetails.latency(elapsedMS);
});

export default (req, res, next) => {
    let start = Date.now();

    res.once('finish', () => {
        profiles.emit('route', {req, elapsedMS: Date.now() - start});
    });
    next();
}
