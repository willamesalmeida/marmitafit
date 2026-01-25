const errorHandlerMiddleware = (err, req, res, next) => {
  // Preserve AppError statusCode or use 500 as default
  const statusCode = err.statusCode || 500;
  
  // Log for debug (development only)
  if (process.env.NODE_ENV !== 'production') {
    console.error("❌ [ErrorHandler] Error caught:", {
      message: err.message,
      statusCode: statusCode,
      name: err.name,
      route: req.path,
    });
  }
  
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== 'production' && { 
      details: err.stack 
    })
  });
}

module.exports = errorHandlerMiddleware;
