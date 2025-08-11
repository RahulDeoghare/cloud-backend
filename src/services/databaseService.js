const db= require('../config/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/database.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

class DatabaseService {
  async getCameras() {
    return db('camera').select('*').where({ connectivityStatus: 'active' });
  }
  async getAIModels() {
    return db('aiModels').select('*');
  }
  async insertVehicleLog(logData) {
    const dbLogData = {
    cameraId: logData.cameraId,
    eventType: logData.eventType,
    time: logData.eventTime,  // Note: table has 'time' not 'eventTime'
    entryCount: logData.entryCount || 0,
    exitCount: logData.exitCount || 0,
    location: logData.location,
    screenShotPath: logData.screenshotPath,  // Note: table has 'screenShotPath'
    // Don't include created_at and updated_at - they're auto-generated
  };
    const [insertedLog] = await db('vehicleInOutModelLogs').insert(logData).returning('*');
    return insertedLog;
  }
  async getVehicleLogs(filters = {}) {
    let query = db('vehicleInOutModelLogs').select('*');
    if (filters.cameraId) query = query.where('cameraId', filters.cameraId);
    if (filters.startDate) query = query.where('createdAt', '>=', filters.startDate);
    if (filters.endDate) query = query.where('createdAt', '<=', filters.endDate);
    if (filters.limit) query = query.limit(filters.limit);
    return query.orderBy('created_at', 'desc');
  }
}

module.exports = new DatabaseService();