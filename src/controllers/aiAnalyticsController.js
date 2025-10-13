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
        cameraId: camera.cameraId,
        rtspUrl: camera.rtspUrl,
        location: camera.location,
        aiModels: [{modelId: "1"}]
      }));
      res.json(formattedCameras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async sendAnalyticsJson(req, res) {
  try {
    console.log('Received analytics data:', req.body); // Debug log
    
    const analyticsData = req.body;
    if (!analyticsData.modelName || !analyticsData.logData || !analyticsData.logData.camera_id) {
      return res.status(400).json({ error: 'Invalid analytics data format' });
    }

    const logData = {
      logId: analyticsData.logData.id, // UUID for id (Python sends "id")
      camera_id: analyticsData.logData.camera_id, // Must be UUID
      eventType: analyticsData.logData.eventType,
      time: analyticsData.logData.time, // timestamp with time zone
      location: analyticsData.logData.location,
      screenShotPath: analyticsData.logData.screenShotPath || analyticsData.logData.screenshotPath,
      office_id: analyticsData.logData.office_id, // Must be UUID, not null
      device_id: analyticsData.logData.device_id, // Must be UUID, not null
    };

    // Validate required UUIDs
    if (!logData.office_id || !logData.device_id || !logData.logId) {
      return res.status(400).json({ error: 'office_id, device_id and id are required' });
    }

    const insertedLog = await databaseService.insertVehicleLog(logData);
    res.json({ status: 'success', logId: insertedLog.id });
  } catch (error) {
    console.error('Error inserting analytics data:', error); // Debug log
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
      cameraId: req.query.camera_id,
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