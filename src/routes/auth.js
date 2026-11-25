const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken, publicUser, requireAuth } = require('../middleware/auth');

const router = express.Router();

function sendAuth(res, user, status = 200) {
  res.status(status).json({ token: signToken(user), user: publicUser(user) });
}

router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('الاسم مطلوب'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور 6 أحرف على الأقل'),
  body('phone').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
      const email = req.body.email.trim().toLowerCase();
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'هذا البريد مسجل مسبقاً' });
      const user = await User.create({
        name: req.body.name.trim(),
        email,
        passwordHash: await bcrypt.hash(req.body.password, 10),
        phone: (req.body.phone || '').trim(),
        area: (req.body.area || 'طرابلس - ليبيا').trim(),
        provider: 'email',
        role: 'client',
      });
      return sendAuth(res, user, 201);
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'أدخل البريد وكلمة المرور' });
      }
      const user = await User.findOne({ email: req.body.email.trim().toLowerCase() });
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
      }
      const ok = await bcrypt.compare(req.body.password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
      return sendAuth(res, user);
    } catch (err) {
      return next(err);
    }
  }
);

router.post('/demo', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: 'tariq.ali@alofoq.ly' });
    if (!user) return res.status(404).json({ message: 'الحساب التجريبي غير مهيأ. شغّل البذرة أولاً.' });
    return sendAuth(res, user);
  } catch (err) {
    return next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
