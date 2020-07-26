const { createLogger, format, transports } = require('winston');
const { timestamp } = format;

const errorStackTracerFormat = format(info => {
    if (info.meta && info.meta instanceof Error) {
        info.message = `${info.timestamp}${info.message} ${info.meta.stack}`;
    }
    return info;
});

const logger = createLogger({
    format: format.combine(
        format.splat(), // Necessary to produce the 'meta' property
        timestamp(),
        errorStackTracerFormat(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: './output/error.log', level: 'error' }),
        new transports.File({ filename: './output/combined.log' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: './output/exceptions.log' })
    ],
    exitOnError: false
});

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

logger.stream = {
    write: function (message) {
        logger.info(message);
    },
};

module.exports = logger