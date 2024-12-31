
const FavoriteColor = require('../models/favoriteColorModel');

const saveFavoriteColor = async (req, res) => {
  try {
    const { userId, name, color } = req.body;
    const favoriteColor = new FavoriteColor({ userId, name, color });
    await favoriteColor.save();
    res.status(201).json({ success: true, message: 'Favorite color saved successfully', favoriteColor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save favorite color', error });
  }
};

const getFavoriteColors = async (req, res) => {
  try {
    const { userId } = req.params;
    const favoriteColors = await FavoriteColor.find({ userId });
    res.status(200).json({ success: true, favoriteColors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load favorite colors', error });
  }
};

module.exports = { saveFavoriteColor, getFavoriteColors };