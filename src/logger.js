import winston, { format } from 'winston';
import { __dirname } from './path.js';
import path from 'path';

console.log('Configurando el logger');

const logFormat = format.printf(({ level, message, timestamp }) => {
  console.log('Nuevo log:', { level, message, timestamp });
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const developmentLogger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, 'errors.log'), level: 'error', handleExceptions: true, humanReadableUnhandledException: true, })
  ],
});

const productionLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'errors.log'), level: 'error',handleExceptions: true,humanReadableUnhandledException: true, }),
  ],
});

const isProduction = process.env.NODE_ENV === 'production';
const logger = isProduction ? productionLogger : developmentLogger;

export default logger