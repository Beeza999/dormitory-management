function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value' });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
}

module.exports = errorMiddleware;
