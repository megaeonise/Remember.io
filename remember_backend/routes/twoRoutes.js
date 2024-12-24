const express = require('express');
const { saveTwo, getTwos } = require('../controllers/twoController');
const router = express.Router();

router.post('/save', saveTwo)
router.get('/:userId', getTwos)

module.exports = router;