// const winston=require('winston')

// const logger=winston.createLogger({
//     level:'info',
//     transports:[
//         new  winston.transport.console(),
//         new winston.transport.File({fileName:""})
//     ]
// })
// logger.info('Information message')
// logger.info('error message')
const fs = require('fs');
const path = require('path');

// Paths for log files
const successLogPath = path.join(__dirname, 'success.log');
const errorLogPath = path.join(__dirname, 'error.log');

const logger = (req, res, next) => {
const start = Date.now();

res.on('finish', () => {
const duration = Date.now() - start;
const logMessage = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms\n`;

if (res.statusCode < 400) {
fs.appendFile(successLogPath, logMessage, (err) => {
if (err) console.error('Error writing success log:', err)
});
} else {
fs.appendFile(errorLogPath, logMessage, (err) => {
if (err) console.error('Error writing error log:', err);
});
}
});

next();
};

module.exports = logger;
