const express = require('express');
const Order = require('../models/Order');
const B2BRequest = require('../models/B2BRequest');
const Category = require('../models/Category');
const SiteContent = require('../models/SiteContent');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { orderTotals } = require('../services/orders');
const { sanitizeSiteContent } = require('../seed/siteContent');

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get('/orders', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.pending === '1') filter.hasUnpricedItems = true;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/items/:index', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
    const index = Number(req.params.index);
    const item = order.items[index];
    if (!item) return res.status(404).json({ message: 'البند غير موجود' });
    const lineTotal = Number(req.body.lineTotal);
    if (!Number.isFinite(lineTotal) || lineTotal < 0) {
      return res.status(400).json({ message: 'أدخل سعراً صالحاً' });
    }
    item.totalPrice = Math.round(lineTotal);
    item.hasUnpricedItems = false;
    item.isCustomOrder = false;
    item.pricingSummary = req.body.pricingSummary
      ? String(req.body.pricingSummary)
      : `تم التسعير من الإدارة (${item.totalPrice} د.ل)`;
    if (req.body.materialSummary) item.materialSummary = String(req.body.materialSummary);
    const totals = orderTotals(order.items);
    order.totalPrice = totals.totalPrice;
    order.hasUnpricedItems = totals.hasUnpricedItems;
    order.status = totals.status;
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const status = String(req.body.status || '').trim();
    if (!status) return res.status(400).json({ message: 'الحالة مطلوبة' });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

router.get('/b2b', async (req, res, next) => {
  try {
    const requests = await B2BRequest.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

router.patch('/b2b/:id', async (req, res, next) => {
  try {
    const status = String(req.body.status || '').trim();
    if (!status) return res.status(400).json({ message: 'الحالة مطلوبة' });
    const request = await B2BRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });
    res.json({ request });
  } catch (err) {
    next(err);
  }
});

function cleanId(value) {
  const id = String(value || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{2,48}$/.test(id)) return '';
  return id;
}

function cleanText(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.trim();
}

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return fallback;
  return Math.round(number * 100) / 100;
}

function cleanTasks(value) {
  const list = Array.isArray(value) ? value : String(value || '').split('\n');
  return list.map((line) => String(line).trim()).filter(Boolean);
}

function cleanMaterials(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => ({
    id: cleanId(item && item.id) || `m-${index + 1}`,
    name: cleanText(item && item.name),
    price: cleanNumber(item && item.price, 0),
    defaultQty: cleanNumber(item && item.defaultQty, 1),
  })).filter((item) => item.name);
}

function categoryFields(body, current = {}) {
  return {
    title: cleanText(body.title, current.title || 'قطاع جديد'),
    shortTitle: cleanText(body.shortTitle, current.shortTitle || body.title || 'قطاع'),
    icon: cleanText(body.icon, current.icon || 'home'),
    description: cleanText(body.description, current.description || ''),
    customImage: cleanText(body.customImage, current.customImage || ''),
    visible: body.visible !== false,
  };
}

function serviceFields(body, current = {}) {
  return {
    title: cleanText(body.title, current.title || 'خدمة جديدة'),
    tag: cleanText(body.tag, current.tag || ''),
    summary: cleanText(body.summary, current.summary || ''),
    equipment: cleanText(body.equipment, current.equipment || ''),
    tasks: body.tasks === undefined ? (current.tasks || []) : cleanTasks(body.tasks),
    hourlyRate: body.hourlyRate === undefined ? (current.hourlyRate || 0) : cleanNumber(body.hourlyRate, 0),
    visitBasePrice: body.visitBasePrice === undefined ? (current.visitBasePrice || 0) : cleanNumber(body.visitBasePrice, 0),
    unitLabel: cleanText(body.unitLabel, current.unitLabel || 'وحدة'),
    unitPrice: body.unitPrice === undefined ? (current.unitPrice || 0) : cleanNumber(body.unitPrice, 0),
    customImage: cleanText(body.customImage, current.customImage || ''),
    materialsKit: body.materialsKit === undefined ? (current.materialsKit || []) : cleanMaterials(body.materialsKit),
    visible: body.visible !== false,
    image: current.image || '',
  };
}

router.get('/content', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne({ key: 'site' }).lean();
    res.json({ content });
  } catch (err) {
    next(err);
  }
});

router.put('/content', async (req, res, next) => {
  try {
    const payload = sanitizeSiteContent(req.body);
    const content = await SiteContent.findOneAndUpdate(
      { key: 'site' },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ content });
  } catch (err) {
    next(err);
  }
});

router.get('/catalog', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, id: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.post('/catalog', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!cleanText(body.title)) return res.status(400).json({ message: 'اسم القطاع مطلوب' });
    let id = cleanId(body.id);
    if (!id) id = `sector-${Date.now().toString(36)}`;
    const exists = await Category.findOne({ id });
    if (exists) return res.status(400).json({ message: 'معرّف القطاع مستخدم' });
    const count = await Category.countDocuments();
    const category = await Category.create({
      id,
      sortOrder: count,
      image: '',
      subservices: [],
      ...categoryFields(body),
    });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

router.post('/catalog/reorder', async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.map(cleanId).filter(Boolean) : [];
    if (!ids.length) return res.status(400).json({ message: 'ترتيب غير صالح' });
    await Promise.all(ids.map((id, index) => Category.updateOne({ id }, { sortOrder: index })));
    const categories = await Category.find().sort({ sortOrder: 1, id: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.put('/catalog/:id', async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    Object.assign(category, categoryFields(req.body || {}, category.toObject()));
    await category.save();
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

router.post('/catalog/:id/services/reorder', async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const byId = new Map(category.subservices.map((sub) => [sub.id, sub]));
    const next = [];
    ids.forEach((id) => {
      if (byId.has(id)) next.push(byId.get(id));
    });
    category.subservices.forEach((sub) => {
      if (!ids.includes(sub.id)) next.push(sub);
    });
    category.subservices = next;
    await category.save();
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

router.post('/catalog/:id/services', async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    const body = req.body || {};
    if (!cleanText(body.title)) return res.status(400).json({ message: 'اسم الخدمة مطلوب' });
    let id = cleanId(body.id);
    if (!id) id = `svc-${Date.now().toString(36)}`;
    if (category.subservices.some((sub) => sub.id === id)) {
      return res.status(400).json({ message: 'معرّف الخدمة مستخدم' });
    }
    category.subservices.push({ id, ...serviceFields(body) });
    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

router.put('/catalog/:id/services/:subId', async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    const sub = category.subservices.find((item) => item.id === req.params.subId);
    if (!sub) return res.status(404).json({ message: 'الخدمة غير موجودة' });
    Object.assign(sub, serviceFields(req.body || {}, sub.toObject()));
    await category.save();
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
