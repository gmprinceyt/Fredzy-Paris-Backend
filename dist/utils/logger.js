import winston from "winston";
export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp} ${level}: ${message}]`;
    })),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "producation") {
    const fileTransport = logger.transports.find((t) => t instanceof winston.transports.File);
    if (fileTransport) {
        logger.remove(fileTransport);
    }
}
//# sourceMappingURL=logger.js.map