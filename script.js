/**
 * DR. PRAVEEN PATHAK — ACADEMIC PORTFOLIO SCRIPT
 * Zero-dependency Vanilla JavaScript
 * Features: Dark Mode, Scroll Progress, Mobile Drawer, IntersectionObserver ScrollSpy,
 * Lightbox Modal, Accessible Keyboard Trap & Smooth Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DOM ELEMENTS
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const themeToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const inquiryForm = document.getElementById('inquiry-form');
  const formFeedback = document.getElementById('form-feedback');
  const backToTopBtn = document.getElementById('back-to-top');

  // =========================================================================
  // 2. SCROLL PROGRESS & HEADER SHRINK
  // =========================================================================
  function handleScroll() {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update progress bar
    if (scrollProgressBar && scrollHeight > 0) {
      const progress = (scrollY / scrollHeight) * 100;
      scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // Shrink header
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // =========================================================================
  // 3. DARK MODE TOGGLE & LOCALSTORAGE
  // =========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }

  function setDarkTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
        themeToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>`;
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        themeToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>`;
      }
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setDarkTheme(!isDark);
    });
  }

  initTheme();

  // =========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function toggleMobileMenu() {
    const isActive = mobileNavOverlay.classList.contains('is-active');
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileNavOverlay.classList.add('is-active');
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavOverlay.classList.remove('is-active');
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavOverlay.classList.contains('is-active')) {
        closeMobileMenu();
      }
    });
  });

  // =========================================================================
  // 5. SCROLLSPY (ACTIVE NAV HIGHLIGHT)
  // =========================================================================
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // =========================================================================
  // 6. SCROLL REVEAL ANIMATIONS
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 7. LIGHTBOX MODAL
  // =========================================================================
  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-caption');
        const sub = item.querySelector('.gallery-sub');

        if (img && lightboxImg) {
          lightboxImg.src = img.getAttribute('src');
          lightboxImg.alt = img.getAttribute('alt') || 'Gallery Image';
        }

        if (lightboxCaption) {
          const titleText = caption ? caption.textContent : '';
          const subText = sub ? sub.textContent : '';
          lightboxCaption.innerHTML = `${titleText} <br><span style="font-size:0.9rem; color:var(--warm-gold); font-family:var(--font-sans);">${subText}</span>`;
        }

        lightboxModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightboxModal.classList.contains('is-active')) {
          closeLightbox();
        }
        if (mobileNavOverlay && mobileNavOverlay.classList.contains('is-active')) {
          closeMobileMenu();
        }
      }
    });
  }

  // =========================================================================
  // 8. CONTACT FORM SUBMISSION HANDLING
  // =========================================================================
  if (inquiryForm && formFeedback) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formFeedback.style.display = 'block';
      formFeedback.textContent = 'Thank you for your academic inquiry. Dr. Praveen Pathak will respond shortly.';
      
      inquiryForm.reset();

      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 6000);
    });
  }

  // =========================================================================
  // 9. BACK TO TOP BUTTON
  // =========================================================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
