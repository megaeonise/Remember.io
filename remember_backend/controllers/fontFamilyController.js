const FontFamily = require('../models/fontFamilyModel');

const getFontFamilies = async (req, res) => {
  try {
    const fontFamilies = await FontFamily.find();
    res.status(200).json({ success: true, fontFamilies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load font families', error });
  }
};

const addFontFamily = async (req, res) => {
  try {
    const { family } = req.body;
    const newFontFamily = new FontFamily({ family });
    await newFontFamily.save();
    res.status(201).json({ success: true, fontFamily: newFontFamily });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add font family', error });
  }
};

module.exports = { getFontFamilies, addFontFamily };