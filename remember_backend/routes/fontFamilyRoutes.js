const express = require('express');
const { getFontFamilies, addFontFamily } = require('../controllers/fontFamilyController');
const router = express.Router();

router.get('/', getFontFamilies);
router.post('/', addFontFamily);

module.exports = router;