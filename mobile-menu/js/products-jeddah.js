/**
 * products-jeddah.js — منيو ومعلومات «فرع جدة» (نسخة الجوال)
 * ═══════════════════════════════════════════════════
 * رابط الفرع:  mobile-menu/?branch=jeddah
 * عدّل هذا الملف لتحديث معلومات الفرع ومنتجاته وأسعاره.
 * (فرع مكة له ملفه الخاص: js/products-makkah.js)
 *
 * ⚠ الأسعار مأخوذة من ملف الفرع الثاني في النظام الرئيسي (js/products-branch2.js).
 *   راجع العنوان ورقم الهاتف ورابط الخريطة أدناه وضع بيانات فرع جدة الحقيقية.
 */

const restaurantInfo = {
  nameAr:       'ديو برجر',
  nameEn:       'DUO Burger',
  taglineAr:    'نكهة لا تُنسى في كل قضمة',
  logo:         'images/logo.ico',
  /* ─── معلومات الفرع (تظهر في بطاقة «معلومات الفرع» أسفل المنيو) ─── */
  phone:        '0595056643',               // ← ضع رقم فرع جدة (فارغ '' = لا يظهر)
  whatsapp:     '966595056643',               // ← رقم واتساب دولي بدون + أو أصفار، مثال: '966593011999' (فارغ = لا يظهر)
  workingHours: 'م01:00 - ص03:00',
  workingDays:  'طوال أيام الأسبوع',

  /* ─────────────────────────────────────────────────────────
     روابط التواصل الاجتماعي
     ضع اسم الحساب فقط بدون @ وبدون رابط كامل
     مثال Instagram: إذا كان الرابط https://instagram.com/duo_brger1
                    اكتب فقط:  'duo_brger1'
     مثال TikTok:   إذا كان الرابط https://tiktok.com/@theduoburger
                    اكتب فقط:  'theduoburger'
  ───────────────────────────────────────────────────────── */
  instagram:    'duo_burger1',       // ← اسم حساب الإنستقرام (بدون @)
  tiktok:       'theduoburger',     // ← اسم حساب التيك توك  (بدون @)

  address:      'جدة',            // ← ضع الحي، مثال: 'جدة - حي الروضة'
  notes:        '',               // ← ملاحظة إضافية اختيارية، مثال: 'يوجد مواقف سيارات'
  taxNote:      'الأسعار شاملة ضريبة القيمة المضافة 15%',

  /* ─────────────────────────────────────────────────────────
     رابط الخريطة — انسخ الرابط الكامل من Google Maps
  ───────────────────────────────────────────────────────── */
  googleMapsUrl: 'https://maps.app.goo.gl/V6uw9xA1SYmpMJkPA?g_st=ac',   // ← ضع رابط موقع فرع جدة من Google Maps (فارغ = يُخفى زر «موقعنا»)
};

