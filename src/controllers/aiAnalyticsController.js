const databaseService = require('../services/databaseService');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/api.log' }),
    new winston.transports.Console()
  ]
});

class AIAnalyticsController {
  async getCamerasForAnalytics(req, res) {
    try {
      const cameras = await databaseService.getCameras();
      const aiModels = await databaseService.getAIModels();
      const formattedCameras = cameras.map(camera => ({
        cameraId: camera.id,
        rtspUrl: camera.rtspUrl,
        location: camera.location,
        aiModels: aiModels.filter(model => model.modelName === 'vehicleInOut')
      }));
      res.json(formattedCameras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async sendAnalyticsJson(req, res) {
    try {
      const analyticsData = req.body;
      if (!analyticsData.modelName || !analyticsData.logData || !analyticsData.logData.cameraId) {
        return res.status(400).json({ error: 'Invalid analytics data format' });
      }
      const logData = {
        cameraId: analyticsData.logData.cameraId,
        eventType: analyticsData.logData.eventType,
        eventTime: new Date(analyticsData.logData.time),
        entryCount: analyticsData.logData.entryCount || 0,
        exitCount: analyticsData.logData.exitCount || 0,
        location: analyticsData.logData.location,
        screenshotPath: analyticsData.logData.screenShotPath,
        modelName: analyticsData.modelName,
        createdAt: new Date()
      };
      const insertedLog = await databaseService.insertVehicleLog(logData);
      res.json({ status: 'success', logId: insertedLog.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async reportError(req, res) {
    logger.error('Python script reported error:', req.body);
    res.json({ status: 'received' });
  }

  async getVehicleLogs(req, res) {
  try {
    const filters = {
      cameraId: req.query.cameraId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };
    
    const logs = await databaseService.getVehicleLogs(filters);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}

module.exports = new AIAnalyticsController();