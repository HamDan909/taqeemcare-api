const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  );
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    area: user.area,
    provider: user.provider,
    role: user.role,
    savedBankAccount: user.savedBankAccount && user.savedBankAccount.bankName
      ? user.savedBankAccount
      : null,
  };
}

function readToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

async function attachUser(req, res, next) {
  const token = readToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'الحساب غير موجود' });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'جلسة غير صالحة' });
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'يرجى تسجيل الدخول' });
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'هذه العملية مخصصة لإدارة المبيعات' });
  }
  return next();
}

module.exports = { signToken, publicUser, attachUser, requireAuth, requireAdmin };
