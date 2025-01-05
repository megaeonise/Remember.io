const express = require('express');
const { getleaveTime, addleaveTime, putleaveTime } = require('../controllers/leaveTimeController');
const router = express.Router();

router.get('/', getleaveTime);
router.post('/', addleaveTime);
router.put('/', putleaveTime);

module.exports = router;