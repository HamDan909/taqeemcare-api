const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    brand: { type: String, required: true },
    bankName: { type: String, required: true },
    holderName: { type: String, required: true },
    last4: { type: String, required: true },
    expiry: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
