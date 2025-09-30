// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

// Custom ease animations
CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
CustomEase.create("directionalEase", "0.16, 1, 0.3, 1");
CustomEase.create("smoothBlur", "0.25, 0.1, 0.25, 1");
CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");

// Prevent layout shifts during animation
gsap.config({
  force3D: true
});

// Global variables
let isLoading = true;
let currentSection = 'hero';

// ====================
// Custom Cursor
// ====================
function initCustomCursor() {
  // Only on desktop with hover capability
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (!cursorDot || !cursorOutline) return;

  let cursorX = 0;
  let cursorY = 0;
  let outlineX = 0;
  let outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Immediate update for dot
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
  });

  // Smooth follow for outline
  function animateCursor() {
    outlineX += (cursorX - outlineX) * 0.1;
    outlineY += (cursorY - outlineY) * 0.1;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  const interactiveElements = document.querySelectorAll('a, button, .nav__item, .project-card, .side-nav__item');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorOutline.style.borderColor = 'var(--color-accent)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.borderColor = 'var(--color-text-primary)';
    });
  });
}

// ====================
// Scroll Progress Bar
// ====================
function initScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / windowHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });
}

// ====================
// Side Navigation
// ====================
function initSideNavigation() {
  const sideNavItems = document.querySelectorAll('.side-nav__item');
  const sections = document.querySelectorAll('section[id]');
  
  if (!sideNavItems.length) return;

  // Update active state based on scroll
  function updateActiveSection() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSection = sectionId;
        
        sideNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection);

  // Click navigation
  sideNavItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      const targetElement = document.getElementById(targetSection);
      
      if (targetElement) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetElement,
            offsetY: 0
          },
          ease: "power2.inOut"
        });
      }
    });
  });
}

// ====================
// Preloader with Progress
// ====================
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  const preloaderTextContainer = document.querySelector(".preloader__text-container");
  const preloaderTextCosmic = document.querySelector(".preloader__text-cosmic");
  const preloaderTextReflections = document.querySelector(".preloader__text-reflections");
  const preloaderImages = document.querySelectorAll(".preloader__image");
  const progressBar = document.querySelector(".preloader__progress-bar");

  // Master timeline for preloader
  const masterTimeline = gsap.timeline({
    onComplete: () => {
      isLoading = false;
      initPageAnimations();
    }
  });

  // Animate progress bar
  if (progressBar) {
    masterTimeline.to(progressBar, {
      width: "100%",
      duration: 2,
      ease: "power2.inOut"
    });
  }

  // Text animation
  masterTimeline.fromTo(
    preloaderTextContainer,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    "-=1.5"
  );

  // Image transitions
  const imageAnimation = gsap.timeline();
  gsap.set(preloaderImages[0], { opacity: 1, scale: 1 });

  preloaderImages.forEach((img, index) => {
    if (index > 0 && index < preloaderImages.length) {
      const delay = index === 1 ? 0.3 : 0.1;
      
      imageAnimation.fromTo(
        preloaderImages[index],
        { opacity: 0, scale: 0.05 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" },
        `+=${delay}`
      );
      
      imageAnimation.to(
        preloaderImages[index - 1],
        { opacity: 0, duration: 0.15, ease: "power1.in" },
        "<0.1"
      );
    }
  });

  masterTimeline.add(imageAnimation, "-=1.8");

  // Split text animation
  const windowWidth = window.innerWidth;
  const leftPosition = -windowWidth / 3;
  const rightPosition = windowWidth / 3;

  masterTimeline.to(
    preloaderTextCosmic,
    {
      x: leftPosition,
      color: "var(--color-text-primary)",
      duration: 0.8,
      ease: "customEase"
    },
    "-=0.5"
  );

  masterTimeline.to(
    preloaderTextReflections,
    {
      x: rightPosition,
      color: "var(--color-text-primary)",
      duration: 0.8,
      ease: "customEase"
    },
    "<"
  );

  masterTimeline.to({}, { duration: 0.3 });

  // Exit animation
  masterTimeline.to(preloader, {
    y: "-100%",
    duration: 0.5,
    ease: "power3.inOut",
    onComplete: () => {
      preloader.style.display = "none";
      animateGridColumns();
      animateHero();
    }
  });
});

