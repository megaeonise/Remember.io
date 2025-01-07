const mongoose = require('mongoose');

const leaveTimeSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            return /^[0-2]\d:[0-5]\d$/.test(v)
        }
    }
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('leaveTime', leaveTimeSchema);