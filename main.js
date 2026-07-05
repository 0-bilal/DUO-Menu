/**
 * main.js — Burger House Digital Menu
 * - All categories rendered in ONE scrollable page
 * - Category tabs → scroll to section anchor
 * - Auto-scroll: item by item across ALL categories (loops)
 * - FAB: social always visible; phone & hours toggle on tap
 */

/* ── Config ── */
const ITEM_DURATION   = 3500;  // ms per highlight step
const HIGHLIGHT_DELAY = 80;    // ms to let CSS layout settle before centering
const PAUSE_DURATION  = 12000; // ms to pause auto-scroll after user interaction

/* ── Helpers ── */
const $ = id => document.getElementById(id);
const setText = (id, v) => { const e=$(id); if(e) e.textContent=v; };

/* ════════════════════════════════════════════════════════
   RESTAURANT INFO
════════════════════════════════════════════════════════ */
function renderRestaurantInfo() {
  setText('rest-name-ar', restaurantInfo.nameAr);
  setText('rest-name-en', restaurantInfo.nameEn);
  setText('rest-tagline',  restaurantInfo.taglineAr);

  // Logo
  const logoImg = $('logo-img'), logoEl = $('logo-placeholder');
  if (restaurantInfo.logo) {
    logoImg.src = restaurantInfo.logo;
    logoImg.onerror = () => { logoImg.style.display='none'; logoEl.style.display='flex'; };
    logoImg.style.display = 'block';
    logoEl.style.display  = 'none';
  }

  // Footer
  setText('tax-note-text', restaurantInfo.taxNote);
  const wifiSec = $('wifi-section');
  if (wifiSec) {
    if (restaurantInfo.wifi) { setText('wifi-name', restaurantInfo.wifi); wifiSec.style.display='flex'; }
    else wifiSec.style.display = 'none';
  }

  // FAB social
  setText('fab-ig-name',     restaurantInfo.instagram || '');
  setText('fab-tiktok-name', restaurantInfo.tiktok    || '');

  // FAB data (stored for toggle)
  $('fab-phone-value').dataset.val = restaurantInfo.phone        || '';
  $('fab-hours-value').dataset.val =
    `${restaurantInfo.workingDays}  •  ${restaurantInfo.workingHours}`;
}

/* ── FAB toggle ── */
const fabState = { phone: false, hours: false };

function fabToggle(key) {
  fabState[key] = !fabState[key];

  const valEl   = $(`fab-${key}-value`);
  const labelEl = $(`fab-${key}-label`);
  const chevEl  = $(`fab-${key}-chev`);
  const btn     = $(`fab-${key}-btn`);

  if (fabState[key]) {
    valEl.textContent = valEl.dataset.val;
    valEl.classList.add('visible');
    labelEl.style.display = 'none';
    chevEl  && (chevEl.style.transform = 'rotate(90deg)');
    btn     && btn.classList.add('open');
  } else {
    valEl.classList.remove('visible');
    labelEl.style.display = '';
    chevEl  && (chevEl.style.transform = '');
    btn     && btn.classList.remove('open');
  }
}
window.fabToggle = fabToggle; // expose for inline onclick

/* ════════════════════════════════════════════════════════
   CATEGORY TABS  →  scroll anchors
════════════════════════════════════════════════════════ */
function renderCategoryTabs() {
  const wrap = $('category-tabs');
  wrap.innerHTML = '';

  menuCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className  = 'cat-tab';
    btn.dataset.id = cat.id;
    btn.innerHTML  =
      `<i class="fa-solid ${cat.icon}"></i>
       <span class="cat-tab-label">${cat.nameAr}</span>`;
    btn.addEventListener('click', () => scrollToSection(cat.id));
    wrap.appendChild(btn);
  });
}

function scrollToSection(catId) {
  // Find the first item of this category in the flat list
  const firstIdx = allItemEls.findIndex(el => el.dataset.cat === catId);
  if (firstIdx === -1) return;

  // Treat tab click as user interaction → pause auto-scroll
  pauseAutoScroll();
  highlightItem(firstIdx);
}

function highlightActiveTab(catId) {
  document.querySelectorAll('.cat-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.id === catId)
  );
}

