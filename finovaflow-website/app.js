/* ============================================
   FINOVAFLOW TECH — MASTER JAVASCRIPT
   Animations, Interactions, Effects
   ============================================ */

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCanvas();
  initNavbar();
  initTheme();
  initHamburger();
  initScrollReveal();
  initCounters();
  initPortfolioFilter();
  initTestimonialsSlider();
  initContactForm();
  initScrollTop();
  initParallax();
  initActiveNavLinks();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Hide loader after animation
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero animations
    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
      setTimeout(() => el.classList.add('revealed'), delay * 1000);
    });
  }, 2000);
  document.body.style.overflow = 'hidden';
}

/* ============================================
   ANIMATED CANVAS BACKGROUND
   Floating particles + glowing lines
   ============================================ */
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], lines = [];
  const PARTICLE_COUNT = 60;
  const LINE_COUNT = 8;
  let animFrameId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getColors() {
    return isDark()
      ? { particle: 'rgba(96,165,250,', line: 'rgba(37,99,235,' }
      : { particle: 'rgba(37,99,235,', line: 'rgba(37,99,235,' };
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 300 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const c = getColors();
      const fade = this.age < 30 ? this.age / 30 : this.age > this.life - 30 ? (this.life - this.age) / 30 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = c.particle + (this.alpha * fade) + ')';
      ctx.fill();
    }
  }

  class FloatingLine {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.length = Math.random() * 120 + 40;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.3 + 0.1;
      this.alpha = Math.random() * 0.12 + 0.03;
      this.width = Math.random() * 1.2 + 0.3;
      this.life = Math.random() * 400 + 200;
      this.age = 0;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.age++;
      if (this.age > this.life || this.x < -200 || this.x > W + 200 || this.y < -200 || this.y > H + 200) this.reset();
    }
    draw() {
      const c = getColors();
      const fade = this.age < 40 ? this.age / 40 : this.age > this.life - 40 ? (this.life - this.age) / 40 : 1;
      const x2 = this.x + Math.cos(this.angle) * this.length;
      const y2 = this.y + Math.sin(this.angle) * this.length;
      const grad = ctx.createLinearGradient(this.x, this.y, x2, y2);
      grad.addColorStop(0, c.line + '0)');
      grad.addColorStop(0.4, c.line + (this.alpha * fade) + ')');
      grad.addColorStop(1, c.line + '0)');
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.width;
      ctx.stroke();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    lines = Array.from({ length: LINE_COUNT }, () => new FloatingLine());
  }

  function drawConnections() {
    const c = getColors();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = c.particle + (0.08 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    lines.forEach(l => { l.update(); l.draw(); });
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', () => { resize(); });
}

/* ============================================
   NAVBAR SCROLL BEHAVIOR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================
   THEME TOGGLE (Dark / Light)
   ============================================ */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('ffTheme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ffTheme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ffTheme', 'dark');
    }
  });
}

/* ============================================
   HAMBURGER MENU
   ============================================ */
function initHamburger() {
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!ham || !navLinks) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-right');

  // Elements already revealed by loader (hero section) won't be re-observed
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    // Don't observe hero items — they're handled by loader
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.count, .stat-num');

  function animateCount(el, target) {
    let current = 0;
    const duration = 1800;
    const start = performance.now();
    const isFloat = target !== Math.floor(target);

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = '';
          item.classList.add('revealed');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   TESTIMONIALS AUTO-SLIDER
   ============================================ */
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonialsSlider');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoplayTimer;
  let visibleCount = getVisibleCount();

  // Create dots
  const maxDots = total - visibleCount + 1;
  for (let i = 0; i < maxDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    visibleCount = getVisibleCount();
    const maxIndex = total - visibleCount;
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24; // + gap
    slider.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
    slider.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); if (current >= total - visibleCount) goTo(0); }
  function prev() { goTo(current - 1); if (current < 0) goTo(total - visibleCount); }

  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  function startAutoplay() { autoplayTimer = setInterval(() => { next(); }, 4500); }
  function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }

  // Touch/drag support
  let startX = 0, isDragging = false;
  slider.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
  slider.addEventListener('mousemove', e => { if (!isDragging) return; });
  slider.addEventListener('mouseup', e => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
    isDragging = false;
  });
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
  });

  window.addEventListener('resize', () => { goTo(current); });
  startAutoplay();
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      // Shake invalid inputs
      [document.getElementById('contactName'), document.getElementById('contactEmail'), document.getElementById('contactMessage')].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          input.style.animation = 'shake 0.5s ease';
          setTimeout(() => { input.style.animation = ''; input.style.borderColor = ''; }, 500);
        }
      });
      return;
    }

    // Simulate sending
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<span>✅ Sent!</span>';
      if (success) { success.classList.add('visible'); }
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        if (success) success.classList.remove('visible');
      }, 4000);
    }, 1500);
  });

  // Add shake keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   SCROLL-TO-TOP BUTTON
   ============================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   MOUSE PARALLAX EFFECT (subtle)
   ============================================ */
