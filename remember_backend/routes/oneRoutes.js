const express = require('express');
const { saveOne, getOnes } = require('../controllers/oneController');
const router = express.Router();

router.post('/one', saveOne)
router.get('/one', getOnes)

module.exports = router;