
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const loggerFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),

  format.errors({
    stack: true,
  }),

  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);

const logger = createLogger({
  level: "info",

  format: loggerFormat,

  transports: [
     
    new transports.Console(),

     
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      format: format.combine(
        format((info) => (info.level === "error" ? false : info))(),
        loggerFormat
      ),
    }),

     
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      level: "error",
      format: format.combine(
        format((info) => (info.level === "error" ? info : false))(),
        loggerFormat
      ),
    }),
  ],
});

export default logger;
