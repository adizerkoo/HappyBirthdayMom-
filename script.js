/* ============================================
   МАМОЧКЕ 55 — SCRIPT
   ============================================ */
(function () {
  'use strict';

  /* ---------- PRELOADER ---------- */
  function hidePreloader() {
    setTimeout(() => {
      document.querySelector('.preloader')?.classList.add('hide');
    }, 1200);
  }
  window.addEventListener('load', hidePreloader);
  // Fallback: hide preloader after 4s even if some images fail to load
  setTimeout(hidePreloader, 4000);

  /* ---------- PARTICLES CANVAS ---------- */
  const pCanvas = document.getElementById('particles');
  if (pCanvas) {
    const ctx = pCanvas.getContext('2d');
    let particles = [];
    function resizeParticles() { pCanvas.width = innerWidth; pCanvas.height = innerHeight; }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.12 + 0.04
      });
    }
    (function drawParticles() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,149,108,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > pCanvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > pCanvas.height) p.dy *= -1;
      }
      requestAnimationFrame(drawParticles);
    })();
  }

  /* ---------- SCROLL FX CANVAS (hearts, sparkles) ---------- */
  const fxCanvas = document.getElementById('scrollFx');
  const fxCtx = fxCanvas ? fxCanvas.getContext('2d') : null;
  let fxParticles = [];
  function resizeFx() { if (fxCanvas) { fxCanvas.width = innerWidth; fxCanvas.height = innerHeight; } }
  resizeFx();
  window.addEventListener('resize', resizeFx);

  function spawnFxParticle(type) {
    const x = Math.random() * innerWidth;
    const y = innerHeight * 0.5 + (Math.random() - 0.5) * innerHeight * 0.6;
    const emojis = type === 'heart' ? ['❤️', '💕', '💗', '💖', '🌸'] : ['✨', '⭐', '🌟', '💫'];
    fxParticles.push({
      x, y,
      vx: (Math.random() - 0.5) * 2,
      vy: -1.5 - Math.random() * 2,
      life: 1,
      decay: 0.008 + Math.random() * 0.008,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 14 + Math.random() * 14,
      rot: (Math.random() - 0.5) * 0.1
    });
  }

  function drawFx() {
    if (!fxCtx) return;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= p.decay;
      if (p.life <= 0) { fxParticles.splice(i, 1); continue; }
      fxCtx.save();
      fxCtx.globalAlpha = p.life;
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.font = `${p.size}px sans-serif`;
      fxCtx.textAlign = 'center';
      fxCtx.textBaseline = 'middle';
      fxCtx.fillText(p.emoji, 0, 0);
      fxCtx.restore();
    }
    requestAnimationFrame(drawFx);
  }
  drawFx();

  /* ---------- SCROLL EFFECTS: triggers ---------- */
  let lastScroll = 0;
  let scrollAccum = 0;
  const scrollWords = ['Любовь', 'Нежность', 'Семья', 'Счастье', 'Мамочка', 'Тепло', 'Радость', 'Забота', 'Улыбка', 'Красота', 'Доброта', 'Уютность'];
  let wordIndex = 0;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScroll);
    lastScroll = window.scrollY;
    scrollAccum += delta;
    if (scrollAccum > 300) {
      scrollAccum = 0;
      // Spawn hearts / sparkles
      const type = Math.random() < 0.6 ? 'heart' : 'sparkle';
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) setTimeout(() => spawnFxParticle(type), i * 60);
      // Occasionally spawn a floating word
      if (Math.random() < 0.35) {
        spawnScrollWord(scrollWords[wordIndex % scrollWords.length]);
        wordIndex++;
      }
    }
  }, { passive: true });

  function spawnScrollWord(text) {
    const el = document.createElement('div');
    el.className = 'scroll-word';
    el.textContent = text;
    el.style.left = (10 + Math.random() * 80) + 'vw';
    el.style.top = (20 + Math.random() * 60) + 'vh';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealClasses = [
    'reveal', 'reveal-flip', 'reveal-slide-up', 'reveal-zoom',
    'reveal-rotate', 'reveal-blur', 'reveal-scale', 'reveal-left', 'reveal-right'
  ];
  const allSelector = revealClasses.map(c => '.' + c).join(',') + ',.mosaic-reveal';

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Heart burst at section headers
        if (e.target.classList.contains('section-heading')) {
          const r = e.target.getBoundingClientRect();
          spawnBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function initReveals() {
    document.querySelectorAll(allSelector).forEach(el => revealObs.observe(el));
  }
  initReveals();

  function spawnBurst(cx, cy) {
    const symbols = ['❤️', '💖', '✨', '🌸', '💕', '🌟'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('div');
      el.className = 'scroll-burst';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = (cx + (Math.random() - 0.5) * 100) + 'px';
      el.style.top = (cy + (Math.random() - 0.5) * 60) + 'px';
      document.body.appendChild(el);
      el.style.animationDelay = (i * 80) + 'ms';
      setTimeout(() => el.remove(), 2000);
    }
  }

  /* ---------- CAROUSEL ---------- */
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const counter = carousel.querySelector('.carousel-counter');
    const progressBar = carousel.querySelector('.carousel-progress');
    const captionEl = carousel.querySelector('.carousel-caption');
    const fxBadge = carousel.querySelector('.carousel-fx-badge');
    const captions = JSON.parse(carousel.dataset.captions || '[]');

    const fxPool = [
      { in: 'fx-fade-in', out: 'fx-fade-out', label: '✦ Fade' },
      { in: 'fx-zoom-in', out: 'fx-zoom-out', label: '✦ Zoom' },
      { in: 'fx-flip-in', out: 'fx-flip-out', label: '✦ Flip' },
      { in: 'fx-slide-in', out: 'fx-slide-out', label: '✦ Slide' },
      { in: 'fx-blur-in', out: 'fx-blur-out', label: '✦ Blur' }
    ];

    let cur = 0;
    let timer;
    let fxIdx = 0;
    const total = slides.length;

    function clearAllFx(slide) {
      fxPool.forEach(fx => { slide.classList.remove(fx.in, fx.out); });
      slide.classList.remove('active');
    }

    function goSlide(n) {
      if (n === cur) return;
      const fx = fxPool[fxIdx % fxPool.length];
      fxIdx++;

      // Flash effect
      const flash = document.createElement('div');
      flash.className = 'carousel-flash';
      carousel.appendChild(flash);
      setTimeout(() => flash.remove(), 600);

      // Show FX badge
      if (fxBadge) { fxBadge.textContent = fx.label; fxBadge.classList.add('show'); setTimeout(() => fxBadge.classList.remove('show'), 1200); }

      // Old slide out
      const oldSlide = slides[cur];
      clearAllFx(oldSlide);
      oldSlide.classList.add(fx.out);
      oldSlide.style.zIndex = 1;

      // New slide in
      const newSlide = slides[n];
      clearAllFx(newSlide);
      newSlide.classList.add('active', fx.in);
      newSlide.style.zIndex = 2;

      cur = n;
      if (counter) counter.textContent = (cur + 1) + ' / ' + total;
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
      if (captionEl && captions[cur]) captionEl.textContent = captions[cur];

      // Spawn hearts
      const rect = carousel.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

      resetTimer();
    }

    function nextSlide() { goSlide((cur + 1) % total); }
    function prevSlide() { goSlide((cur - 1 + total) % total); }

    function resetTimer() {
      clearInterval(timer);
      if (progressBar) { progressBar.style.transition = 'none'; progressBar.style.width = '0%'; void progressBar.offsetWidth; progressBar.style.transition = 'width 5s linear'; progressBar.style.width = '100%'; }
      timer = setInterval(nextSlide, 5000);
    }

    // Init
    slides[0].classList.add('active');
    slides[0].style.zIndex = 2;
    if (counter) counter.textContent = '1 / ' + total;
    if (captionEl && captions[0]) captionEl.textContent = captions[0];
    if (dots[0]) dots[0].classList.add('active');
    resetTimer();

    // Nav
    carousel.querySelector('.carousel-nav.prev')?.addEventListener('click', prevSlide);
    carousel.querySelector('.carousel-nav.next')?.addEventListener('click', nextSlide);
    dots.forEach((d, i) => d.addEventListener('click', () => goSlide(i)));

    // Swipe
    let sx = 0;
    carousel.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
    }, { passive: true });
  }

  /* ---------- MOSAIC LOAD MORE ---------- */
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const hidden = document.querySelectorAll('.mosaic-item.hidden');
      let count = 0;
      hidden.forEach(item => {
        if (count < 14) {
          item.classList.remove('hidden');
          item.classList.add('mosaic-reveal');
          count++;
        }
      });
      // Re-observe new items
      document.querySelectorAll('.mosaic-reveal:not(.visible)').forEach(el => revealObs.observe(el));
      if (document.querySelectorAll('.mosaic-item.hidden').length === 0) {
        loadMoreBtn.style.display = 'none';
      }
    });
  }

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.counter-value');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const dur = 2000;
        const start = performance.now();
        (function animate(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(animate);
        })(start);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ---------- CONFETTI ---------- */
  const cBtn = document.querySelector('.confetti-btn');
  if (cBtn) {
    cBtn.addEventListener('click', () => {
      const colors = ['#c8956c', '#e8a0b4', '#f5d5b8', '#d4764e', '#ff6b8a', '#ffd700', '#87ceeb', '#dda0dd'];
      for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const shape = Math.random() > 0.5 ? '50%' : (Math.random() > 0.5 ? '0%' : '30%');
        piece.style.cssText = `
          left: ${Math.random() * 100}vw;
          top: -10px;
          width: ${6 + Math.random() * 8}px;
          height: ${6 + Math.random() * 8}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${shape};
          animation-duration: ${1.5 + Math.random() * 2}s;
          animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
      }
    });
  }

  /* ---------- FLOATING HEARTS ON TAP ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.carousel-nav, .carousel-dot, .load-more-btn, .confetti-btn, .lightbox, .lightbox-close, .lightbox-nav')) return;
    const hearts = ['❤️', '💕', '💗', '💖', '🌸', '✨', '💐'];
    for (let i = 0; i < 3; i++) {
      const h = document.createElement('div');
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.cssText = `position:fixed; z-index:9999; pointer-events:none; font-size:${1.2 + Math.random()}rem;
        left:${e.clientX + (Math.random() - 0.5) * 40}px; top:${e.clientY}px;
        animation: scrollWordFloat 1.5s ease-out forwards;`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lbImg = lightbox?.querySelector('img');
  const lbCounter = lightbox?.querySelector('.lightbox-counter');
  let lbImages = [];
  let lbIdx = 0;

  function collectLbImages() {
    lbImages = [];
    document.querySelectorAll('.mosaic-item:not(.hidden) img, .carousel-slide img, .family-frame img').forEach(img => {
      if (img.src && !lbImages.includes(img.src)) lbImages.push(img.src);
    });
  }

  function openLightbox(src) {
    collectLbImages();
    lbIdx = lbImages.indexOf(src);
    if (lbIdx < 0) lbIdx = 0;
    if (lbImg) lbImg.src = lbImages[lbIdx];
    if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + lbImages.length;
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function lbPrev() {
    lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length;
    if (lbImg) { lbImg.style.opacity = 0; setTimeout(() => { lbImg.src = lbImages[lbIdx]; lbImg.style.opacity = 1; }, 200); }
    if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + lbImages.length;
  }

  function lbNext() {
    lbIdx = (lbIdx + 1) % lbImages.length;
    if (lbImg) { lbImg.style.opacity = 0; setTimeout(() => { lbImg.src = lbImages[lbIdx]; lbImg.style.opacity = 1; }, 200); }
    if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + lbImages.length;
  }

  // Click handlers  
  document.querySelectorAll('.mosaic-item img, .carousel-slide img, .family-frame img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src));
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-nav.prev')?.addEventListener('click', lbPrev);
  lightbox?.querySelector('.lightbox-nav.next')?.addEventListener('click', lbNext);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard & swipe on lightbox
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });
  let lbsx = 0;
  lightbox?.addEventListener('touchstart', e => { lbsx = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend', e => {
    const diff = lbsx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? lbNext() : lbPrev();
  }, { passive: true });

})();



