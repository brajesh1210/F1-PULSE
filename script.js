/* ═══════════════════════════════════════════════════════
   F1 PULSE — Scroll-Driven Frame Scrubbing Engine v3
   With: Navbar integration, section transitions
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Configuration ──
  const TOTAL_FRAMES = 485;
  const SCROLL_PER_FRAME = 2;
  const FRAME_PATH = (i) => `frames/WhatsApp Video 2026-07-16 at 20.43.56-${String(i).padStart(4, '0')}.webp`;
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

  // ── Custom Cursor ──
  function initCursor() {
    const cursorOuter = document.getElementById('cursor-outer');
    const cursorInner = document.getElementById('cursor-inner');
    if (!cursorOuter || !cursorInner) return;

    window.addEventListener('mousemove', (e) => {
      cursorOuter.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      cursorInner.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    const hoverElements = document.querySelectorAll('a, button, .marquee-card, .race-card, .driver-card, .gallery-item, .faq-question');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOuter.classList.add('hover');
        cursorInner.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorOuter.classList.remove('hover');
        cursorInner.classList.remove('hover');
      });
    });
  }

  // ── WebGL Aether Background ──
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define R resolution
#define T time
#define FC gl_FragCoord.xy

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float line(vec2 uv, float y, float thickness, float speed, float offset) {
  float wave = sin((uv.x * 8.0) + T * speed + offset) * 0.035;
  float d = abs(uv.y - y - wave);
  return smoothstep(thickness, 0.0, d);
}
void main() {
  vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
  vec2 p = uv;
  float t = T * 0.65;
  vec3 bg = vec3(0.015, 0.012, 0.012);
  float r = length(p);
  float angle = atan(p.y, p.x);
  float tunnel = 0.03 / max(abs(sin(angle * 10.0 + t * 2.0)) * r, 0.015);
  tunnel *= smoothstep(1.2, 0.05, r);
  vec3 col = bg;
  col += vec3(0.8, 0.02, 0.0) * tunnel * 0.35;
  float redLines = line(p, -0.30, 0.008, 3.0, 0.0) + line(p, 0.18, 0.006, 2.4, 1.5) + line(p, 0.42, 0.004, 3.8, 2.7);
  float blueLines = line(p, -0.12, 0.006, 3.5, 2.0) + line(p, 0.31, 0.005, 2.8, 4.0);
  col += vec3(1.0, 0.02, 0.0) * redLines * 0.75;
  col += vec3(0.0, 0.65, 1.0) * blueLines * 0.55;
  vec2 grid = vec2(floor((p.x + t * 1.8) * 22.0), floor(p.y * 16.0));
  float rnd = hash(grid);
  float spark = step(0.965, rnd);
  float sparkShape = smoothstep(0.025, 0.0, abs(fract((p.x + t * (1.0 + rnd)) * 22.0) - 0.5));
  sparkShape *= smoothstep(0.03, 0.0, abs(fract(p.y * 16.0) - 0.5));
  col += vec3(1.0, 0.28, 0.02) * spark * sparkShape * 0.55;
  float centerGlow = smoothstep(0.75, 0.0, r);
  col += vec3(0.12, 0.0, 0.0) * centerGlow;
  col += vec3(0.0, 0.05, 0.09) * centerGlow;
  float vignette = smoothstep(1.05, 0.25, r);
  col *= vignette;
  col = pow(col, vec3(0.85));
  O = vec4(col, 1.0);
}`;

    const vertShaderSource = `#version 300 es
in vec4 position;
void main() { gl_Position = position; }`;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resLoc = gl.getUniformLocation(program, 'resolution');

    let startTime = performance.now();

    function render(now) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform1f(timeLoc, (now - startTime) / 1000);
      gl.uniform2f(resLoc, width, height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    render(startTime);
  }

  // ── Parallax for Thrill Images ──
  function initParallax() {
    const images = document.querySelectorAll('.thrill-image');
    if (!images.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      images.forEach((img, i) => {
        const rect = img.parentElement.getBoundingClientRect();
        // Calculate offset based on element position relative to viewport center
        const offset = (rect.top - window.innerHeight / 2) * 0.15;
        // Clamp offset to prevent breaking the container bounds
        const clampedOffset = Math.max(-15, Math.min(15, offset));
        img.style.transform = `translateY(${clampedOffset}%)`;
      });
    }, { passive: true });
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
      initCursor();
      initParticles();
      initParallax();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
