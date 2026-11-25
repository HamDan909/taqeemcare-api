const mongoose = require('mongoose');

const b2bSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, required: true },
    company: { type: String, required: true },
    contact: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    details: { type: String, required: true },
    status: { type: String, default: 'جديد' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('B2BRequest', b2bSchema);
