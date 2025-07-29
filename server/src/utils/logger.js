import winston from "winston";
import path from 'path'
import fs from 'fs'


// ensure the logs directory exists
const logDir = path.resolve('marketplace', 'logs')
if(!fs.existsSync(logDir)){
  fs.mkdirSync(logDir, { recursive: true})
}

// Define custom log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}), // Consistent timestamp format
  winston.format.errors({ stack:true }), //Include stack traces
  winston.format.printf(( { timeStamp, level, message, stack }) => {
    return stack
    ? `[${timeStamp}] ${level}: ${message}\n${stack}`
    : `[${timeStamp}] ${level}: ${message}`
  })
);

const colorizedFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
  winston.format.printf(({ timeStamp, level, message, stack}) => {
    return stack
    ? `[${timeStamp}] ${level}: ${message}\n${stack}`
    : `[${timeStamp}] ${level}: ${message}`
  })
);

// create the winston logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'marketplace-api'},

  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')

    })
  ]
})


// add console transport only in development (for clarity)
if(process.env.NODE_ENV !== 'production') {
  logger.add( new winston.transports.Console({ format: colorizedFormat}))
}else {
  logger.add( new winston.transports.Console({ format: winston.format.simple()})) // simple plain logs in production console
}
















export default logger 