const mongoose = require('mongoose');

const specialSchema = new mongoose.Schema(
  { name: String, qty: String },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    isCustomOrder: { type: Boolean, default: false },
    categoryId: { type: String, default: '' },
    subserviceId: { type: String, default: '' },
    categoryTitle: String,
    serviceTitle: String,
    pricingSummary: String,
    materialSummary: String,
    specialMaterials: [specialSchema],
    customNote: { type: String, default: '' },
    totalPrice: { type: Number, default: 0 },
    hasUnpricedItems: { type: Boolean, default: false },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientArea: { type: String, required: true },
    clientAddress: { type: String, default: '' },
    preferredDate: { type: String, default: '' },
    shift: { type: String, default: '' },
    notes: { type: String, default: '' },
    paymentMethod: { type: String, default: 'cod' },
    paymentLabel: { type: String, default: '' },
    totalPrice: { type: Number, default: 0 },
    hasUnpricedItems: { type: Boolean, default: false },
    status: { type: String, required: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