/* ════════════════════════════════════════════════════════
   RENDER ALL CATEGORIES  (single scrollable list)
════════════════════════════════════════════════════════ */
let allItemEls   = [];   // flat list of every item element
let sectionTops  = {};   // catId → offsetTop of heading

function renderAllCategories() {
  const area = $('menu-items-area');
  area.innerHTML = '';
  allItemEls = [];

  menuCategories.forEach(cat => {
    // Section heading  (also serves as anchor)
    const heading = document.createElement('div');
    heading.className = 'section-heading';
    heading.dataset.cat = cat.id;
    heading.innerHTML =
      `<i class="fa-solid ${cat.icon}"></i>
       <span class="section-heading-text">${cat.nameAr}</span>
       <div class="section-heading-line"></div>`;
    area.appendChild(heading);

    // Items
    cat.items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className   = 'menu-item';
      card.dataset.cat = cat.id;

      card.innerHTML = `
        <span class="item-num">0${i + 1}</span>
        <div class="item-img-wrap">
          ${item.image
            ? `<img src="${item.image}" alt="${item.nameAr}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="item-img-placeholder"${item.image ? ' style="display:none"' : ''}>
            <i class="fa-solid fa-burger"></i>
          </div>
        </div>
        <div class="item-info">
          <div class="item-name-ar">${item.nameAr}</div>
          <div class="item-name-en">${item.nameEn}</div>
          ${item.descriptionAr
            ? `<div class="item-desc">${item.descriptionAr}</div>` : ''}
          <div class="item-meta">
            ${item.calories
              ? `<span class="cal-badge">
                   <i class="fa-solid fa-fire-flame-curved"></i>&thinsp;${item.calories} سعرة
                 </span>` : ''}
          </div>
        </div>
        <div class="item-price-wrap">
          <div class="item-price-badge">
            <span class="item-price-num">${item.price}</span>
            <span class="item-price-cur">ريال</span>
          </div>
        </div>`;

      // ② عرض تفاصيل المنتج عند الضغط
      card.addEventListener('click', () => {
        const idx = allItemEls.indexOf(card);
        pauseAutoScroll();
        showProductOverlay(item, idx);
      });

      area.appendChild(card);
      allItemEls.push(card);
    });
  });

  // Total count
  setText('scroll-total', String(allItemEls.length));
}

/* ════════════════════════════════════════════════════════
   PAUSE / RESUME  (user interaction)
════════════════════════════════════════════════════════ */
let isPaused    = false;
let pauseTimer  = null;

function pauseAutoScroll() {
  // Reset countdown each time user interacts
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(resumeAutoScroll, PAUSE_DURATION);

  if (isPaused) return; // already paused, just reset timer above
  isPaused = true;
  clearTimeout(autoTimer);

  // Show paused indicator in status bar
  const indicator = document.querySelector('.scroll-item-indicator');
  if (indicator && !indicator.dataset.origHtml) {
    indicator.dataset.origHtml = indicator.innerHTML;
    indicator.innerHTML =
      `<i class="fa-solid fa-hand-pointer" style="color:var(--red)"></i>
       <span style="color:var(--white);font-weight:700">تصفح يدوي</span>`;
  }
  // Stop timer fill
  const fill = $('scroll-timer-fill');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
}

function resumeAutoScroll() {
  isPaused = false;
  clearTimeout(pauseTimer);

  // Restore indicator
  const indicator = document.querySelector('.scroll-item-indicator');
  if (indicator && indicator.dataset.origHtml) {
    indicator.innerHTML = indicator.dataset.origHtml;
    delete indicator.dataset.origHtml;
  }

  // Re-highlight current item and resume stepping
  highlightItem(curIdx);
  autoTimer = setTimeout(stepScroll, ITEM_DURATION);
}

/* ════════════════════════════════════════════════════════
   AUTO-SCROLL ENGINE
════════════════════════════════════════════════════════ */
let curIdx        = 0;
let autoTimer     = null;
let progScroll    = false; // true while centerItem is scrolling programmatically

function highlightItem(idx) {
  // Clamp & store
  idx = ((idx % allItemEls.length) + allItemEls.length) % allItemEls.length;
  curIdx = idx;

  // Remove old highlight
  allItemEls.forEach(el => el.classList.remove('highlighted'));

  const el = allItemEls[idx];
  if (!el) return;
  el.classList.add('highlighted');

  // ── Small delay so the browser registers the new class before we call
  //    getBoundingClientRect() inside centerItem (forces a layout reflow).
  setTimeout(() => centerItem(el), HIGHLIGHT_DELAY);

  // Status bar
  setText('scroll-cur', String(idx + 1));
  const catId = el.dataset.cat;
  const cat   = menuCategories.find(c => c.id === catId);
  if (cat) {
    setText('scroll-cat-label', cat.nameAr);
    highlightActiveTab(catId);
  }

  // Timer fill
  const fill = $('scroll-timer-fill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.style.transition = `width ${ITEM_DURATION}ms linear`;
      fill.style.width = '100%';
    }));
  }
}

/* ── Scroll config ── */
const SCROLL_TOP_OFFSET = 10;   // px gap above the category heading

/**
 * After rendering all items, add enough padding-bottom to the scroll area
 * so that even the LAST category heading can be scrolled to the very top.
 *
 * Without this, categories near the bottom of a long menu can never reach
 * scrollTop = headingAbsTop, because the content isn't tall enough.
 */
function fixScrollablePadding() {
  const area = $('menu-items-area');
  if (!area) return;

  const headings = area.querySelectorAll('.section-heading');
  if (!headings.length) return;

  // Reset to base padding first so measurements are clean
  area.style.paddingBottom = '16px';

  requestAnimationFrame(() => {
    const areaRect = area.getBoundingClientRect();

    // Find the heading that needs the largest scrollTop to reach the top
    let maxNeeded = 0;
    headings.forEach(h => {
      const hRect   = h.getBoundingClientRect();
      const absTop  = hRect.top - areaRect.top + area.scrollTop;
      const needed  = absTop - SCROLL_TOP_OFFSET;   // desired scrollTop for this heading
      if (needed > maxNeeded) maxNeeded = needed;
    });

    const currentMax = area.scrollHeight - area.clientHeight;
    if (maxNeeded > currentMax) {
      // Add the deficit as extra bottom padding
      const extra = Math.ceil(maxNeeded - currentMax) + 20;   // +20 safety buffer
      area.style.paddingBottom = `${extra + 16}px`;           // keep original 16px
    }
  });
}

/**
 * Scroll menu-items-area to the SECTION HEADING of the highlighted item's
 * category so the category name is always visible at the top.
 *
 * - Always anchors to the heading (not the item itself).
 * - Compares against the clamped target so same-category items don't
 *   trigger a redundant scroll call.
 * - Uses getBoundingClientRect() — always pixel-accurate.
 */
function centerItem(el) {
  const area = $('menu-items-area');
  if (!area || !el) return;

  const catId   = el.dataset.cat;
  const heading = area.querySelector(`.section-heading[data-cat="${catId}"]`);
  const anchor  = heading || el;

  const areaRect   = area.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();

  // Absolute top of the heading within the scroll content
  const absTop  = anchorRect.top - areaRect.top + area.scrollTop;
  const target  = Math.max(0, absTop - SCROLL_TOP_OFFSET);

  // Clamp to the real scrollable limit (after fixScrollablePadding this should
  // always be reachable, but guard just in case)
  const maxScroll = area.scrollHeight - area.clientHeight;
  const clamped   = Math.min(target, maxScroll);

  // Skip if we're already there (same-category transition — no movement needed)
  if (Math.abs(area.scrollTop - clamped) < 6) return;

  progScroll = true;
  area.scrollTo({ top: clamped, behavior: 'smooth' });
  // Reset flag after animation completes (~600ms)
  setTimeout(() => { progScroll = false; }, 700);
}

function stepScroll() {
  clearTimeout(autoTimer);
  if (isPaused) return; // user is browsing — don't advance

  const nextIdx  = (curIdx + 1) % allItemEls.length;
  const nextEl   = allItemEls[nextIdx];
  const curEl    = allItemEls[curIdx];

  // Detect category change — give extra pause so the transition is felt
  const catChanged = nextEl && curEl && nextEl.dataset.cat !== curEl.dataset.cat;
  const delay      = catChanged ? ITEM_DURATION + 800 : ITEM_DURATION;

  highlightItem(nextIdx);
  autoTimer = setTimeout(stepScroll, delay);
}

function startAutoScroll() {
  highlightItem(0);
  autoTimer = setTimeout(stepScroll, ITEM_DURATION);
}

/* ════════════════════════════════════════════════════════
   PRODUCT DETAIL OVERLAY
════════════════════════════════════════════════════════ */
let productOverlayTimer    = null;
let productOverlayItemIdx  = -1;
let overlayChanging        = false;
let _overlayHasImage       = false;   // هل الـ overlay يعرض صورة حالياً؟
let _imgCrossfadeTimer     = null;
const PRODUCT_OVERLAY_DURATION = 8000;
const OVERLAY_CHANGE_DURATION  = 260;   // ms — تلاشي النص قبل التبديل
const OVERLAY_CLOSE_DURATION   = 430;
const CROSSFADE_DURATION       = 520;   // ms — مدة التبديل بين الصورتين

/* ── Crossfade بين صورتين دون إظهار الخلفية ── */
function _crossfadeOverlayImage(newSrc) {
  const img1  = $('product-overlay-img');
  const img2  = $('product-overlay-img2');
  const imgPh = $('product-overlay-img-ph');

  if (!newSrc) {
    img1.style.display = 'none';
    img2.style.display = 'none';
    imgPh.style.display = 'flex';
    _overlayHasImage = false;
    return;
  }

  imgPh.style.display = 'none';

  if (!_overlayHasImage) {
    // فتح أول مرة — تعيين مباشر بدون crossfade
    img1.src           = newSrc;
    img1.style.display = 'block';
    img1.style.opacity = '1';
    img2.style.display = 'none';
    img2.style.opacity = '0';
    _overlayHasImage   = true;
    return;
  }

  // التبديل بين منتجين — crossfade: img2 تتلاشى فوق img1 ثم تصبح هي img1
  clearTimeout(_imgCrossfadeTimer);

  img2.src = newSrc;
  img2.style.display     = 'block';
  img2.style.transition  = 'none';
  img2.style.opacity     = '0';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    img2.style.transition = `opacity ${CROSSFADE_DURATION}ms ease`;
    img2.style.opacity    = '1';
  }));

  _imgCrossfadeTimer = setTimeout(() => {
    img1.src           = newSrc;
    img1.style.display = 'block';
    img1.style.opacity = '1';
    img2.style.transition = 'none';
    img2.style.opacity    = '0';
    setTimeout(() => { img2.style.display = 'none'; }, 50);
  }, CROSSFADE_DURATION + 30);
}

/* ── تعبئة بيانات المنتج (نصوص + صورة) ── */
function _fillOverlayContent(item, idx) {
  productOverlayItemIdx = idx;

  const priceWrap = $('product-overlay-price-wrap');
  const calEl     = $('product-overlay-cal');

  // النصوص
  $('product-overlay-name-ar').textContent = item.nameAr        || '';
  $('product-overlay-name-en').textContent = item.nameEn        || '';
  $('product-overlay-desc').textContent    = item.descriptionAr || '';
  $('product-overlay-desc').style.display  = item.descriptionAr ? 'block' : 'none';

  // السعرات
  if (item.calories) {
    $('product-overlay-cal-num').textContent = item.calories;
    calEl.style.display = 'inline-flex';
  } else {
    calEl.style.display = 'none';
  }

  // الصورة — crossfade سلس
  _crossfadeOverlayImage(item.image || '');

  // السعر
  if (item.price != null) {
    $('product-overlay-price-num').textContent = item.price;
    priceWrap.style.display = 'inline-flex';
  } else {
    priceWrap.style.display = 'none';
  }

  highlightItem(idx);
}

/* ── إظهار الـ overlay / التبديل بين المنتجات ── */
function showProductOverlay(item, idx) {
  const overlay = $('product-overlay');

  clearTimeout(productOverlayTimer);
  productOverlayTimer = setTimeout(hideProductOverlay, PRODUCT_OVERLAY_DURATION);

  if (overlay.classList.contains('active')) {
    /* الـ overlay مفتوح — تبديل سلس بين منتجين */
    if (overlayChanging) return;          // تجاهل النقر السريع جداً
    overlayChanging = true;
    overlay.classList.add('changing');

    setTimeout(() => {
      _fillOverlayContent(item, idx);
      overlay.classList.remove('changing');
      overlayChanging = false;
    }, OVERLAY_CHANGE_DURATION);

  } else {
    /* فتح أول مرة — ينبثق من الأسفل */
    _fillOverlayContent(item, idx);
    overlay.classList.remove('closing');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('active')));
  }
}

/* ── إغلاق الـ overlay والعودة للتلقائي ── */
function hideProductOverlay() {
  clearTimeout(productOverlayTimer);
  clearTimeout(_imgCrossfadeTimer);
  overlayChanging    = false;
  _overlayHasImage   = false;   // إعادة تعيين لفتح سلس في المرة القادمة

  // إلغاء تحديد المنتج
  if (productOverlayItemIdx >= 0) {
    allItemEls[productOverlayItemIdx]?.classList.remove('highlighted');
    productOverlayItemIdx = -1;
  }

  const overlay = $('product-overlay');
  overlay.classList.remove('active', 'changing');
  overlay.classList.add('closing');

  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.remove('closing');
    // العودة للتمرير التلقائي بعد اكتمال الانتقال
    resumeAutoScroll();
  }, OVERLAY_CLOSE_DURATION);
}
window.hideProductOverlay = hideProductOverlay;

/* ════════════════════════════════════════════════════════
   SLIDESHOW
════════════════════════════════════════════════════════ */
let curSlide  = 0;
let slideTimer = null;

function renderSlides() {
  const wrapper = $('slides-wrapper');
  const dotsEl  = $('slide-dots');
  wrapper.innerHTML = '';
  dotsEl.innerHTML  = '';

  slides.forEach((slide, i) => {
    const el = document.createElement('div');
    el.className = 'slide' + (i === 0 ? ' active' : '');
    el.innerHTML = `
      <img class="slide-img" src="${slide.image}" alt="${slide.titleAr}"
           onerror="this.style.background='#0a0001'">
      <div class="slide-content">
        ${slide.badge
          ? `<div class="slide-badge ${slide.badgeColor || 'red'}">
               <i class="fa-solid fa-star"></i>&nbsp;${slide.badge}
             </div>` : ''}
        <div class="slide-title-ar">${slide.titleAr}</div>
        ${slide.titleEn ? `<div class="slide-title-en">${slide.titleEn}</div>` : ''}
        ${slide.descriptionAr ? `<div class="slide-desc">${slide.descriptionAr}</div>` : ''}
        ${slide.price != null
          ? `<div class="slide-price-tag">
               ${slide.price}<span class="currency"> ريال</span>
             </div>` : ''}
      </div>`;
    wrapper.appendChild(el);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  });

  fillSlideProgress();
  scheduleSlide();
}

function goToSlide(idx) {
  document.querySelectorAll('.slide').forEach((s,i) => s.classList.toggle('active', i===idx));
  document.querySelectorAll('.dot').forEach((d,i)  => d.classList.toggle('active', i===idx));
  curSlide = idx;
  clearTimeout(slideTimer);
  fillSlideProgress();
  scheduleSlide();
}
function scheduleSlide() {
  const dur = slides[curSlide]?.duration || 5000;
  slideTimer = setTimeout(() => goToSlide((curSlide+1) % slides.length), dur);
}
function fillSlideProgress() {
  const fill = $('progress-fill');
  if (!fill) return;
  const dur = slides[curSlide]?.duration || 5000;
  fill.style.transition = 'none'; fill.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fill.style.transition = `width ${dur}ms linear`;
    fill.style.width = '100%';
  }));
}

/* ════════════════════════════════════════════════════════
   HIDDEN: الضغط 3× على اللوجو → مسح الكاش + تحديث إجباري
════════════════════════════════════════════════════════ */
function setupLogoSecretTap() {
  const logoWrap = $('logo-wrap');
  if (!logoWrap) return;

  let tapCount = 0;
  let tapTimer = null;
  let lastTouchEnd = 0;

  function onTap() {
    tapCount++;
    clearTimeout(tapTimer);
    _showUpdateToast(tapCount);

    if (tapCount >= 3) {
      tapCount = 0;
      _forceUpdateApp();
      return;
    }
    tapTimer = setTimeout(() => { tapCount = 0; _hideUpdateToast(); }, 2000);
  }

  // touchend — أسرع وأكثر موثوقية على شاشات اللمس
  logoWrap.addEventListener('touchend', e => {
    e.preventDefault();          // يمنع الـ click المزدوج بعده
    lastTouchEnd = Date.now();
    onTap();
  }, { passive: false });

  // click كبديل (ماوس / متصفح سطح مكتب)
  logoWrap.addEventListener('click', () => {
    if (Date.now() - lastTouchEnd < 400) return; // تجنب التكرار بعد touchend
    onTap();
  });
}

/* شريط تقدم صغير في أعلى الشاشة */
function _showUpdateToast(count) {
  let toast = $('update-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'update-toast';
    document.body.appendChild(toast);
    Object.assign(toast.style, {
      position: 'fixed', top: '18px', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(10,0,2,.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(190,30,45,.35)',
      color: '#fff', borderRadius: '100px',
      padding: '12px 32px', fontSize: '20px',
      fontFamily: "'Tajawal',sans-serif", fontWeight: '700',
      zIndex: '99999', pointerEvents: 'none',
      opacity: '0', transition: 'opacity .25s',
      whiteSpace: 'nowrap',
    });
  }

  clearTimeout(toast._hide);

  const dots = ['○ ○ ○', '◉ ○ ○', '◉ ◉ ○', '◉ ◉ ◉'][count] || '◉ ◉ ◉';

  if (count < 3) {
    toast.innerHTML =
      `<span style="color:var(--red,#be1e2d);letter-spacing:8px">${dots}</span>`;
    toast.style.opacity = '1';
    toast._hide = setTimeout(_hideUpdateToast, 1800);
  } else {
    toast.innerHTML =
      `<i class="fa-solid fa-arrows-rotate" style="color:#be1e2d;margin-left:10px"></i>` +
      `جاري تحديث التطبيق…`;
    toast.style.opacity = '1';
  }
}

function _hideUpdateToast() {
  const toast = $('update-toast');
  if (toast) toast.style.opacity = '0';
}

async function _forceUpdateApp() {
  try {
    // 1. مسح جميع الـ caches
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    // 2. إلغاء تسجيل الـ Service Worker (سيُعاد تسجيله بعد الريلود)
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
  } catch (e) {
    console.warn('[Update] Cache clear error:', e);
  }
  // 3. إعادة تحميل إجبارية بعد لحظة لتظهر رسالة التحديث
  setTimeout(() => window.location.reload(true), 900);
}

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderRestaurantInfo();
  renderCategoryTabs();
  renderAllCategories();
  fixScrollablePadding();   // ensure every heading can reach the top of the area
  renderSlides();

  // ── Detect user interaction on the menu area ──
  const menuArea = $('menu-items-area');
  if (menuArea) {
    // Touch: start of any touch gesture
    menuArea.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    // Touch: swiping / scrolling
    menuArea.addEventListener('touchmove',  pauseAutoScroll, { passive: true });
    // Mouse wheel / trackpad scroll
    menuArea.addEventListener('wheel',      pauseAutoScroll, { passive: true });
    // Programmatic or keyboard scroll — ignore if triggered by centerItem
    menuArea.addEventListener('scroll', () => {
      if (!progScroll) pauseAutoScroll();
    }, { passive: true });
  }

  // Also pause when tapping category tabs (handled inside scrollToSection)
  // But intercept touchstart on the tabs row too
  const tabsRow = $('category-tabs');
  if (tabsRow) {
    tabsRow.addEventListener('touchstart', pauseAutoScroll, { passive: true });
  }

  // ① Swipe يميناً/يساراً على لوحة الصور لتغيير الشريحة يدوياً
  const slidesWrapper = $('slides-wrapper');
  if (slidesWrapper) {
    let swipeStartX = 0;
    let swipeStartY = 0;

    slidesWrapper.addEventListener('touchstart', e => {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });

    slidesWrapper.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - swipeStartX;
      const dy = e.changedTouches[0].clientY - swipeStartY;
      // تجاهل إذا كانت الحركة رأسية أكثر من أفقية
      if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
      // الصفحة RTL: تمرير يساراً (dx < 0) = الشريحة التالية
      if (dx < 0) {
        goToSlide((curSlide + 1) % slides.length);
      } else {
        goToSlide((curSlide - 1 + slides.length) % slides.length);
      }
    }, { passive: true });
  }

  // Start auto-scroll after padding is applied (rAF inside fixScrollablePadding)
  setTimeout(startAutoScroll, 900);

  // سر اللوجو: 3 ضغطات → تحديث إجباري
  setupLogoSecretTap();
});
