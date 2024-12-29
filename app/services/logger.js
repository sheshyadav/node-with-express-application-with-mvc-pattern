// logger.js
import  { createLogger, format, transports } from "winston";
import { resolve } from 'path';
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: resolve('storage/logs/express.log') }) // Log to a file
  ]
});

export default logger;
