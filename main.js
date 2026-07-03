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

  // Redirect auto-scroll: clear current timer, jump highlight to first item of category
  clearTimeout(autoTimer);
  highlightItem(firstIdx);
  autoTimer = setTimeout(stepScroll, ITEM_DURATION);
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

      area.appendChild(card);
      allItemEls.push(card);
    });
  });

  // Total count
  setText('scroll-total', String(allItemEls.length));
}

/* ════════════════════════════════════════════════════════
   AUTO-SCROLL ENGINE
════════════════════════════════════════════════════════ */
let curIdx    = 0;
let autoTimer = null;

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

  area.scrollTo({ top: clamped, behavior: 'smooth' });
}

function stepScroll() {
  clearTimeout(autoTimer);

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
   INIT
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderRestaurantInfo();
  renderCategoryTabs();
  renderAllCategories();
  fixScrollablePadding();   // ensure every heading can reach the top of the area
  renderSlides();

  // Start auto-scroll after padding is applied (rAF inside fixScrollablePadding)
  setTimeout(startAutoScroll, 900);
});
