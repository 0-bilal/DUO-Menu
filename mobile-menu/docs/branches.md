# فروع منيو الجوال (مكة / جدة)

## روابط الفروع

**روابط المشاركة (واتساب / الباركود)** — تظهر معها معاينة باسم الفرع ووصفه وصورة:

| الفرع | رابط المشاركة | ملف المنتجات والمعلومات |
| --- | --- | --- |
| فرع مكة | `https://0-bilal.github.io/DUO-Menu/mobile-menu/makkah/` | `js/products-makkah.js` |
| فرع جدة | `https://0-bilal.github.io/DUO-Menu/mobile-menu/jeddah/` | `js/products-jeddah.js` |

رابط المشاركة ينقل الزائر مباشرة إلى `mobile-menu/?branch=makkah` أو `?branch=jeddah`.

### معاينة الرابط في واتساب

واتساب لا يشغّل JavaScript؛ يقرأ وسوم `og:` من ملف HTML فقط. لذلك لكل فرع صفحة صغيرة
(`makkah/index.html` و `jeddah/index.html`) فيها عنوان ووصف وصورة المعاينة الخاصة به.
- لتغيير نص رسالة واتساب: عدّل `title` و `og:title` و `og:description` في صفحة الفرع.
- إذا غيّرت العنوان أو أوقات الدوام في ملف المنتجات، حدّث الوصف هنا أيضاً.
- الصورة: `og:image` (رابط كامل، ويفضل أقل من 300KB).
- واتساب يحفظ المعاينة مؤقتاً؛ قد يظهر التعديل لرابط سبق إرساله بعد فترة.
- إذا تغيّر نطاق الموقع، غيّر الروابط الكاملة في `og:url` و `og:image`.

- الرابط بدون `?branch` يعرض صفحة **اختيار الفرع**.
- تعمل أيضاً `?branch=1` (مكة) و `?branch=2` (جدة)، وهي نفس أرقام الفروع في النظام الرئيسي (`js/branch.js`).
- اصنع باركود (QR) مستقلاً لكل فرع من رابطه الكامل، مثال:
  `https://<نطاق-الموقع>/mobile-menu/?branch=jeddah`

## تعديل بيانات فرع

كل ملف فرع فيه:

- `restaurantInfo` — معلومات الفرع: `phone`، `whatsapp`، `address`، `googleMapsUrl`، `workingHours`، `workingDays`، `notes`.
  أي حقل فارغ `''` لا يظهر في الصفحة.
- `menuCategories` — الأقسام والمنتجات والأسعار الخاصة بالفرع.

تظهر معلومات الفرع في الهيدر (اسم الفرع) وفي تبويب **الفرع** أسفل المنيو
(العنوان مع رابط الخريطة، أوقات الدوام، أيام العمل، زر الاتصال، واتساب، ملاحظة).

## إضافة فرع جديد

1. انسخ `js/products-makkah.js` باسم جديد، مثل `js/products-riyadh.js`، وعدّل بياناته.
2. انسخ مجلد `makkah/` باسم `riyadh/`، وغيّر فيه اسم الفرع والوصف و `makkah` إلى `riyadh`.
3. أضف الفرع في `js/branches.js`:

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
