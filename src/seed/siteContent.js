function defaultSiteContent() {
  return {
    key: 'site',
    fontScale: 1,
    spacingScale: 1,
    imageScale: 1,
    sections: [
      { id: 'brand', visible: true },
      { id: 'hero', visible: true },
      { id: 'shortcuts', visible: true },
      { id: 'sectors', visible: true },
      { id: 'materials', visible: true },
      { id: 'b2b', visible: true },
      { id: 'sectorList', visible: true },
      { id: 'contact', visible: true },
    ],
    brand: {
      name: 'ركن التعقيم',
      subtitle: 'للخدمات العامة والتنظيف المتكامل • طرابلس',
      mark: '✓',
    },
    hero: {
      badge: 'شركة مسجلة ومرخصة رسمياً في طرابلس - ليبيا',
      titleBefore: 'منظومة ',
      titleAccent: 'ركن التعقيم',
      titleAfter: ' الشاملة للنظافة، الضيافة، والتعقيم الصحي',
      intro: 'من المنازل والفلل إلى الشركات، المصانع، الحدائق العامة، خدمات السفرجة والضيافة، مكافحة القوارض، وإزالة مخلفات البناء. صمّم باقتك بالساعة أو العقود الدورية، مع حرية اختيار مواد التنظيف أو إرسال طلب مخصص.',
      searchPlaceholder: 'ابحث عن أي خدمة (سجاد، سفرجة، قوارض، مخلفات بناء، واجهات، جلي رخام)...',
      searchButton: 'بحث في الخدمات',
      chips: [
        '8 قطاعات رئيسية متكاملة',
        'تسعير فوري بالساعة أو شهري (د.ل)',
      ],
      accountChip: 'أنشئ حسابك لحفظ طلبياتك وبطاقاتك البنكية',
    },
    shortcuts: {
      cartLabel: 'السلة',
      loginLabel: 'تسجيل الدخول',
    },
    sectorsHeading: 'القطاعات الرئيسية',
    materials: {
      heading: 'نظام مواد التنظيف والمستلزمات',
      intro: 'داخل كل خدمة يمكنك الاختيار بين ثلاثة مسارات للتوريد والتسعير.',
      popularBadge: 'الأكثر طلباً',
      cards: [
        {
          title: '1. توفير المواد من طرف العميل',
          body: 'تُحتسب التكلفة على أجور العمالة الفنية والمعدات الأساسية فقط، وتستخدم الطواقم المنظفات المتوفرة في الموقع.',
          popular: false,
        },
        {
          title: '2. شراء باقة زيارة أو زيارتين',
          body: 'باقة تكفي زيارة واحدة أو زيارتين بخصم 10%، مع الباقة الأساسية أو زيادة كمية أي مادة.',
          popular: true,
        },
        {
          title: '3. مواد خاصة غير مسعرة',
          body: 'أضف اسم المادة وكميتها بدون سعر. إدارة المبيعات تسعّرها وترد قبل اعتماد الطلبية.',
          popular: false,
        },
      ],
    },
    b2bCard: {
      badge: 'قطاع الأعمال والجهات العامة (B2B / B2G)',
      title: 'بوابة العقود الكبرى، توفير العمالة، والائتلافات',
      body: 'عقود عمالة مقيمة، ائتلافات المشاريع، توريد منظفات بالجملة، وزيارة معاينة مجانية مع عرض فني ومالي.',
      button: 'إرسال طلب العقود والشراكات',
    },
    sectorList: {
      title: 'القطاعات الثمانية',
    },
    contact: {
      title: 'بيانات التواصل',
      address: 'المقر الرئيسي: طرابلس - ليبيا',
      phone: '+218 91 000 0000',
      email: 'info@rukn-altaqeem.ly',
      about: 'شركة ليبية متخصصة ومسجلة في طرابلس للنظافة العامة، السفرجة والضيافة، مكافحة القوارض، تنسيق الحدائق، إزالة مخلفات البناء، وتنظيف الواجهات والشوارع.',
    },
    footer: '© 2026 شركة ركن التعقيم للخدمات العامة والتنظيف المتكامل (طرابلس - ليبيا). جميع الحقوق محفوظة.',
    b2bPage: {
      title: 'بوابة العقود الكبرى، توفير العمالة، والائتلافات',
      intro: 'طبقاً للمادة (3) من عقد التأسيس، نوفر حلولاً للشركات والمصارف والمستشفيات والبلديات. مدير المشاريع يتواصل خلال 24 ساعة.',
      bullets: [
        'عقود تشغيل وتوفير عمالة نظافة وسفرجة مقيمة بزي موحد وإشراف كامل.',
        'المقاولات من الباطن والائتلافات لتنظيف المشاريع الكبرى والشوارع والميادين.',
        'عقود توريد شهرية بالجملة لمواد التعقيم والمنظفات والمستهلكات الورقية.',
        'زيارة معاينة ميدانية مجانية وتقديم عرض فني ومالي معتمد.',
      ],
      office: 'الإدارة الرئيسية: طرابلس - ليبيا، مع إمكانية فتح مكاتب موقعية للمشاريع الكبرى.',
    },
    tabs: {
      home: 'الرئيسية',
      cart: 'السلة',
      account: 'حسابي',
    },
  };
}

