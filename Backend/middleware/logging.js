const winston = require("winston");
const expressWinston = require("express-winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// To remove the clear text token from the log
const sanitizeMeta = (meta) => {
    if (meta && meta.req && meta.req.headers && meta.req.headers.authorization) {
        meta.req.headers.authorization = "[REDACTED]"; 
    }
    return meta;
};

// Setup
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Logs to console
        new winston.transports.Console(),

        // Rotating logs
        new DailyRotateFile({
            filename: "logs/api-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d", // how many daily logs are stored
            zippedArchive: true, // old logs will be compressed
        }),
    ],
});

const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}",
    expressFormat: true,
    colorize: false,
    requestFilter: (req, propName) => {
        if (propName === "headers" && req.headers.authorization) {
            req.headers.authorization = "[REDACTED]";
        }
        return req[propName];
    },
    responseFilter: (res, propName) => {
        if (propName === "body" && res.body?.token) {
            const sanitizedBody = { ...res.body, token: "[REDACTED]" };
            return sanitizedBody;
        }
        return res[propName];
    }
});

const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
});

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
};

module.exports = { requestLogger, errorLogger, logger, errorHandler };