// ====================
// Page Animations
// ====================
function initPageAnimations() {
  initCustomCursor();
  initScrollProgress();
  initSideNavigation();
  initCounterAnimations();
  initProjectFilters();
  initFormAnimations();
  initBackToTop();
}

// Animate grid columns
function animateGridColumns() {
  const gridColumns = document.querySelectorAll(".grid-column");
  gsap.to(gridColumns, {
    height: "100%",
    duration: 1,
    ease: "power2.out",
    stagger: 0.05
  });
}

// Hero section animation
function animateHero() {
  const titleLines = document.querySelectorAll(".hero__title-line");
  const heroBadge = document.querySelector(".hero__badge");
  const heroDescription = document.querySelector(".hero__description");
  const heroCta = document.querySelector(".hero__cta-group");
  const heroMeta = document.querySelector(".hero__meta");
  const heroImage = document.querySelector(".hero__image");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  const heroTimeline = gsap.timeline();

  // Badge animation
  heroTimeline.to(heroBadge, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  });

  // Title animation with stagger
  heroTimeline.to(titleLines, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power2.out",
    stagger: 0.15
  }, "-=0.4");

  // Description, CTA, and Meta
  heroTimeline.to([heroDescription, heroCta, heroMeta], {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.15
  }, "-=0.8");

  // Image animation
  heroTimeline.to(heroImage, {
    scale: 1,
    duration: 1.5,
    ease: "power2.inOut"
  }, "-=1.2");

  // Scroll indicator
  heroTimeline.to(scrollIndicator, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.5");

  // Start scroll animations
  animateOnScroll();
}

// ====================
// Scroll Animations
// ====================
function animateOnScroll() {
  // About section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".about__badge", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  })
  .to(".about__title-line", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.15
  }, "-=0.4")
  .to(".about__quote", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .to(".about__description", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.4")
  .to(".bio-card", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15
  }, "-=0.6");

  // Projects section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".projects",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".projects__badge", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  })
  .to(".projects__title", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4")
  .to(".projects__filter", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .to(".project-card", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2
  }, "-=0.4");

  // Skills section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".skills",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".skills__badge", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  })
  .to(".skills__title", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4")
  .to(".skills__categories", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .to(".skills__metrics", {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4");

  // Animate skill levels when visible
  ScrollTrigger.create({
    trigger: ".skills__categories",
    start: "top 80%",
    once: true,
    onEnter: () => {
      document.querySelectorAll('.level-fill').forEach(fill => {
        fill.style.animationPlayState = 'running';
      });
    }
  });

  // Testimonials section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".testimonials",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".testimonials__badge", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  })
  .to(".testimonials__title", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4")
  .to(".testimonial-card", {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15
  }, "-=0.6");

  // Contact section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".contact",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".contact__badge", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  })
  .to(".contact__title", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4")
  .to(".contact__description", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.6")
  .to(".contact__form-container", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.4");
}

// ====================
// Counter Animations
// ====================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target], .metric-number[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2;
    
    ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          textContent: target,
          duration: duration,
          ease: "power1.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            counter.textContent = Math.floor(counter.textContent);
          }
        });
      }
    });
  });
}

// ====================
// Project Filters
// ====================
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          card.style.display = 'block';
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

