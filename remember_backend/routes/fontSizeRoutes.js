const express = require('express');
const { getFontSizes, addFontSize } = require('../controllers/fontSizeController');
const router = express.Router();

router.get('/', getFontSizes);
router.post('/', addFontSize); 

module.exports = router;