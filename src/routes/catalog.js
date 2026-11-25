const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

function visibleServices(category) {
  return {
    ...category,
    subservices: (category.subservices || []).filter((sub) => sub.visible !== false),
  };
}

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ visible: { $ne: false } })
      .sort({ sortOrder: 1, id: 1 })
      .lean();
    res.json({ categories: categories.map(visibleServices) });
  } catch (err) {
    next(err);
  }
});

router.get('/:categoryId', async (req, res, next) => {
  try {
    const category = await Category.findOne({
      id: req.params.categoryId,
      visible: { $ne: false },
    }).lean();
    if (!category) return res.status(404).json({ message: 'القطاع غير موجود' });
    res.json({ category: visibleServices(category) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
