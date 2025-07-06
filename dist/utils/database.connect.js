import mongoose from "mongoose";
import { logger } from "./logger.js";
export const connect = async () => {
    try {
        // After Connect Database Message log
        mongoose.connection.on('connected', () => {
            logger.info(`Database Connected ✅`);
        });
        // Error Handle After Connection established
        mongoose.connection.on('error', (err) => {
            logger.error(`Database Connection Error ${err} ❌`);
        });
        // disconnected Message
        mongoose.connection.on('disconnected', () => {
            logger.warn(`⚠ Database disconnected`);
        });
        // reconnecting database 
        mongoose.connection.on('reconnected', () => {
            logger.info(`🔃 Database reconnected`);
        });
        await mongoose.connect(`${process.env.DATABASE_URL}/fredzy-paris`);
    }
    catch (error) {
        logger.error('Database Connection Failed 🚫', error);
        process.exit(1);
    }
    ;
    // CTR + C if Database connnetion exit;
    async function gracefulExit() {
        await mongoose.connection.close();
        logger.info(' MongoDB disconnected on app');
        process.exit(0);
    }
    process.on('SIGINT', gracefulExit);
};
