// ===== server.js - Versión mejorada =====
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { sequelize } = require('./models');

// Cargar variables de entorno ANTES de todo
dotenv.config();

const app = express();

// ===== SEGURIDAD =====
// Helmet para headers de seguridad
app.use(helmet());

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login/registro
  message: 'Demasiados intentos de autenticación, por favor intente más tarde',
  skipSuccessfulRequests: true
});

// Rate limiting para generación con IA
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 generaciones con IA por hora
  message: 'Ha alcanzado el límite de generaciones con IA por hora'
});

// ===== MIDDLEWARE BÁSICO =====
// CORS configurado correctamente
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Comprimir respuestas
app.use(compression());

// Parsear JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitizar datos para prevenir NoSQL injection
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // En producción, log más detallado
  app.use(morgan('combined'));
}

// Trust proxy (importante para deployment)
app.set('trust proxy', 1);

// ===== HEALTH CHECKS =====
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await sequelize.authenticate();
    
    res.json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// ===== RUTAS CON RATE LIMITING =====
// Aplicar rate limiting global
app.use('/api/', limiter);

// Rutas de autenticación con límite específico
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', require('./routes/authRoutes'));

// Rutas protegidas
app.use('/api/hypotheses', require('./routes/hypothesisRoutes'));

// Rutas de artefactos con límite para IA
app.use('/api/artifacts/:hypothesisId/generate-ai', aiLimiter);
app.use('/api/artifacts/:id/improve', aiLimiter);
app.use('/api/artifacts', require('./routes/artifactRoutes'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Lean Startup Assistant API',
    version: process.env.npm_package_version || '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// ===== MANEJO DE ERRORES =====
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404,
    timestamp: new Date().toISOString()
  });
});

// Error handler centralizado
app.use((err, req, res, next) => {
  // Log del error
  console.error(`Error ${err.status || 500}: ${err.message}`);
  console.error(err.stack);

  // No exponer detalles en producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Algo salió mal',
    ...(isDevelopment && { stack: err.stack }),
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

// ===== CONFIGURACIÓN DEL SERVIDOR =====
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    // Sincronizar modelos
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Base de datos sincronizada (modo desarrollo)');
    } else {
      // En producción, no hacer alter automático
      await sequelize.sync();
      console.log('✅ Base de datos verificada');
    }

    // Iniciar servidor
    const server = app.listen(PORT, HOST, () => {
      console.log(`
🚀 Servidor iniciado exitosamente
📍 URL: http://${HOST}:${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
📅 Fecha: ${new Date().toISOString()}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️  SIGTERM recibido, cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado');
        sequelize.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('⚠️  SIGINT recibido, cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado');
        sequelize.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // En producción, cerrar el servidor de forma segura
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Iniciar servidor
startServer();
