const express = require('express');
const B2BRequest = require('../models/B2BRequest');

const router = express.Router();

const TYPES = [
  'طلب زيارة معاينة ميدانية مجانية',
  'عقد توفير عمالة نظافة وسفرجة ثابتة',
  'عقد نظافة شوارع / ميادين / أراضي فضاء',
  'عقد إزالة مخلفات بناء ونقل نفايات',
  'طلب شراكة أو مقاولات من الباطن (ائتلاف)',
  'توريد مواد تنظيف وتعقيم بالجملة',
];

router.get('/types', (req, res) => {
  res.json({ types: TYPES });
});

router.post('/', async (req, res, next) => {
  try {
    const type = TYPES.includes(req.body.type) ? req.body.type : TYPES[0];
    const company = String(req.body.company || '').trim();
    const contact = String(req.body.contact || '').trim();
    const phone = String(req.body.phone || '').trim();
    const location = String(req.body.location || '').trim();
    const details = String(req.body.details || '').trim();
    if (!company || !contact || !phone || !location || !details) {
      return res.status(400).json({ message: 'جميع حقول طلب العقد مطلوبة' });
    }
    const request = await B2BRequest.create({
      user: req.user ? req.user._id : null,
      type,
      company,
      contact,
      phone,
      location,
      details,
    });
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
