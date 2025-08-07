import express, { urlencoded } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import routeNotFound from './utils/notFound.js';
import sanitizeMongo from './middleware/sanitizeMongo.js';

// initialize app instance
const app = express();

// proxy here
app.set('trust proxy', 1);

// security
app.use(helmet());
app.use(hpp());

// Enable cross-origin resource sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// compression middleware
app.use(compression());

// built-in middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

// sanitize and prevent NoSQL injection
app.use(sanitizeMongo);

// morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.get('/', (req, res) => {
  res.send('API is up and running 🚀');
});

// 404 not found
app.use(routeNotFound);

// global error handler
app.use(globalErrorHandler);

export default app;
