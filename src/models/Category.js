const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    defaultQty: Number,
  },
  { _id: false }
);

const subserviceSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    tag: String,
    image: String,
    customImage: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    hourlyRate: Number,
    visitBasePrice: Number,
    unitLabel: String,
    unitPrice: Number,
    summary: String,
    tasks: [String],
    equipment: String,
    materialsKit: [materialSchema],
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    title: String,
    shortTitle: String,
    icon: String,
    image: String,
    customImage: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    description: String,
    subservices: [subserviceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
