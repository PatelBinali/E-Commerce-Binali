const winston = require('winston');

// Create a logger with three transports (console, file, and error file)
const logger = winston.createLogger({
	level: 'info', // Only log messages at info level or above
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
		winston.format.colorize()
	),
	transports: [
		new winston.transports.Console()
	]
});

module.exports = logger;
