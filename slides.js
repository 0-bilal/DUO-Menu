/**
 * ملف بيانات السلايد شو
 * الصور التي ستظهر في الجزء الأيسر من الشاشة
 * (أطباق اليوم، العروض الخاصة، الإعلانات...)
 *
 * هيكل كل سلايد:
 * image        : مسار الصورة (ضع الصور في مجلد images/slides/)
 * titleAr      : العنوان بالعربية
 * titleEn      : العنوان بالإنجليزية (اختياري)
 * descriptionAr: الوصف / التفاصيل بالعربية
 * badge        : نص الشارة العلوية (مثلاً: "طبق اليوم" / "عرض خاص") — اتركه فارغاً لإخفائه
 * badgeColor   : لون الشارة — اختر: 'red' | 'gold' | 'green'
 * price        : السعر (اختياري — اتركه null لإخفائه)
 * duration     : مدة عرض هذا السلايد بالملي‌ثانية (افتراضي: 5000)
 */

const slides = [
  {
    image: 'images/slides/slide1.jpg',
    titleAr: 'طبق اليوم',
    titleEn: "Today's Special",
    descriptionAr: 'تكساس فرايز البطاطس المقلية الذهبية مع اللحم، والصوص والجبنة والهلبين',
    badge: 'جديد',
    badgeColor: 'gold',
    price: 19,
  },
  {
    image: 'images/slides/slide2.png',
    titleAr: 'دبل اوريقا برجر',
    titleEn: 'Special Offer',
    descriptionAr: 'استمتع ببرجر دبل مع صوص أوريقا',
    badge: 'مميز',
    badgeColor: 'red',
    price: 23,
    duration: 8000,
  },
 /** {
    image: 'images/slides/slide3.png',
    titleAr: 'إفطار رمضان',
    titleEn: 'Ramadan Iftar',
    descriptionAr: 'وجبة إفطار متكاملة تناسب العائلة',
    badge: 'رمضان كريم',
    badgeColor: 'gold',
    price: null,
    duration: 7000,
  },
  {
    image: 'images/slides/slide4.png',
    titleAr: 'حلويات طازجة يومياً',
    titleEn: 'Fresh Daily Desserts',
    descriptionAr: 'كنافة • أم علي • مهلبية وأكثر',
    badge: '',
    badgeColor: 'red',
    price: null,
    duration: 5000,
  },
  {
    image: 'images/slides/slide5.png',
    titleAr: 'مشروبات طازجة',
    titleEn: 'Fresh Beverages',
    descriptionAr: 'عصائر وموهيتو ومشروبات باردة متنوعة',
    badge: 'جديد',
    badgeColor: 'green',
    price: null,
    duration: 5000,
   }, */
 ];
