/**
 * DR. PRAVEEN PATHAK - ACADEMIC PORTFOLIO INTERACTION ENGINE
 * Vanilla JavaScript implementation for Theme Management, ScrollSpy,
 * Intersection Animations, Lightbox, Mobile Navigation, and Form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core subsystems
  initThemeManager();
  initNavbarAndScrollSpy();
  initScrollProgress();
  initMobileNavigation();
  initScrollRevealAnimations();
  initGalleryLightbox();
  initContactForm();
  initBackToTop();
  initCursorFollower();
  initCurrentYear();
});

/* ==========================================================================
   1. THEME MANAGEMENT (LIGHT / DARK MODE)
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  // Check saved localStorage preference or system preference
  const savedTheme = localStorage.getItem('dr_pathak_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dr_pathak_theme', newTheme);
  });
}

/* ==========================================================================
   2. STICKY NAVBAR & ACTIVE SECTION SCROLLSPY
   ========================================================================== */
function initNavbarAndScrollSpy() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add scrolled glass class
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Scrollspy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function openMenu() {
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }
}

/* ==========================================================================
   6. GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  if (!lightboxModal || !lightboxImg) return;

  function openLightbox(src, captionText) {
    lightboxImg.src = src;
    lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      if (src) {
        openLightbox(src, caption);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('academicContactForm');
  const responseDiv = document.getElementById('formResponse');

  if (!form || !responseDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const senderName = document.getElementById('senderName')?.value || 'Colleague';

    // Show interactive feedback response
    responseDiv.className = 'form-response success';
    responseDiv.innerHTML = `
      ✓ Thank you, ${escapeHTML(senderName)}. Your academic message has been recorded. Dr. Praveen Pathak will review your inquiry.
    `;

    form.reset();

    setTimeout(() => {
      responseDiv.textContent = '';
      responseDiv.className = 'form-response';
    }, 6000);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. SUBTLE DESKTOP CURSOR GLOW
   ========================================================================== */
function initCursorFollower() {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor || window.innerWidth < 1024) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
}

/* ==========================================================================
   10. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
