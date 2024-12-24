const mongoose = require('mongoose');

const twoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  first: {
    one: {type: Number, required: true},
  },
  second: {
    two: {type: Number, required: true},
  },
}, { timestamps: true });

module.exports = mongoose.model('Two', twoSchema);