const menuCategories = [

  {
    id: 'main',
    nameAr: 'الأطباق الرئيسية',
    nameEn: 'Main Dishes',
    icon: 'fa-burger',
    items: [
      {
        nameAr:        'دبل ديو برجر',
        nameEn:        'Double DUO Burger',
        image:         'images/products/duo-burger.jpg',
        price:         23,
        mealPrice:     33,
        calories:      630,
        descriptionAr: 'برجر اسماش دبل 140 غرام من اللحم المشوي، مع صوص يعطي لذعة حموضة',
        ingredients: [
          { nameAr: 'خبز بريوش', removable: false },
          { nameAr: 'لحم سماش دبل 140غ', removable: false },
          { nameAr: 'جبنة شيدر', removable: false },
          { nameAr: 'مخلل', removable: true },
          { nameAr: 'صوص ديو', removable: false },
        ],
      },
      {
        nameAr:        'دبل اوريقا برجر',
        nameEn:        'Double Origa Burger',
        image:         'images/products/origa-burger.jpg',
        price:         23,
        mealPrice:     33,
        calories:      946,
        descriptionAr: 'برجر اسماش دبل 140 غرام من اللحم المشوي، مع صوص يعطي اللحمة بعضاً من الحلاوة',
        ingredients: [
          { nameAr: 'خبز بريوش', removable: false },
          { nameAr: 'لحم سماش دبل 140غ', removable: false },
          { nameAr: 'جبنة شيدر', removable: false },
          { nameAr: 'صوص اوريقا', removable: false },
        ],
      },
      {
        nameAr:        'دبل ترافل برجر',
        nameEn:        'Double Truffle Burger',
        image:         'images/products/truffle-burger.jpg',
        price:         28,
        mealPrice:     36,
        descriptionAr: 'برجر اسماش دبل 140 غرام لعشاق النكهات العميقة والفريدة، يقدّم مزيجاً لا يُقاوم من المكونات الفاخرة',
        ingredients: [
          { nameAr: 'خبز بريوش', removable: false },
          { nameAr: 'لحم سماش دبل 140غ', removable: false },
          { nameAr: 'جبنة شيدر', removable: false },
          { nameAr: 'صوص ترافل', removable: false },
        ],
      },
      {
        nameAr:        'إضافة شريحة لحم',
        nameEn:        'Add a Slice of Meat',
        image:         '',
        price:         6,
        calories:      120,
        descriptionAr: 'كملها بإضافة شريحة لحم على البرجر ليصبح تريبل أو كوارتر — تصل شريحة اللحم الواحدة 70 غم',
      },
    ],
  },

  {
    id: 'sides',
    nameAr: 'الأطباق الجانبية',
    nameEn: 'Side Dishes',
    icon: 'fa-bowl-food',
    items: [
      {
        nameAr:        'بطاطس عادية',
        nameEn:        'Regular Fries',
        image:         'images/products/fries.jpg',
        price:         7,
        descriptionAr: 'بطاطس مقلية ذهبية',
      },
      {
        nameAr:        'بطاطس مبهّرة',
        nameEn:        'Seasoned Potatoes',
        image:         'images/products/fries.jpg',
        price:         9,
        calories:      311,
        descriptionAr: 'بطاطس مقلية ذهبية ببهارات ديو',
      },
      {
        nameAr:        'أضلاع الذرة',
        nameEn:        'Corn Ribs',
        image:         'images/products/corn-ribs.jpg',
        price:         14,
        calories:      200,
        descriptionAr: '6 قطع من أضلاع الذرة الذهبية المقلية مع صوص الكريمة وبهارات ديو',
      },
      {
        nameAr:        'تكساس فرايز',
        nameEn:        'Spicy Wedges',
        image:         'images/products/spicy-wedges.jpg',
        price:         19,
        descriptionAr: 'بطاطس مقلية ذهبية مع صوص ديو أو أوريغا من اختيارك، واللحم وصوص الجبنة وقطع الهلابينو',
        sauceOptions:  ['صوص الديو', 'صوص أوريقا'],
      },
    ],
  },

  {
    id: 'drinks',
    nameAr: 'المشروبات',
    nameEn: 'Drinks',
    icon: 'fa-glass-water',
    items: [
      {
        nameAr:        'مشروبات غازية',
        nameEn:        'Soft Drink',
        image:         '',
        price:         5,
        variants:      ['كولا', 'كولا زيرو', 'سبرايت'],
      },
      {
        nameAr:        'مياه',
        nameEn:        'Water',
        image:         '',
        price:         1,
      },
    ],
  },

  {
    id: 'sauces',
    nameAr: 'الصوصات',
    nameEn: 'Sauces',
    icon: 'fa-bottle-droplet',
    items: [
      {
        nameAr:        'صوص ديو',
        nameEn:        'DUO Sauce',
        image:         'images/products/duo-sauce.jpg',
        price:         3,
        calories:      105,
        descriptionAr: 'صوص ديو بخليط سري في نكهة الليمون',
      },
      {
        nameAr:        'صوص اوريقا',
        nameEn:        'Origa Sauce',
        image:         'images/products/origa-sauce.jpg',
        price:         3,
        calories:      105,
        descriptionAr: 'صوص اوريقا في نكهة حلوة',
      },
      {
        nameAr:        'صوص ترافل',
        nameEn:        'Truffle Sauce',
        price:         4,
        descriptionAr: 'صوص ترافل لعشاق النكهات العميقة والفريدة',
      },
      {
        nameAr:        'صوص جبنة',
        nameEn:        'Cheese Sauce',
        price:         3,
      },
      {
        nameAr:        'قطع مخلل',
        nameEn:        'Pickled Pieces',
        price:         2,
      },
      {
        nameAr:        'قطع هلابينو',
        nameEn:        'Jalapeño Slices',
        price:         2,
      },
    ],
  },

];
