import EventEmitter from 'events';

const profiles = new EventEmitter();

// TODO: Latency Milliseconds added to debug details
export default (fn) => {
    return (req, res, next) => {
        const start = Date.now();

        fn(req, res, () => {
            profiles.emit('middleware', {
               req,
               name: fn.name,
               elapsedMS: Date.now() - start
            });

            next.apply();
        });
    }
}