// ====================
// Form Animations
// ====================
function initFormAnimations() {
  const form = document.getElementById('contact-form');
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  
  // Input focus animations
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const label = this.previousElementSibling;
      if (label) {
        gsap.to(label, {
          color: 'var(--color-accent)',
          duration: 0.3
        });
      }
    });
    
    input.addEventListener('blur', function() {
      const label = this.previousElementSibling;
      if (label) {
        gsap.to(label, {
          color: 'var(--color-text-secondary)',
          duration: 0.3
        });
      }
    });
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animate button
      const button = this.querySelector('.form-submit');
      const buttonText = button.querySelector('.submit-text');
      
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
      
      // Success state
      setTimeout(() => {
        buttonText.textContent = 'Message Sent!';
        button.style.background = 'var(--color-success)';
        
        // Reset form
        setTimeout(() => {
          form.reset();
          buttonText.textContent = 'Send Message';
          button.style.background = '';
        }, 3000);
      }, 500);
    });
  }
}

// ====================
// Header Materialization
// ====================
function initHeaderMaterialization() {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 50;

    // Add/remove materialized class
    if (scrollY > threshold) {
      header.classList.add('header--materialized');
    } else {
      header.classList.remove('header--materialized');
    }

    // Hide/show on scroll direction
    if (scrollY > lastScroll && scrollY > 100) {
      gsap.to(header, {
        y: -100,
        duration: 0.3,
        ease: "power2.inOut"
      });
    } else {
      gsap.to(header, {
        y: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ====================
// Smooth Navigation
// ====================
function initSmoothNavigation() {
  const navItems = document.querySelectorAll('.nav__item[data-target]');
  const mobileNavItems = document.querySelectorAll('.mobile-menu__item[data-target]');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

  // Desktop navigation
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetSection,
            offsetY: 80
          },
          ease: "power2.inOut"
        });
      }
    });
  });

  // Mobile navigation
  mobileNavItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      closeMobileMenu();

      if (targetSection) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetSection,
            offsetY: 80
          },
          ease: "power2.inOut"
        });
      }
    });
  });

  // Mobile menu functions
  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    gsap.fromTo('.mobile-menu__item',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hamburger click
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      if (hamburger.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close on overlay click
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function(e) {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// ====================
// Back to Top
// ====================
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power2.inOut"
    });
  });

  // Show/hide based on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      gsap.to(backToTopBtn, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3
      });
    } else {
      gsap.to(backToTopBtn, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3
      });
    }
  });
}

// ====================
// Parallax Effects
// ====================
function initParallaxEffects() {
  // Floating shapes parallax
  gsap.utils.toArray('.shape').forEach((shape, index) => {
    gsap.to(shape, {
      yPercent: -100 * (index + 1),
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 1 + (index * 0.5)
      }
    });
  });
  }

// ====================
// Initialize on DOM Load
// ====================
document.addEventListener('DOMContentLoaded', function() {
  initHeaderMaterialization();
  initSmoothNavigation();
  initParallaxEffects();
  
  // Initialize remaining features after load
  if (!isLoading) {
    initPageAnimations();
  }
});

// ====================
// Window Resize Handler
// ====================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
    
    // Reinitialize cursor on resize
    initCustomCursor();
  }, 250);
});

// ====================
// Page Visibility Handler
// ====================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    gsap.globalTimeline.pause();
  } else {
    // Resume animations when page is visible
    gsap.globalTimeline.resume();
  }
});

// ====================
// Performance Optimization
// ====================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for high-frequency events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ====================
// Lazy Loading Images
// ====================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ====================
// Accessibility Enhancements
// ====================
function initAccessibility() {
  // Skip to content link
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#main-content');
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Keyboard navigation for interactive elements
  document.addEventListener('keydown', (e) => {
    // Tab key navigation enhancement
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// Initialize accessibility features
initAccessibility();

// ====================
// Debug Mode (Development Only)
// ====================
const DEBUG = false; // Set to true for development

if (DEBUG) {
  // Show FPS meter
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  function animate() {
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Log ScrollTrigger positions
  ScrollTrigger.addEventListener("refreshInit", () => {
    console.log("ScrollTrigger refreshed");
  });
}

console.log('Portfolio initialized successfully! ✨');