function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  let mouseX = 0, mouseY = 0;
  let currentX = [0,0,0], currentY = [0,0,0];
  const speeds = [0.015, 0.025, 0.018];

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateParallax() {
    orbs.forEach((orb, i) => {
      currentX[i] += (mouseX * 40 - currentX[i]) * speeds[i];
      currentY[i] += (mouseY * 30 - currentY[i]) * speeds[i];
      orb.style.transform = `translate(${currentX[i]}px, ${currentY[i]}px)`;
    });
    requestAnimationFrame(animateParallax);
  }
  animateParallax();

  // Also parallax on hero mockup
  const mockup = document.querySelector('.hero-mockup');
  if (mockup) {
    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
      const tx = (e.clientX / window.innerWidth - 0.5) * 12;
      const ty = (e.clientY / window.innerHeight - 0.5) * 8;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
    });
    function animateMockup() {
      // The float animation handles the main y-movement; we add subtle mouse tilt
      mockup.style.transform = `perspective(800px) rotateY(${-mx * 0.3}deg) rotateX(${my * 0.2}deg)`;
      requestAnimationFrame(animateMockup);
    }
    animateMockup();
  }
}

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ============================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.querySelector('.navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================
   NAVBAR LOGO HOVER EFFECT
   ============================================ */
const navLogo = document.getElementById('navLogo');
if (navLogo) {
  navLogo.addEventListener('mouseenter', () => {
    navLogo.querySelector('.logo-icon').style.transform = 'rotate(-8deg) scale(1.1)';
    navLogo.querySelector('.logo-icon').style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  });
  navLogo.addEventListener('mouseleave', () => {
    navLogo.querySelector('.logo-icon').style.transform = '';
  });
}

/* ============================================
   SERVICE CARD TILT EFFECT
   ============================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  });
});

/* ============================================
   COUNTER CARD TILT (ABOUT)
   ============================================ */
document.querySelectorAll('.counter-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s ease';
  });
});

/* ============================================
   TESTIMONIAL CARD GLASS HOVER
   ============================================ */
document.querySelectorAll('.testimonial-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-6px)';
    card.style.boxShadow = 'var(--shadow-xl)';
    card.style.borderColor = 'rgba(37,99,235,0.25)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.borderColor = '';
  });
});

/* ============================================
   SOCIAL LINK MAGNETIC EFFECT
   ============================================ */
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    link.style.transform = `translate(${x}px, ${y}px) translateY(-3px) scale(1.05)`;
    link.style.transition = 'transform 0.1s ease';
  });
  link.addEventListener('mouseleave', () => {
    link.style.transform = '';
    link.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  });
});

/* ============================================
   HERO CTA BUTTON RIPPLE EFFECT
   ============================================ */
[document.getElementById('heroGetStarted'), document.getElementById('heroViewServices')].forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.6s linear;
      background:rgba(255,255,255,0.3);
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(rippleStyle);

/* ============================================
   GLOWING CURSOR TRAIL (subtle)
   ============================================ */
(function initCursorTrail() {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(37,99,235,0.06),transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.4s ease,top 0.4s ease;
    top:-200px;left:-200px;
  `;
  document.body.appendChild(trail);

  document.addEventListener('mousemove', (e) => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  });
})();

/* ============================================
   PAGE VISIBILITY — PAUSE/RESUME ANIMATIONS
   ============================================ */
document.addEventListener('visibilitychange', () => {
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.style.animationPlayState = document.hidden ? 'paused' : 'running';
  }
});
