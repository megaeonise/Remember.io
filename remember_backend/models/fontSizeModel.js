
const mongoose = require('mongoose');

const fontSizeSchema = new mongoose.Schema({
  size: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FontSize', fontSizeSchema);