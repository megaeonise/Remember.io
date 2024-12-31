
const FontSize = require('../models/fontSizeModel');

const getFontSizes = async (req, res) => {
  try {
    const fontSizes = await FontSize.find();
    res.status(200).json({ success: true, fontSizes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load font sizes', error });
  }
};

const addFontSize = async (req, res) => {
  try {
    const { size } = req.body;
    const newFontSize = new FontSize({ size });
    await newFontSize.save();
    res.status(201).json({ success: true, fontSize: newFontSize });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add font size', error });
  }
};

module.exports = { getFontSizes, addFontSize };