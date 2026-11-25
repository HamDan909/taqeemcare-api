const express = require('express');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');
const {
  makeOrderId,
  buildLine,
  paymentLabelFor,
  orderTotals,
} = require('../services/orders');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.clientName || '').trim();
    const phone = String(body.clientPhone || '').trim();
    const area = String(body.clientArea || '').trim();
    const itemsInput = Array.isArray(body.items) ? body.items : [];

    if (!name || !phone || !area) {
      return res.status(400).json({ message: 'الاسم والهاتف والمنطقة مطلوبة' });
    }
    if (itemsInput.length === 0) {
      return res.status(400).json({ message: 'يرجى إضافة خدمة واحدة على الأقل' });
    }

    const items = [];
    for (const raw of itemsInput) {
      items.push(await buildLine(raw));
    }

    const paymentMethod = body.paymentMethod || 'cod';
    const totals = orderTotals(items);
    let orderId = makeOrderId();
    while (await Order.exists({ orderId })) orderId = makeOrderId();

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      clientName: name,
      clientPhone: phone,
      clientArea: area,
      clientAddress: String(body.clientAddress || '').trim(),
      preferredDate: body.preferredDate || '',
      shift: body.shift || 'صباحاً (8:00 ص - 1:00 م)',
      notes: String(body.notes || '').trim(),
      paymentMethod,
      paymentLabel: await paymentLabelFor(req.user, paymentMethod),
      ...totals,
      items,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
