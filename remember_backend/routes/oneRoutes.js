const express = require('express');
const { saveOne, getOnes } = require('../controllers/oneController');
const router = express.Router();

router.post('/save', saveOne)
router.get('/:userId', getOnes)

module.exports = router;