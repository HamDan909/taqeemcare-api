const Category = require('../models/Category');
const Card = require('../models/Card');
const { quoteService } = require('../services/pricing');

const SHIFTS = [
  'صباحاً (8:00 ص - 1:00 م)',
  'مساءً (2:00 م - 8:00 م)',
  'عمل ليلي (بعد الدوام للشركات)',
];

function makeOrderId() {
  return `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
}

async function buildLine(raw) {
  if (raw && raw.isCustomOrder) {
    const cat = raw.categoryId ? await Category.findOne({ id: raw.categoryId }).lean() : null;
    const title = cat ? cat.shortTitle : (raw.categoryTitle || 'قسم مخصص');
    return {
      isCustomOrder: true,
      categoryId: raw.categoryId || '',
      subserviceId: '',
      categoryTitle: raw.categoryTitle || title,
      serviceTitle: raw.serviceTitle || `طلب مخصص: ${title}`,
      pricingSummary: raw.pricingSummary || 'تسعير مخصص من الإدارة',
      materialSummary: raw.materialSummary || 'يُحدد بعد المراجعة',
      specialMaterials: [],
      customNote: String(raw.customNote || '').trim(),
      totalPrice: 0,
      hasUnpricedItems: true,
      config: null,
    };
  }

  const category = await Category.findOne({ id: raw.categoryId }).lean();
  if (!category) {
    const error = new Error('القطاع غير موجود');
    error.status = 400;
    throw error;
  }
  const sub = (category.subservices || []).find((item) => item.id === raw.subserviceId);
  if (!sub) {
    const error = new Error('الخدمة غير موجودة');
    error.status = 400;
    throw error;
  }

  const breakdown = quoteService(sub, raw.calc || raw.config || {});
  return {
    isCustomOrder: false,
    categoryId: category.id,
    subserviceId: sub.id,
    categoryTitle: category.shortTitle,
    serviceTitle: sub.title,
    pricingSummary: `${breakdown.modeLabel} (${breakdown.serviceCost} د.ل)`,
    materialSummary: `${breakdown.materialLabel} (${breakdown.materialsCost} د.ل)`,
    specialMaterials: breakdown.specialMaterials,
    customNote: String(raw.customNote || '').trim(),
    totalPrice: breakdown.totalCost,
    hasUnpricedItems: breakdown.hasUnpricedItems,
    config: {
      pricingMode: breakdown.pricingMode,
      hours: breakdown.hours,
      workers: breakdown.workers,
      units: breakdown.units,
      materialSource: breakdown.materialSource,
      materialDuration: breakdown.materialDuration,
      materialTier: breakdown.materialTier,
      customQuantities: breakdown.customQuantities,
      specialMaterials: breakdown.specialMaterials,
    },
  };
}

async function paymentLabelFor(user, paymentMethod) {
  if (paymentMethod === 'bank_transfer') {
    return 'التحويل المصرفي المباشر (مصرف الجمهورية)';
  }
  const isObjectId = typeof paymentMethod === 'string' && /^[a-f0-9]{24}$/i.test(paymentMethod);
  if (isObjectId && user) {
    const card = await Card.findOne({ _id: paymentMethod, user: user._id });
    if (card) {
      return `بطاقة مصرفية محفوظة (${card.bankName} •••• ${card.last4})`;
    }
  }
  return 'الدفع عند الاستلام / بعد الاعتماد';
}

function orderTotals(items) {
  const totalPrice = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const hasUnpricedItems = items.some((item) => item.hasUnpricedItems || item.isCustomOrder);
  const status = hasUnpricedItems ? 'بانتظار تسعير المواد الخاصة' : 'مؤكد وجاري التنفيذ';
  return { totalPrice, hasUnpricedItems, status };
}

module.exports = {
  SHIFTS,
  makeOrderId,
  buildLine,
  paymentLabelFor,
  orderTotals,
};
