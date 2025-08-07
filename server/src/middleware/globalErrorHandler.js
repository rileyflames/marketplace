import logger from '../utils/logger.js';
import AppError from '../utils/appError.js';

// Express global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  // set fallback value
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // In development: show full error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // in production: Only send operational errors to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak details
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

export default globalErrorHandler;

/**
 * 🔍 Why these tweaks?
 * | 🔧 Change                   | ✅ Reason                                               |
| --------------------------- | ------------------------------------------------------ |
| `instanceof AppError` check | Distinguishes expected errors (like 404) from bugs     |
| `NODE_ENV` branch           | Avoid leaking stack traces in production               |
| Better fallback message     | Avoids sending vague `undefined` if message is missing |
| `error: err` in dev         | Helps debugging nested errors (like Mongoose or JWT)   |

 */
