
const express = require('express');
const { saveFavoriteColor, getFavoriteColors } = require('../controllers/favoriteColorController');
const router = express.Router();

router.post('/save', saveFavoriteColor);
router.get('/:userId', getFavoriteColors);

module.exports = router;