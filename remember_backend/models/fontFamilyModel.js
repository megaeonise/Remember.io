const mongoose = require('mongoose');

const fontFamilySchema = new mongoose.Schema({
  family: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FontFamily', fontFamilySchema);