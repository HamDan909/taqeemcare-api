const express = require('express');
const Template = require('../models/Template');
const Category = require('../models/Category');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const templates = await Template.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ templates });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (body.cartPayload) {
      const payload = body.cartPayload;
      const template = await Template.create({
        user: req.user._id,
        templateName: body.templateName || payload.serviceTitle || 'طلب محفوظ',
        categoryId: body.categoryId || payload.categoryId || 'custom',
        categoryTitle: body.categoryTitle || payload.categoryTitle || '',
        description: body.description || [
          payload.pricingSummary,
          payload.materialSummary,
          payload.customNote,
        ].filter(Boolean).join(' | '),
        estimatedPrice: Number(payload.totalPrice) || 0,
        cartPayload: payload,
      });
      return res.status(201).json({ template });
    }

    const name = String(body.templateName || '').trim();
    const description = String(body.description || '').trim();
    const categoryId = body.categoryId;
    if (!name || !description || !categoryId) {
      return res.status(400).json({ message: 'اسم القالب والقطاع والتفاصيل مطلوبة' });
    }
    const cat = await Category.findOne({ id: categoryId }).lean();
    if (!cat) return res.status(400).json({ message: 'القطاع غير موجود' });

    const template = await Template.create({
      user: req.user._id,
      templateName: name,
      categoryId,
      categoryTitle: cat.title,
      description,
      estimatedPrice: 0,
      cartPayload: {
        isCustomOrder: true,
        categoryId,
        categoryTitle: cat.shortTitle,
        serviceTitle: `قالب محفوظ: ${name}`,
        pricingSummary: 'تسعير مخصص حسب القالب المحفوظ',
        materialSummary: 'حسب مواصفات القالب',
        specialMaterials: [],
        customNote: description,
        totalPrice: 0,
        hasUnpricedItems: true,
      },
    });
    res.status(201).json({ template });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Template.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'القالب غير موجود' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
