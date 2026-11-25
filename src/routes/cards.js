const express = require('express');
const crypto = require('crypto');
const Card = require('../models/Card');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const BRANDS = [
  'بطاقة محلية (نمو / تداول / ادفع لي)',
  'Visa / Mastercard محلية أو دولية',
  'بطاقة شركات ومؤسسات',
];

function publicCard(card) {
  return {
    id: card._id,
    brand: card.brand,
    bankName: card.bankName,
    holderName: card.holderName,
    last4: card.last4,
    expiry: card.expiry,
    token: card.token,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const cards = await Card.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ cards: cards.map(publicCard) });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const brand = BRANDS.includes(req.body.brand) ? req.body.brand : BRANDS[0];
    const bankName = String(req.body.bankName || '').trim();
    const holderName = String(req.body.holderName || '').trim().toUpperCase();
    const expiry = String(req.body.expiry || '').trim();
    const rawNum = String(req.body.cardNumber || '').replace(/\s+/g, '');

    if (!bankName || !holderName || !expiry) {
      return res.status(400).json({ message: 'بيانات البطاقة ناقصة' });
    }
    if (!/^\d{12,19}$/.test(rawNum)) {
      return res.status(400).json({ message: 'يرجى إدخال رقم بطاقة صحيح' });
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return res.status(400).json({ message: 'تاريخ الانتهاء يجب أن يكون MM/YY' });
    }

    const last4 = rawNum.slice(-4);
    const card = await Card.create({
      user: req.user._id,
      brand,
      bankName,
      holderName,
      last4,
      expiry,
      token: `tok_ly_${crypto.randomBytes(4).toString('hex')}`,
    });
    res.status(201).json({ card: publicCard(card) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Card.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'البطاقة غير موجودة' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
