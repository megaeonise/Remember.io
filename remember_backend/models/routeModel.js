const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  start: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  end: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);