const SECTION_IDS = ['brand', 'hero', 'shortcuts', 'sectors', 'materials', 'b2b', 'sectorList', 'contact'];

function clampScale(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(2, Math.max(0.6, Math.round(number * 100) / 100));
}

function text(value, fallback) {
  if (typeof value !== 'string') return fallback;
  return value;
}

function sanitizeSiteContent(body = {}) {
  const base = defaultSiteContent();
  const incoming = body && typeof body === 'object' ? body : {};
  const sectionsIn = Array.isArray(incoming.sections) ? incoming.sections : [];
  const seen = new Set();
  const sections = [];
  sectionsIn.forEach((section) => {
    const id = section && SECTION_IDS.includes(section.id) ? section.id : null;
    if (!id || seen.has(id)) return;
    seen.add(id);
    sections.push({ id, visible: section.visible !== false });
  });
  SECTION_IDS.forEach((id) => {
    if (!seen.has(id)) sections.push({ id, visible: true });
  });

  const hero = incoming.hero || {};
  const chips = Array.isArray(hero.chips) ? hero.chips.map((chip) => String(chip)) : base.hero.chips;
  const materials = incoming.materials || {};
  const cards = Array.isArray(materials.cards)
    ? materials.cards.map((card) => ({
      title: text(card && card.title, ''),
      body: text(card && card.body, ''),
      popular: Boolean(card && card.popular),
    })).filter((card) => card.title || card.body)
    : base.materials.cards;
  const b2bPage = incoming.b2bPage || {};
  const bullets = Array.isArray(b2bPage.bullets)
    ? b2bPage.bullets.map((line) => String(line)).filter((line) => line.trim())
    : base.b2bPage.bullets;

  return {
    key: 'site',
    fontScale: clampScale(incoming.fontScale, base.fontScale),
    spacingScale: clampScale(incoming.spacingScale, base.spacingScale),
    imageScale: clampScale(incoming.imageScale, base.imageScale),
    sections,
    brand: {
      name: text(incoming.brand && incoming.brand.name, base.brand.name),
      subtitle: text(incoming.brand && incoming.brand.subtitle, base.brand.subtitle),
      mark: text(incoming.brand && incoming.brand.mark, base.brand.mark),
    },
    hero: {
      badge: text(hero.badge, base.hero.badge),
      titleBefore: text(hero.titleBefore, base.hero.titleBefore),
      titleAccent: text(hero.titleAccent, base.hero.titleAccent),
      titleAfter: text(hero.titleAfter, base.hero.titleAfter),
      intro: text(hero.intro, base.hero.intro),
      searchPlaceholder: text(hero.searchPlaceholder, base.hero.searchPlaceholder),
      searchButton: text(hero.searchButton, base.hero.searchButton),
      chips,
      accountChip: text(hero.accountChip, base.hero.accountChip),
    },
    shortcuts: {
      cartLabel: text(incoming.shortcuts && incoming.shortcuts.cartLabel, base.shortcuts.cartLabel),
      loginLabel: text(incoming.shortcuts && incoming.shortcuts.loginLabel, base.shortcuts.loginLabel),
    },
    sectorsHeading: text(incoming.sectorsHeading, base.sectorsHeading),
    materials: {
      heading: text(materials.heading, base.materials.heading),
      intro: text(materials.intro, base.materials.intro),
      popularBadge: text(materials.popularBadge, base.materials.popularBadge),
      cards: cards.length ? cards : base.materials.cards,
    },
    b2bCard: {
      badge: text(incoming.b2bCard && incoming.b2bCard.badge, base.b2bCard.badge),
      title: text(incoming.b2bCard && incoming.b2bCard.title, base.b2bCard.title),
      body: text(incoming.b2bCard && incoming.b2bCard.body, base.b2bCard.body),
      button: text(incoming.b2bCard && incoming.b2bCard.button, base.b2bCard.button),
    },
    sectorList: {
      title: text(incoming.sectorList && incoming.sectorList.title, base.sectorList.title),
    },
    contact: {
      title: text(incoming.contact && incoming.contact.title, base.contact.title),
      address: text(incoming.contact && incoming.contact.address, base.contact.address),
      phone: text(incoming.contact && incoming.contact.phone, base.contact.phone),
      email: text(incoming.contact && incoming.contact.email, base.contact.email),
      about: text(incoming.contact && incoming.contact.about, base.contact.about),
    },
    footer: text(incoming.footer, base.footer),
    b2bPage: {
      title: text(b2bPage.title, base.b2bPage.title),
      intro: text(b2bPage.intro, base.b2bPage.intro),
      bullets: bullets.length ? bullets : base.b2bPage.bullets,
      office: text(b2bPage.office, base.b2bPage.office),
    },
    tabs: {
      home: text(incoming.tabs && incoming.tabs.home, base.tabs.home),
      cart: text(incoming.tabs && incoming.tabs.cart, base.tabs.cart),
      account: text(incoming.tabs && incoming.tabs.account, base.tabs.account),
    },
  };
}

module.exports = { defaultSiteContent, sanitizeSiteContent, SECTION_IDS };
