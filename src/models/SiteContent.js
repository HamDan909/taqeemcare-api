const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    id: String,
    visible: { type: Boolean, default: true },
  },
  { _id: false }
);

const materialCardSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    popular: Boolean,
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    fontScale: { type: Number, default: 1 },
    spacingScale: { type: Number, default: 1 },
    imageScale: { type: Number, default: 1 },
    sections: [sectionSchema],
    brand: {
      name: String,
      subtitle: String,
      mark: String,
    },
    hero: {
      badge: String,
      titleBefore: String,
      titleAccent: String,
      titleAfter: String,
      intro: String,
      searchPlaceholder: String,
      searchButton: String,
      chips: [String],
      accountChip: String,
    },
    shortcuts: {
      cartLabel: String,
      loginLabel: String,
    },
    sectorsHeading: String,
    materials: {
      heading: String,
      intro: String,
      popularBadge: String,
      cards: [materialCardSchema],
    },
    b2bCard: {
      badge: String,
      title: String,
      body: String,
      button: String,
    },
    sectorList: { title: String },
    contact: {
      title: String,
      address: String,
      phone: String,
      email: String,
      about: String,
    },
    footer: String,
    b2bPage: {
      title: String,
      intro: String,
      bullets: [String],
      office: String,
    },
    tabs: {
      home: String,
      cart: String,
      account: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
