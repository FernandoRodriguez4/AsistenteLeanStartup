const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Errores de validación de Mongoose/Sequelize
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }

  // Errores de token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado'
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;