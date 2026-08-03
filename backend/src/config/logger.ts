import { createLogger,format,transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = createLogger({
    level:'info',
    format: format.combine(
        format.timestamp({
            format:'YYYY-MM-DD HH:mm:ss'
        }),

        format.errors({
            stack:true
        }),

        format.printf(({timestamp, level, message, stack }) =>{
            return stack?`${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`: `${timestamp} [${level.toUpperCase()}] ${message}`
        })
    ),

    transports:[
        new transports.Console(),

        new DailyRotateFile({
            filename:'logs/app-%DATE%.log',
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
        })

    ]
})
export default logger