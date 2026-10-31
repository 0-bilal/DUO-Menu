"""Browser regressions. Run: python3 -m unittest discover -s tests -v
Requires Python Playwright and Chromium; starts its own local static server.
"""
import functools
import http.server
import os
from pathlib import Path
import threading
import unittest
from playwright.sync_api import sync_playwright


class MenuTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                    directory=str(Path(__file__).resolve().parents[1]))
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f'http://127.0.0.1:{cls.server.server_port}/'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
            args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def page(self, width=390, height=844, reduced_motion='no-preference', query='?branch=makkah',
             blocked=()):
        page = self.browser.new_page(viewport={'width': width, 'height': height},
                                     has_touch=True, reduced_motion=reduced_motion)
        self.addCleanup(page.close)
        # The external styles are optional; verify controls work even without them.
        page.route('https://**/*', lambda route: route.abort())
        for pattern in blocked:
            page.route(pattern, lambda route: route.abort())
        page.goto(self.url + query)
        page.wait_for_function("document.querySelector('.m-card, .m-picker')")
        return page

    def closed(self, page):
        page.wait_for_function("document.querySelector('#m-modal-overlay').inert")
        self.assertFalse(page.locator('#m-modal-overlay').is_visible())
        self.assertFalse(page.locator('#m-main').evaluate('e=>e.inert'))

    def touch(self, page, selector, kind, y):
        page.locator(selector).evaluate('''(el, args) => {
          const [kind,y] = args;
          const touch = new Touch({identifier:1,target:el,clientX:100,clientY:y});
          el.dispatchEvent(new TouchEvent(kind, {bubbles:true,cancelable:true,
            touches:kind==='touchend'||kind==='touchcancel'?[]:[touch],changedTouches:[touch]}));
        }''', [kind, y])

    def test_images_and_close_at_mobile_desktop_and_landscape(self):
        for width, height in [(320,568),(390,844),(844,390),(1280,900)]:
            with self.subTest(size=(width,height)):
                page = self.page(width,height)
                errors=[]
                page.on('pageerror', lambda error: errors.append(str(error)))
                self.assertEqual(page.locator('.m-card').count(),15)
                page.locator('.m-card').first.click()
                page.wait_for_timeout(400)
                image=page.locator('.m-modal-img')
                self.assertEqual(image.evaluate('e=>getComputedStyle(e).objectFit'),'contain')
                self.assertTrue(image.evaluate('e=>e.complete && e.naturalWidth>0'))
                self.assertGreater(page.locator('.m-modal-body').evaluate('e=>e.clientHeight'),60)
                self.assertTrue(page.locator('#m-modal-close svg').is_visible())
                self.assertEqual(page.locator('.m-modal-meal-price .m-modal-price-num').inner_text(),'33')
                page.locator('#m-modal-close').click()
                self.closed(page)
                self.assertTrue(page.locator('.m-card').first.evaluate('e=>e===document.activeElement'))
                self.assertEqual(errors,[])

    def test_swipe_close_reopen_and_cancel(self):
        page=self.page()
        for _ in range(3):
            page.locator('.m-card').first.click()
            page.wait_for_timeout(400)
            self.touch(page,'.m-modal-body','touchstart',200)
            self.touch(page,'.m-modal-body','touchmove',340)
            self.touch(page,'.m-modal-body','touchend',340)
            self.assertEqual(page.locator('#m-modal').evaluate('e=>e.style.transform'),'')
            self.touch(page,'.m-modal-handle','touchstart',200)
            self.touch(page,'.m-modal-handle','touchmove',240)
            self.touch(page,'.m-modal-handle','touchcancel',240)
            self.assertEqual(page.locator('#m-modal').evaluate('e=>e.style.transform'),'')
            self.touch(page,'.m-modal-handle','touchstart',200)
            self.touch(page,'.m-modal-handle','touchmove',350)
            self.touch(page,'.m-modal-handle','touchend',350)
            self.closed(page)
        page.locator('.m-card').nth(1).click()
        page.wait_for_timeout(400)
        self.assertEqual(page.locator('#m-modal').evaluate('e=>getComputedStyle(e).transform'),'matrix(1, 0, 0, 1, 0, 0)')

    def test_scroll_focus_keyboard_back_and_overlay(self):
        page=self.page()
        card=page.locator('.m-card').nth(6)
        card.scroll_into_view_if_needed()
        page.wait_for_timeout(400)
        y=page.evaluate('scrollY')
        card.focus()
        page.keyboard.press('Space')
        self.assertTrue(page.locator('#m-main').evaluate('e=>e.inert'))
        page.wait_for_timeout(400)
        page.keyboard.press('Shift+Tab')
        self.assertTrue(page.locator('.m-sauce-btn').last.evaluate('e=>e===document.activeElement'))
        page.keyboard.press('Tab')
        self.assertTrue(page.locator('#m-modal-close').evaluate('e=>e===document.activeElement'))
        page.keyboard.press('Escape')
        self.closed(page)
        self.assertAlmostEqual(page.evaluate('scrollY'),y,delta=1)
        card.click()
        page.go_back()
        self.closed(page)
        self.assertAlmostEqual(page.evaluate('scrollY'),y,delta=1)
        card.click()
        page.wait_for_timeout(400)
        page.locator('#m-modal-overlay').click(position={'x':5,'y':5})
        self.closed(page)
        self.assertAlmostEqual(page.evaluate('scrollY'),y,delta=1)

    def test_repeated_close_requests_do_not_leave_menu(self):
        page=self.page()
        page.locator('.m-card').first.click()
        page.evaluate("()=>{const b=document.querySelector('#m-modal-close');b.click();b.click();b.click();}")
        self.closed(page)
        self.assertEqual(page.url,self.url+'?branch=makkah')

    def test_desktop_category_at_page_bottom(self):
        page=self.page(1280,900)
        page.locator('[data-cat=drinks]').click()
        page.wait_for_timeout(1200)
        self.assertEqual(page.locator('.m-tab.active').get_attribute('data-cat'),'drinks')

    def test_reduced_motion_and_missing_image(self):
        page=self.page(reduced_motion='reduce',blocked=['**/images/products/duo-burger.jpg'])
        page.locator('.m-card').first.click()
        page.locator('.m-modal-img-ph').wait_for()
        self.assertEqual(page.locator('.m-modal-img-ph').inner_text(),'الصورة غير متاحة')
        self.assertEqual(page.locator('#m-modal').evaluate('e=>getComputedStyle(e).transitionDuration'),'0s')
        page.keyboard.press('Escape')
        self.closed(page)

    def test_each_branch_link_loads_its_own_menu_and_info(self):
        makkah=self.page()
        self.assertIn('فرع مكة',makkah.locator('#m-tag').inner_text())
        self.assertNotIn('تغيير',makkah.locator('.m-header').inner_text())
        self.assertEqual(makkah.locator('.m-header a').count(),0)
        self.assertEqual(makkah.locator('.m-card').count(),15)
        self.assertEqual(makkah.locator('.m-info-row.is-phone').get_attribute('href'),'tel:0593011999')
        self.assertTrue(makkah.locator('.m-info-row.is-map').get_attribute('href').startswith('https://maps.app.goo.gl/'))
        jeddah=self.page(query='?branch=jeddah')
        self.assertIn('فرع جدة',jeddah.locator('#m-tag').inner_text())
        self.assertIn('فرع جدة',jeddah.title())
        self.assertEqual(jeddah.locator('.m-card').count(),16)
        truffle=jeddah.locator('.m-card',has_text='دبل ترافل برجر')
        self.assertEqual(truffle.locator('.m-price-num').inner_text(),'28')
        # Info rows with no data are hidden rather than showing placeholders.
        self.assertEqual(jeddah.locator('.m-info-row.is-phone').count(),0)
        self.assertFalse(jeddah.locator('#m-map-btn').is_visible())
        # Numeric ids from the main system and Arabic names also work.
        self.assertIn('فرع جدة',self.page(query='?branch=2').locator('#m-tag').inner_text())
        self.assertIn('فرع مكة',self.page(query='?branch=%D9%85%D9%83%D8%A9').locator('#m-tag').inner_text())

    def test_picker_shown_without_or_with_unknown_branch(self):
        for query in ['', '?branch=riyadh']:
            with self.subTest(query=query):
                page=self.page(query=query)
                self.assertEqual(page.locator('.m-card').count(),0)
                self.assertFalse(page.locator('.m-tabs-wrap').is_visible())
                cards=page.locator('.m-picker-card')
                self.assertEqual(cards.count(),2)
                cards.filter(has_text='فرع جدة').click()
                page.wait_for_function("document.querySelectorAll('.m-card').length===16")
                self.assertTrue(page.url.endswith('?branch=jeddah'))

    def test_info_tab_scrolls_to_branch_info(self):
        page=self.page()
        page.locator('[data-cat=info]').click()
        page.wait_for_timeout(1200)
        self.assertTrue(page.locator('#sec-info').is_visible())
        self.assertEqual(page.locator('.m-tab.active').get_attribute('data-cat'),'info')
        self.assertEqual(page.locator('#sec-info a[href="./"]').count(),0)

    def test_share_links_have_branch_preview_and_open_branch_menu(self):
        for branch, name, cards in [('makkah','فرع مكة',15), ('jeddah','فرع جدة',16)]:
            with self.subTest(branch=branch):
                html=(Path(__file__).resolve().parents[1]/branch/'index.html').read_text(encoding='utf-8')
                # WhatsApp reads these tags from the raw HTML without running scripts.
                self.assertIn(f'<meta property="og:title"       content="منيو ديو برجر | {name}">',html)
                self.assertIn(f'og:url"         content="https://0-bilal.github.io/DUO-Menu/mobile-menu/{branch}/"',html)
                self.assertIn('og:image"       content="https://0-bilal.github.io/DUO-Menu/mobile-menu/images/products/duo-burger.jpg"',html)
                page=self.page(query=f'{branch}/')
                page.wait_for_function(f"document.querySelectorAll('.m-card').length==={cards}")
                self.assertTrue(page.url.endswith(f'/?branch={branch}'))
                self.assertIn(name,page.locator('#m-tag').inner_text())


if __name__ == '__main__':
    unittest.main()
