const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const catalogRoutes = require('./routes/catalog');
const searchRoutes = require('./routes/search');
const pricingRoutes = require('./routes/pricing');
const orderRoutes = require('./routes/orders');
const templateRoutes = require('./routes/templates');
const cardRoutes = require('./routes/cards');
const b2bRoutes = require('./routes/b2b');
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const { attachUser } = require('./middleware/auth');

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(attachUser);

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'rukn-altaqeem' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/catalog', catalogRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/pricing', pricingRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/cards', cardRoutes);
  app.use('/api/b2b', b2bRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'المسار غير موجود' });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ message: err.message || 'خطأ في الخادم' });
  });

  return app;
}

module.exports = { createApp };
