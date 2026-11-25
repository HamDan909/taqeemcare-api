const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const Template = require('../models/Template');
const Card = require('../models/Card');
const catalog = require('./catalog.json');
const SiteContent = require('../models/SiteContent');
const { defaultSiteContent } = require('./siteContent');

async function seed() {
  for (let index = 0; index < catalog.length; index += 1) {
    await Category.updateOne(
      { id: catalog[index].id },
      { ...catalog[index], sortOrder: index },
      { upsert: true }
    );
  }

  if (!(await SiteContent.findOne({ key: 'site' }))) {
    await SiteContent.create(defaultSiteContent());
  }

  const adminHash = await bcrypt.hash('admin1234', 10);
  await User.updateOne(
    { email: 'admin@rukn-altaqeem.ly' },
    {
      name: 'إدارة ركن التعقيم',
      email: 'admin@rukn-altaqeem.ly',
      passwordHash: adminHash,
      phone: '+218 91 000 0000',
      area: 'طرابلس - ليبيا',
      provider: 'email',
      role: 'admin',
    },
    { upsert: true }
  );

  const demoHash = await bcrypt.hash('demo1234', 10);
  const demo = await User.findOneAndUpdate(
    { email: 'tariq.ali@alofoq.ly' },
    {
      name: 'طارق بن علي (شركة الأفق)',
      email: 'tariq.ali@alofoq.ly',
      passwordHash: demoHash,
      phone: '091-4528890',
      area: 'طرابلس - حي الأندلس',
      provider: 'demo',
      role: 'client',
      savedBankAccount: {
        bankName: 'مصرف الجمهورية - فرع طرابلس الرئيسي',
        iban: 'LY89 0020 0140 0000 1234 5678 9',
        accountHolder: 'شركة الأفق للتجارة',
      },
    },
    { upsert: true, new: true }
  );

  const orderCount = await Order.countDocuments({ user: demo._id });
  if (orderCount === 0) {
    await Order.insertMany([
      {
        orderId: 'ORD-2026-104',
        user: demo._id,
        clientName: demo.name,
        clientPhone: demo.phone,
        clientArea: demo.area,
        preferredDate: '2026-11-10',
        shift: 'صباحاً (8:00 ص - 1:00 م)',
        paymentMethod: 'card',
        paymentLabel: 'بطاقة مصرفية (نمو/تداول •••• 4821)',
        totalPrice: 365,
        hasUnpricedItems: false,
        status: 'مكتمل ومعتمد',
        items: [
          {
            isCustomOrder: false,
            categoryId: 'residential',
            subserviceId: 'res-upholstery',
            categoryTitle: 'المنازل والفلل',
            serviceTitle: 'تنظيف السجاد، الكنب، والمفروشات بالبخار',
            pricingSummary: 'زيارة واحدة (3 طقم كنب / سجادة) (300 د.ل)',
            materialSummary: 'من الشركة (تكفي زيارة واحدة) (65 د.ل)',
            specialMaterials: [],
            customNote: 'التركيز على مجلس الضيوف الرئيسي',
            totalPrice: 365,
            hasUnpricedItems: false,
            config: {
              pricingMode: 'visit',
              hours: 4,
              workers: 2,
              units: 3,
              materialSource: 'company',
              materialDuration: '1',
              materialTier: 'basic',
              customQuantities: {},
              specialMaterials: [],
            },
          },
        ],
      },
      {
        orderId: 'ORD-2026-089',
        user: demo._id,
        clientName: demo.name,
        clientPhone: demo.phone,
        clientArea: demo.area,
        preferredDate: '2026-10-24',
        shift: 'مساءً (2:00 م - 8:00 م)',
        paymentMethod: 'bank_transfer',
        paymentLabel: 'تحويل مصرفي مباشر (مصرف الجمهورية)',
        totalPrice: 285,
        hasUnpricedItems: false,
        status: 'مكتمل ومعتمد',
        items: [
          {
            isCustomOrder: false,
            categoryId: 'pest-disinfection',
            subserviceId: 'pest-sterilization',
            categoryTitle: 'مكافحة القوارض والتعقيم',
            serviceTitle: 'التعقيم والتطهير الصحي الشامل ضد الفيروسات والبكتيريا',
            pricingSummary: 'زيارة واحدة (2 مساحة 100 م²) (204 د.ل)',
            materialSummary: 'من الشركة (تكفي زيارتين - خصم 10%) (81 د.ل)',
            specialMaterials: [],
            customNote: 'إصدار شهادة تعقيم للمقر الإداري',
            totalPrice: 285,
            hasUnpricedItems: false,
            config: {
              pricingMode: 'visit',
              hours: 4,
              workers: 2,
              units: 2,
              materialSource: 'company',
              materialDuration: '2',
              materialTier: 'basic',
              customQuantities: {},
              specialMaterials: [],
            },
          },
        ],
      },
    ]);
  }

  const templateCount = await Template.countDocuments({ user: demo._id });
  if (templateCount === 0) {
    await Template.insertMany([
      {
        user: demo._id,
        templateName: 'باقة تنظيف الفيلا الشهرية المعتادة',
        categoryId: 'residential',
        categoryTitle: 'تنظيف المنازل والوحدات السكنية',
        description: 'تنظيف عميق لـ 5 غرف + صالتين + مطبخ، مع باقة مواد تكفي زيارتين وزيادة كمية مذيب الدهون.',
        estimatedPrice: 460,
        cartPayload: {
          isCustomOrder: false,
          categoryId: 'residential',
          subserviceId: 'res-deep',
          categoryTitle: 'المنازل والفلل',
          serviceTitle: 'التنظيف العميق الشامل للمنازل والفلل',
          pricingSummary: 'زيارة واحدة (5 غرفة / مرفق) (370 د.ل)',
          materialSummary: 'من الشركة (تكفي زيارتين - خصم 10%) (90 د.ل)',
          specialMaterials: [],
          customNote: 'باقة الفيلا المحفوظة - طرابلس حي الأندلس',
          totalPrice: 460,
          hasUnpricedItems: false,
          config: {
            pricingMode: 'visit',
            hours: 4,
            workers: 2,
            units: 5,
            materialSource: 'company',
            materialDuration: '2',
            materialTier: 'basic',
            customQuantities: {},
            specialMaterials: [],
          },
        },
      },
      {
        user: demo._id,
        templateName: 'تجهيز سفرجة وضيافة اجتماعات مجلس الإدارة',
        categoryId: 'hospitality',
        categoryTitle: 'خدمات السفرجة والضيافة وتوفير العمالة',
        description: 'توفير 2 سفرجية بزي رسمي لمدة يوم كامل لتقديم الضيافة وتنظيم قاعة الاجتماعات.',
        estimatedPrice: 420,
        cartPayload: {
          isCustomOrder: false,
          categoryId: 'hospitality',
          subserviceId: 'hos-office-stewards',
          categoryTitle: 'السفرجة والضيافة والعمالة',
          serviceTitle: 'توفير سفرجية وعمال ضيافة للشركات والمصارف والمؤسسات',
          pricingSummary: 'زيارة واحدة (2 سفرجي / يوم) (360 د.ل)',
          materialSummary: 'من الشركة (تكفي زيارة واحدة) (60 د.ل)',
          specialMaterials: [],
          customNote: 'قالب اجتماعات الشركة الشهري',
          totalPrice: 420,
          hasUnpricedItems: false,
          config: {
            pricingMode: 'visit',
            hours: 4,
            workers: 2,
            units: 2,
            materialSource: 'company',
            materialDuration: '1',
            materialTier: 'basic',
            customQuantities: {},
            specialMaterials: [],
          },
        },
      },
    ]);
  }

  const cardCount = await Card.countDocuments({ user: demo._id });
  if (cardCount === 0) {
    await Card.insertMany([
      {
        user: demo._id,
        brand: 'بطاقة محلية (نمو / تداول / ادفع لي)',
        bankName: 'مصرف الجمهورية - ليبيا',
        holderName: 'TARIQ BEN ALI',
        last4: '4821',
        expiry: '09/28',
        token: 'tok_ly_demo_4821',
      },
      {
        user: demo._id,
        brand: 'Mastercard / Visa دولية',
        bankName: 'المصرف التجاري الوطني',
        holderName: 'TARIQ BEN ALI',
        last4: '9014',
        expiry: '11/27',
        token: 'tok_mc_demo_9014',
      },
    ]);
  }

  return { categories: catalog.length, demo: demo.email };
}

async function runStandalone() {
  require('dotenv').config();
  const { connectDb } = require('../config/db');
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI before running the seed');
  }
  await connectDb();
  const result = await seed();
  console.log('Seeded', result);
  process.exit(0);
}

if (require.main === module) {
  runStandalone().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seed };
