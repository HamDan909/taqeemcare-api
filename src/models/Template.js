const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateName: { type: String, required: true },
    categoryId: { type: String, default: '' },
    categoryTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    estimatedPrice: { type: Number, default: 0 },
    cartPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
