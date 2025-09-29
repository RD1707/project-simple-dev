// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);
// Custom ease animations (inspired by the article)
CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
CustomEase.create("directionalEase", "0.16, 1, 0.3, 1");
// Additional custom eases for smoother animations
CustomEase.create("smoothBlur", "0.25, 0.1, 0.25, 1");
CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");
// Prevent any layout shifts during animation
gsap.config({
  force3D: true
});
// Wait for images to load
window.addEventListener("load", () => {
  // Preloader animation with rotating images
  const preloader = document.querySelector(".preloader");
  const preloaderTextContainer = document.querySelector(
    ".preloader__text-container"
  );
  const preloaderTextCosmic = document.querySelector(".preloader__text-cosmic");
  const preloaderTextReflections = document.querySelector(
    ".preloader__text-reflections"
  );
  const preloaderImages = document.querySelectorAll(".preloader__image");
  const gridColumns = document.querySelectorAll(".grid-column");

  // Master timeline for preloader
  const masterTimeline = gsap.timeline();
  // First animate the text
  masterTimeline.fromTo(
    preloaderTextContainer,
    {
      opacity: 0,
      y: 10
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.4, // Even faster text animation
      ease: "power2.out"
    }
  );
  // Create separate timeline for image transitions
  const imageAnimation = gsap.timeline();
  // Show the first image immediately at full size
  gsap.set(preloaderImages[0], {
    opacity: 1,
    scale: 1 // First image is already at full size
  });
  // Function to cycle through images - only apply zoom to 2nd image onwards
  preloaderImages.forEach((img, index) => {
    if (index > 0 && index < preloaderImages.length) {
      // Start with the second image (index > 0)
      const delay = index === 1 ? 0.3 : 0.1; // Longer delay for first transition only
      // Super-fast zoom from tiny to full size
      imageAnimation.fromTo(
        preloaderImages[index],
        {
          opacity: 0,
          scale: 0.05 // Start very small
        },
        {
          opacity: 1,
          scale: 1, // Zoom to normal
          duration: 0.3, // Even faster transition
          ease: "power3.out" // More pronounced easing
        },
        `+=${delay}`
      );
      // Fade out previous image as next one comes in
      imageAnimation.to(
        preloaderImages[index - 1],
        {
          opacity: 0,
          duration: 0.15, // Very fast fade out
          ease: "power1.in"
        },
        "<0.1"
      ); // Overlap for smoother transition
    }
  });
  // Add image animation to master timeline
  masterTimeline.add(imageAnimation);

  // Calculate window width to determine how far to move the text
  const windowWidth = window.innerWidth;
  const leftPosition = -windowWidth / 3; // Move to about 1/3 of the screen from left
  const rightPosition = windowWidth / 3; // Move to about 1/3 of the screen from right

  // Animate the text words to split apart and change color
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

  // Add a small delay after the text splits
  masterTimeline.to({}, { duration: 0.8 }); // 0.8 second delay

  // Transition out preloader with a simple, clean animation
  masterTimeline.to(preloader, {
    y: "-100%",
    duration: 0.5, // Very fast exit
    ease: "power3.inOut", // More pronounced easing
    onComplete: () => {
      preloader.style.display = "none";
      // Animate grid columns
      animateGridColumns();
      // Trigger animations for hero section
      animateHero();
    }
  }); // Removed the delay here since we added it above
});

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
  const heroProject = document.querySelector(".hero__project");
  const heroDescription = document.querySelector(".hero__description");
  const heroMeta = document.querySelector(".hero__meta");
  const heroImage = document.querySelector(".hero__image");

  // Create a simple, clean timeline
  const heroTimeline = gsap.timeline();
  // Animate title lines first - simple transform
  heroTimeline.to(titleLines, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power2.out",
    stagger: 0.15
  });
  // Animate project info, description, and meta
  heroTimeline.to(
    [heroProject, heroDescription, heroMeta],
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15
    },
    "-=0.8"
  );
  // Animate the image scale
  heroTimeline.to(
    heroImage,
    {
      scale: 1,
      duration: 1.5,
      ease: "power2.inOut"
    },
    "-=1.2"
  );

  // Add scroll animations for new sections
  animateOnScroll();
}

// Scroll animations for all sections
function animateOnScroll() {
  // About section animations
  gsap.registerPlugin(ScrollTrigger);

  // About section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".about__project", {
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
  .to(".about__extended-bio", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
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
  .to(".projects__project", {
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
  .to(".project-card", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2
  }, "-=0.6");

  // Skills section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".skills",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".skills__project", {
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
  }, "-=0.4")
  .to(".metric-item", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2
  }, "-=0.6")
  .to(".metric-divider", {
    scaleX: 1,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.1
  }, "-=0.4");

  // Contact section
  gsap.timeline({
    scrollTrigger: {
      trigger: ".contact",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  })
  .to(".contact__project", {
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

// Header materialization effect
function initHeaderMaterialization() {
  const header = document.querySelector('.header');
  let isScrolling = false;

  function handleScroll() {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const threshold = 50; // Threshold in pixels

        if (scrollY > threshold) {
          header.classList.add('header--materialized');
        } else {
          header.classList.remove('header--materialized');
        }

        isScrolling = false;
      });
      isScrolling = true;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Check initial state
  handleScroll();
}

// Smooth scroll navigation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize header materialization
  initHeaderMaterialization();
  const navItems = document.querySelectorAll('.nav__item[data-target]');
  const mobileNavItems = document.querySelectorAll('.mobile-menu__item[data-target]');

  // Handle desktop navigation
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

  // Handle mobile navigation
  mobileNavItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      // Close mobile menu first
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

  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    if (hamburger.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu when clicking overlay
  mobileMenuOverlay.addEventListener('click', function(e) {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
      closeMobileMenu();
    }
  });
});