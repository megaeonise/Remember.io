const Two = require('../models/twoModel');

const saveTwo = async (req, res) => {
  try {
    const { userId, first, second } = req.body;
    const two = new Two({ userId, first, second });
    await two.save();
    res.status(201).json({ success: true, message: 'Two saved successfully', two });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save two', error });
  }
};

const getTwos = async (req, res) => {
  try {
    const { userId } = req.params;
    const twos = await Two.find({ userId });
    res.status(200).json({ success: true, twos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load twos', error });
  }
};

module.exports = { saveTwo, getTwos };