import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Connect to MongoDB with exponential backoff and retry
export const connectDB = async () => {
  const maxRetries = 5; // maximum number of retries
  let attempt = 0;
  let delay = 1000; // initial delay in ms

  // Check if MONGO_URI is provided
  if (!process.env.MONGO_URI) {
    logger.error(`❌ MONGO_URI is not defined in environment variable`);
    process.exit(1);
  }

  // Connect DB
  while (attempt < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info(`🟢 Connected to MongoDB`);
      return;
    } catch (error) {
      attempt++; // increase attempts after each connection attempt
      logger.error(
        `❌ MongoDB connection error ( attempt ${attempt}): `,
        error
      );

      if (attempt < maxRetries) {
        logger.info(
          `Retrying MongoDB connection in ${delay / 1000} seconds...`
        );
        await new Promise((res) => setTimeout(res, delay)); // set each attempt of reconnection to wait 1s
        delay *= 2; // Exponential backoff || multiply each delay by 2 to increase the amount taken before attempting to connect again
      } else {
        logger.error(
          `❌ Failed to connect to MongoDB after ${maxRetries} attempts. Exiting.`
        ); // log the amount of times server tries to reconnect to database
        process.exit(1);
      }
    }
  }
};

// Graceful shutdown
let isShuttingDown = false;

export const gracefulShutdown = async () => {
  // Prevent multiple shutdowns in case multiple signals are received
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    // log message
    logger.info('Received kill signal, shutting down gracefully');
    // close mongoose connection (return a Promise)
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
};
