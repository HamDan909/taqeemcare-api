const express = require('express');
const Category = require('../models/Category');
const { quoteService } = require('../services/pricing');

const router = express.Router();

router.post('/quote', async (req, res, next) => {
  try {
    const { categoryId, subserviceId, calc } = req.body || {};
    const category = await Category.findOne({ id: categoryId }).lean();
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    const sub = (category.subservices || []).find((item) => item.id === subserviceId);
    if (!sub) return res.status(404).json({ message: 'الخدمة غير موجودة' });
    const breakdown = quoteService(sub, calc || {});
    res.json({
      categoryTitle: category.shortTitle,
      serviceTitle: sub.title,
      breakdown,
      pricingSummary: `${breakdown.modeLabel} (${breakdown.serviceCost} د.ل)`,
      materialSummary: `${breakdown.materialLabel} (${breakdown.materialsCost} د.ل)`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
