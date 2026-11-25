const express = require('express');
const SiteContent = require('../models/SiteContent');
const { defaultSiteContent } = require('../seed/siteContent');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const content = await SiteContent.findOne({ key: 'site' }).lean();
    res.json({ content: content || defaultSiteContent() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
