const express = require('express');
const { saveRoute, getRoutes } = require('../controllers/routeController');
const router = express.Router();

router.post('/save', saveRoute);
router.get('/:userId', getRoutes);

module.exports = router;