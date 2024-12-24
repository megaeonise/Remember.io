const One = require('../models/oneModel');

const saveOne = async (req, res) => {
  try {
    const { userId, first, second } = req.body;
    const one = new One({ userId, first, second });
    await one.save();
    res.status(201).json({ success: true, message: 'One saved successfully', one });
  } catch (error) {
    console.log('why')
    res.status(500).json({ success: false, message: 'Failed to save one', error });
  }
};

const getOnes = async (req, res) => {
  try {
    const { userId } = req.params;
    const ones = await One.find({ userId });
    res.status(200).json({ success: true, ones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load ones', error });
  }
};

module.exports = { saveOne, getOnes };