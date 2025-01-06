const express = require('express');
const { getleaveTime, addleaveTime, putleaveTime } = require('../controllers/leaveTimeController');
const router = express.Router();

router.get('/:userId', getleaveTime);
router.post('/save', addleaveTime);
router.put('/', putleaveTime);

module.exports = router;