require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const winston = require('winston');
const aiAnalyticsRoutes = require('./routes/aiAnalyticsRoutes');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8001;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE || 'logs/app.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

app.use('/api/v1/aiAnalytics', aiAnalyticsRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl, method: req.method });
});

app.use((error, req, res, next) => {
  logger.error('Unhandled error:', { error: error.message, stack: error.stack, url: req.url, method: req.method });
  res.status(500).json({ error: 'Internal server error', message: error.message, timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Database connection failed. Exiting...');
      process.exit(1);
    }
    const server = app.listen(PORT, () => {
      logger.info(`🚀 AI Analytics Backend server running on port ${PORT}`);
    });
    process.on('SIGTERM', () => server.close(() => process.exit(0)));
    process.on('SIGINT', () => server.close(() => process.exit(0)));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;