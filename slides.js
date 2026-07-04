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
    duration: 5000,
  },
 {
    image: 'images/slides/slide3.png',
    titleAr: 'أضلاع الذرة',
    titleEn: 'CORN RIBS',
    descriptionAr: ' أضاع الدرة الذهبية المقلية مع الصوص والبهارات',
    badge: ' مميزة',
    badgeColor: 'gold',
    price: null,
    duration: 5000,
  },
  {
    image: 'images/slides/slide4.png',
    titleAr: 'من تختار ؟',
    titleEn: 'Who do you choose?',
    descriptionAr: 'التحدي بين الطعمين',
    badge: '',
    badgeColor: 'red',
    price: null,
    duration: 10000,
  },
  {
    image: 'images/slides/slide5.png',
    titleAr: 'الخيار الذكي..',
    titleEn: 'The smart choice...',
    descriptionAr: '',
    badge: 'مميزة',
    badgeColor: 'green',
    price: 33,
    duration: 8000,
   },
 ];
