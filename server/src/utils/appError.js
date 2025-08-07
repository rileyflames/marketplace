// App Error

export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the built-in Error constructor with the message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark this error as operational (known and expected)

    // Capture the stack trace but omit the constructor itself from it
    Error.captureStackTrace(this, this.constructor);
  }
}
