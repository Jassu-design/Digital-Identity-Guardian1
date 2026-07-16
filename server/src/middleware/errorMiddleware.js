export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler = (error, req, res, next) => {
  console.error(error)

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: error.message || 'Internal server error',
  })
}