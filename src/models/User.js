const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: '' },
    phone: { type: String, default: '' },
    area: { type: String, default: 'طرابلس - ليبيا' },
    provider: { type: String, enum: ['email', 'demo', 'google'], default: 'email' },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    savedBankAccount: {
      bankName: { type: String, default: '' },
      iban: { type: String, default: '' },
      accountHolder: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
