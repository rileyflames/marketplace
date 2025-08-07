import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './src/app.js';
import { connectDB, gracefulShutdown } from './src/config/db.js';
import logger from './src/utils/logger.js';

// PORT
const PORT = process.env.PORT || 5000;

// create HTTP server using Express app
const server = http.createServer(app);

// start the server
const startServer = async () => {
  try {
    // connect to MongoDB
    await connectDB();

    // start the HTTP server
    server.listen(PORT, () => {
      logger.info(
        `🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`
      );
    });

    // graceful shutdown handler
    const shutdown = async (signal) => {
      logger.info(`📦 Received ${signal}. Shutting down....`);
      await gracefulShutdown(); // close MongoDB connection
      server.close(() => {
        logger.info('🛑 HTTP server closed');
        process.exit(0);
      });
    };

    // catch OS termination signals
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('! Unhandled Promise Rejection:', err);
      shutdown('unhandledRejection');
    });

    // handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('💥 Uncaught Exception', err);
      shutdown('uncaughtException');
    });
  } catch (err) {
    logger.error('❌ Server failed to start', err);
    process.exit(1);
  }
};

// start everything
startServer();
