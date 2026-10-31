# فروع منيو الجوال (مكة / جدة)

## روابط الفروع

| الفرع | الرابط | ملف المنتجات والمعلومات |
| --- | --- | --- |
| فرع مكة | `mobile-menu/?branch=makkah` | `js/products-makkah.js` |
| فرع جدة | `mobile-menu/?branch=jeddah` | `js/products-jeddah.js` |

- الرابط بدون `?branch` يعرض صفحة **اختيار الفرع**.
- تعمل أيضاً `?branch=1` (مكة) و `?branch=2` (جدة)، وهي نفس أرقام الفروع في النظام الرئيسي (`js/branch.js`).
- اصنع باركود (QR) مستقلاً لكل فرع من رابطه الكامل، مثال:
  `https://<نطاق-الموقع>/mobile-menu/?branch=jeddah`

## تعديل بيانات فرع

كل ملف فرع فيه:

- `restaurantInfo` — معلومات الفرع: `phone`، `whatsapp`، `address`، `googleMapsUrl`، `workingHours`، `workingDays`، `notes`.
  أي حقل فارغ `''` لا يظهر في الصفحة.
- `menuCategories` — الأقسام والمنتجات والأسعار الخاصة بالفرع.

تظهر معلومات الفرع في الهيدر (اسم الفرع وزر «تغيير») وفي تبويب **الفرع** أسفل المنيو
(العنوان مع رابط الخريطة، أوقات الدوام، أيام العمل، زر الاتصال، واتساب، ملاحظة).

## إضافة فرع جديد

1. انسخ `js/products-makkah.js` باسم جديد، مثل `js/products-riyadh.js`، وعدّل بياناته.
2. أضف الفرع في `js/branches.js`:

```js
riyadh: {
  nameAr:   'فرع الرياض',
  nameEn:   'Riyadh',
  aliases:  ['3', 'الرياض'],
  products: 'js/products-riyadh.js',
},
```

## الاختبارات

```sh
python3 -m unittest discover -s tests -v
```
