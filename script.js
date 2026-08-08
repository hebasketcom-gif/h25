/**
 * Dr. Praveen Pathak - Academic Portfolio JavaScript Engine
 * Author: Portfolio Engineering
 * Description: Lightweight, vanilla JavaScript module handling theme state,
 *              scroll animations, interactive modal lightbox, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initTheme();
  initScrollProgress();
  initHeaderAndNav();
  initScrollReveal();
  initGalleryLightbox();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark Mode Toggle & Persistence)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('praveen_portfolio_theme');
  
  // Default to system preference if no localStorage set
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('praveen_portfolio_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon('light');
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.querySelector('.theme-icon-sun');
  const moonIcon = document.querySelector('.theme-icon-moon');
  
  if (sunIcon && moonIcon) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

/* --------------------------------------------------------------------------
   2. Scroll Progress Indicator
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Header State & Mobile Navigation
   -------------------------------------------------------------------------- */
function initHeaderAndNav() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky Header Scroll State
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active Section Link Highlight (ScrollSpy)
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
      mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  // Hamburger Toggle Logic
  if (hamburgerBtn && mobileNavOverlay) {
    const toggleMobileMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileNavOverlay.classList.contains('is-active');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
      mobileNavOverlay.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('is-active')) {
        toggleMobileMenu(false);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Intersection Observer for Scroll Reveals
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Interactive Lightbox Modal for Gallery
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightboxModal || !lightboxImg) return;

  const openLightbox = (src, alt, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Academic Gallery Image';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const captionTitle = item.querySelector('.gallery-caption-title')?.textContent || '';
      const captionSub = item.querySelector('.gallery-caption-sub')?.textContent || '';
      if (img) {
        openLightbox(img.src, img.alt, `${captionTitle} — ${captionSub}`);
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Smooth Anchor Scroll Adjustment
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const headerHeight = 80;

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
