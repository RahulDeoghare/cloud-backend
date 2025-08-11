const express = require('express');
const aiAnalyticsController = require('../controllers/aiAnalyticsController');
const router = express.Router();

router.get('/getCamerasForAnalytics', aiAnalyticsController.getCamerasForAnalytics);
router.post('/sendAnalyticsJson', aiAnalyticsController.sendAnalyticsJson);
router.post('/reportError', aiAnalyticsController.reportError);

router.get('/getVehicleLogs', aiAnalyticsController.getVehicleLogs);


module.exports = router;