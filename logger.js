import winston from 'winston';

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: new Date().toISOString()
        }),
        new winston.transports.File({
            name: 'error-file',
            filename: './log/error.log',
            level: 'error'
        })
    ]
});

export default logger;
