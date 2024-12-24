const express = require('express');
const { saveTwo, getTwos } = require('../controllers/twoController');
const router = express.Router();

router.post('/two', saveTwo)
router.get('/two', getTwos)

module.exports = router;