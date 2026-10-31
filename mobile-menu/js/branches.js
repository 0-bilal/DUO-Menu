/**
 * branches.js — فروع ديو برجر (منيو الجوال)
 * ═══════════════════════════════════════════════════
 * كل فرع له رابط خاص وملف منتجات خاص:
 *
 *   mobile-menu/?branch=makkah   ← فرع مكة   (js/products-makkah.js)
 *   mobile-menu/?branch=jeddah   ← فرع جدة   (js/products-jeddah.js)
 *
 * بدون ?branch تظهر صفحة لاختيار الفرع.
 * تعمل أيضاً الأرقام 1 و 2 (نفس أرقام الفروع في النظام الرئيسي js/branch.js).
 *
 * المعلومات الخاصة بكل فرع (الهاتف، الموقع، الدوام…) موجودة داخل
 * restaurantInfo في ملف منتجات الفرع نفسه.
 *
 * لإضافة فرع جديد: انسخ ملف منتجات أحد الفروع باسم جديد، ثم أضف سطراً هنا.
 */
window.DUO_BRANCHES = {
  makkah: {
    nameAr:   'فرع مكة',
    nameEn:   'Makkah',
    cityAr:   'مكة المكرمة',
    aliases:  ['1', 'mecca', 'makka', 'مكة', 'مكه'],
    products: 'js/products-makkah.js',
  },
  jeddah: {
    nameAr:   'فرع جدة',
    nameEn:   'Jeddah',
    cityAr:   'جدة',
    aliases:  ['2', 'jedda', 'jiddah', 'جدة', 'جده'],
    products: 'js/products-jeddah.js',
  },
};

/* يحدد الفرع من الرابط — يعيد null إذا لم يُحدَّد فرع صحيح */
window.DUO_resolveBranch = function (search) {
  let raw = '';
  try { raw = new URLSearchParams(search).get('branch') || ''; } catch (e) {}
  raw = raw.trim().toLowerCase();
  if (!raw) return null;
  const all = window.DUO_BRANCHES;
  for (const id of Object.keys(all)) {
    if (id === raw || (all[id].aliases || []).includes(raw)) return id;
  }
  return null;
};
