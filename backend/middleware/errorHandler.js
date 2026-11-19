/**
 * Global error handling middleware.
 * Ensures internal database errors and stack traces are never leaked to clients.
 */
export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const status = err.statusCode || err.status || 500;
  const message = status === 500
    ? 'An internal server error occurred. Please try again later.'
    : err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { errorType: err.name } : {})
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
}

export default {
  errorHandler,
  notFoundHandler
};

