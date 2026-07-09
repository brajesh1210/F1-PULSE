/* ═══════════════════════════════════════════════════════
   F1 PULSE — Scroll-Driven Frame Scrubbing Engine v3
   With: Navbar integration, section transitions
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Configuration ──
  const TOTAL_FRAMES = 180;
  const SCROLL_PER_FRAME = 2;
  const FRAME_PATH = (i) => `frames/frame_${String(i).padStart(4, '0')}.jpg`;
  const END_THRESHOLD = 0.90;

  // ── State ──
  const imageCache = new Array(TOTAL_FRAMES);
  let currentFrame = -1;
  let isLoaded = false;
  let isEndState = false;
  let heroScrollMax = 0;

  // ── DOM ──
  const frameDisplay   = document.getElementById('frame-display');
  const preloader      = document.getElementById('preloader');
  const progressFill   = document.getElementById('progress-fill');
  const progressText   = document.getElementById('progress-text');
  const scrollSpacer   = document.getElementById('scroll-spacer');
  const overlay        = document.getElementById('overlay');
  const vignette       = document.getElementById('vignette');
  const scrollProgFill = document.getElementById('scroll-progress-fill');
  const headline       = document.getElementById('overlay-headline');
  const subtext        = document.getElementById('overlay-subtext');
  const ctaButton      = document.getElementById('overlay-cta');
  const scrollHint     = document.getElementById('scroll-hint');
  const frameCounter   = document.getElementById('frame-counter');

  // ── Image Preloading ──
  function preloadImages() {
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        imageCache[i] = img;
        loaded++;
        const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
        progressFill.style.width = pct + '%';
        progressText.textContent = `Loading experience... ${pct}%`;
        if (loaded === TOTAL_FRAMES) onReady();
      };

      img.onerror = () => {
        imageCache[i] = null;
        loaded++;
        console.warn('Failed: frame', i + 1);
        if (loaded === TOTAL_FRAMES) onReady();
      };

      img.src = FRAME_PATH(i + 1);
    }
  }

  // ── All images loaded ──
  function onReady() {
    isLoaded = true;

    // Total hero scroll distance
    heroScrollMax = TOTAL_FRAMES * SCROLL_PER_FRAME;

    // Scroll spacer = hero scroll + one viewport (so frame fills during hero)
    scrollSpacer.style.height = (heroScrollMax + window.innerHeight) + 'px';

    // Show first frame
    showFrame(0);

    setTimeout(() => {
      preloader.classList.add('hidden');
      overlay.classList.add('visible');
      window.scrollTo(0, 0);

      // Start the render loop
      tick();
    }, 500);
  }

  // ── Show frame (instant swap) ──
  function showFrame(index) {
    if (index === currentFrame) return;
    if (!imageCache[index]) return;
    currentFrame = index;
    frameDisplay.src = imageCache[index].src;
  }

  // ── Continuous rAF loop ──
  function tick() {
    if (!isLoaded) {
      requestAnimationFrame(tick);
      return;
    }

    const scrollY = window.pageYOffset || window.scrollY || 0;

    // ── Frame scrubbing (only within hero scroll range) ──
    let frameIndex = Math.floor(scrollY / SCROLL_PER_FRAME);
    frameIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    showFrame(frameIndex);

    // ── Scroll progress bar ──
    const progress = Math.min(scrollY / heroScrollMax, 1);
    scrollProgFill.style.height = (progress * 100) + '%';

    // ── Frame counter ──
    frameCounter.textContent =
      String(frameIndex + 1).padStart(3, '0') + ' / ' + TOTAL_FRAMES;

    // ── Parallax on overlay text ──
    const pY = scrollY * 0.12;
    headline.style.transform = 'translateY(' + pY + 'px)';
    subtext.style.transform  = 'translateY(' + (pY * 0.6) + 'px)';

    // ── Scroll hint ──
    if (scrollY > 80) {
      scrollHint.style.opacity = '0';
    } else {
      scrollHint.style.opacity = '';
    }

    // ── End state ──
    if (progress >= END_THRESHOLD) {
      if (!isEndState) {
        isEndState = true;
        headline.textContent = "YOU'VE JUST FELT FORMULA 1";
        subtext.textContent  = 'Now explore the full experience';
        ctaButton.classList.add('visible');
      }
    } else {
      if (isEndState) {
        isEndState = false;
        headline.textContent = 'THE FASTEST SPORT ON EARTH';
        subtext.textContent  = 'Scroll to feel the speed';
        ctaButton.classList.remove('visible');
      }
    }

    // ── Hide hero elements once scrolled past hero ──
    if (scrollY > heroScrollMax + window.innerHeight * 0.5) {
      overlay.style.opacity = '0';
      vignette.style.opacity = '0';
      frameDisplay.style.opacity = '0';
    } else {
      overlay.style.opacity = '';
      vignette.style.opacity = '';
      frameDisplay.style.opacity = '1';
    }

    requestAnimationFrame(tick);
  }

  // ── Navbar Hamburger ──
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Scroll Reveal (IntersectionObserver) ──
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ── FAQ Accordion ──
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(fi => fi.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // ── Driver Tabs ──
  function initDriverTabs() {
    const tabs = document.querySelectorAll('.driver-tab');
    const gridCurrent = document.getElementById('driver-grid-current');
    const gridLegends = document.getElementById('driver-grid-legends');
    if (!tabs.length || !gridCurrent || !gridLegends) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');
        if (target === 'current') {
          gridCurrent.classList.remove('hidden');
          gridLegends.classList.add('hidden');
        } else {
          gridCurrent.classList.add('hidden');
          gridLegends.classList.remove('hidden');
        }

        // Re-trigger reveal for newly visible cards
        const newGrid = target === 'current' ? gridCurrent : gridLegends;
        newGrid.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
          el.classList.add('revealed');
        });
      });
    });
  }

  // ── Active Nav Link on Scroll ──
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinksAll.length) return;

    const observerNav = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-70px 0px -50% 0px'
    });

    sections.forEach(sec => observerNav.observe(sec));
  }

  // ── Init ──
  function init() {
    window.scrollTo(0, 0);
    preloadImages();

    // Initialize interactions after a brief delay to ensure DOM is ready
    setTimeout(() => {
      initScrollReveal();
      initFAQ();
      initDriverTabs();
      initActiveNav();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
