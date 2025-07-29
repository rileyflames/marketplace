import winston from "winston";
import path from "path";
import fs from "fs";

// ========================================================
// Ensure log directory exists
// ========================================================
const logDir = path.resolve("marketplace", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ========================================================
// Define log formats
// ========================================================

// Log format used in files (JSON-readable, structured)
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // consistent readable timestamps
  winston.format.errors({ stack: true }), // include stack trace on errors
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// Colorized format for console logs (development only)
const colorizedFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// ========================================================
// Create the Winston logger
// ========================================================
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug", // default level
  format: logFormat, // base format for file transports
  defaultMeta: { service: "marketplace-api" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error", // only log errors here
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"), // log everything (debug, info, error)
    }),
  ],
});

// ========================================================
// Add console transport for development
// ========================================================
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: colorizedFormat, // use colors + readable format in dev
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(), // plain text logs for prod console (optional)
    })
  );
}

export default logger;
