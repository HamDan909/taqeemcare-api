const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const categories = await Category.find().lean();
    if (!q) return res.json({ results: [] });
    const results = [];
    categories.forEach((cat) => {
      if (cat.visible === false) return;
      (cat.subservices || []).forEach((sub) => {
        if (sub.visible === false) return;
        const inTitle = (sub.title || '').toLowerCase().includes(q);
        const inSummary = (sub.summary || '').toLowerCase().includes(q);
        const inTasks = (sub.tasks || []).some((task) => task.toLowerCase().includes(q));
        if (inTitle || inSummary || inTasks) {
          results.push({
            category: {
              id: cat.id,
              title: cat.title,
              shortTitle: cat.shortTitle,
              icon: cat.icon,
              image: cat.image,
              description: cat.description,
            },
            subservice: sub,
          });
        }
      });
    });
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
