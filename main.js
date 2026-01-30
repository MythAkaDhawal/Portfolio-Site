// ============================================
// PORTFOLIO MAIN.JS - CENTRALIZED LOGIC
// Handles: Barba.js transitions, Vanta.js backgrounds, GSAP animations, typing effect
// ============================================

// ==================== GLOBAL STATE ====================
let vantaEffect = null;
let typedText = null;
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout = null;
const isMobile = window.innerWidth <= 768;

const roles = [
  "AI / ML Engineer",
  "B.Tech CSE (AI & ML)",
  "Google Student Ambassador",
  "Tech Community Builder"
];

// ==================== VANTA.JS BACKGROUND MANAGER ====================
const vantaConfigs = {
  home: {
    effect: 'DOTS',
    config: {
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xe6b87d,
      color2: 0x9fb39a,
      backgroundColor: 0x0b0c0e,
      size: 2.8,
      spacing: 28,
      showLines: false
    }
  },

  about: {
    effect: 'WAVES',
    config: {
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x9fb39a,
      shininess: 18,
      waveHeight: 12,
      waveSpeed: 0.35,
      zoom: 0.9
    }
  },

  skills: {
    effect: 'NET',
    config: {
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x8fa88c,
      backgroundColor: 0x0b0c0e,
      points: 6,
      maxDistance: 18,
      spacing: 20
    }
  },

  projects: {
    effect: 'BIRDS',
    config: {
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x0b0c0e,
      color1: 0xe6b87d,
      color2: 0x9fb39a,
      birdSize: 1.1,
      wingSpan: 22,
      speedLimit: 3,
      separation: 50,
      cohesion: 22
    }
  },

  contact: {
    effect: 'TOPOLOGY',
    config: {
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x8fa88c,
      backgroundColor: 0x0b0c0e
    }
  }
};

function initVanta(namespace) {
  // Verify background element exists
  const bgElement = document.getElementById('vanta-bg');
  if (!bgElement) {
    console.warn('Vanta background element not found');
    return;
  }

  // Destroy existing instance with error handling
  if (vantaEffect) {
    try {
      vantaEffect.destroy();
    } catch (e) {
      console.warn('Vanta destroy error:', e);
    }
    vantaEffect = null;
  }

  // Skip on mobile for performance
  if (isMobile) {
    console.log('Vanta disabled on mobile');
    return;
  }

  // Verify VANTA library loaded
  if (typeof VANTA === 'undefined') {
    console.warn('VANTA library not loaded');
    return;
  }

  const config = vantaConfigs[namespace];
  if (!config) {
    console.warn('No Vanta config for namespace:', namespace);
    return;
  }

  // Initialize immediately without delay
  try {
    const effectName = config.effect;
    if (typeof VANTA[effectName] === 'function') {
      // Assign element directly to config
      config.config.el = bgElement;
      vantaEffect = VANTA[effectName](config.config);
      console.log(`✓ Vanta ${effectName} initialized for ${namespace}`);
    } else {
      console.warn(`VANTA.${effectName} is not available`);
    }
  } catch (error) {
    console.error('Vanta initialization failed:', error);
  }
}

// ==================== TYPING EFFECT ====================
function typeEffect() {
  if (!typedText) return;

  const currentRole = roles[roleIndex];

  if (typeTimeout) {
    clearTimeout(typeTimeout);
    typeTimeout = null;
  }

  if (!isDeleting) {
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      typeTimeout = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1400);
      return;
    }
  } else {
    typedText.textContent = currentRole.substring(0, Math.max(0, charIndex - 1));
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeTimeout = setTimeout(typeEffect, 300);
      return;
    }
  }

  const speed = isDeleting ? 50 : 90;
  typeTimeout = setTimeout(typeEffect, speed);
}

function initTypingEffect() {
  typedText = document.getElementById("typed-text");
  if (typedText) {
    roleIndex = 0;
    charIndex = 0;
    isDeleting = false;
    setTimeout(typeEffect, 250);
  }
}

function cleanupTypingEffect() {
  if (typeTimeout) {
    clearTimeout(typeTimeout);
    typeTimeout = null;
  }
  typedText = null;
}

// ==================== GSAP ANIMATIONS ====================
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Kill all existing ScrollTriggers to prevent duplicates
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Animate .reveal elements on scroll
  gsap.utils.toArray('.reveal').forEach((elem) => {
    gsap.to(elem,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Button hover animations (desktop only)
  if (!isMobile) {
    gsap.utils.toArray('.btn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }
}

// ==================== NAVIGATION ACTIVE STATE ====================
function updateNavActive() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==================== ACCESSIBILITY ====================
function initAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
  setTimeout(() => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
      toggle.textContent = "🌙";
    } else {
      toggle.textContent = "☀️";
    }

    toggle.onclick = () => {
      document.body.classList.toggle("light-theme");

      if (document.body.classList.contains("light-theme")) {
        localStorage.setItem("theme", "light");
        toggle.textContent = "🌙";
      } else {
        localStorage.setItem("theme", "dark");
        toggle.textContent = "☀️";
      }
    };
  }, 50);
}

// ==================== PAGE INITIALIZATION ====================
function initPage(namespace) {
  console.log('Initializing page:', namespace);

  // Initialize Vanta background for current page
  initVanta(namespace);

  // Initialize GSAP animations
  initGSAPAnimations();

  // Initialize typing effect (only on home page)
  if (namespace === 'home') {
    initTypingEffect();
  }

  // Update navigation active state
  updateNavActive();

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize accessibility features
  initAccessibility();

  initThemeToggle();

  // Scroll to top
  window.scrollTo(0, 0);
}

// ==================== BARBA.JS SETUP ====================
if (typeof barba !== 'undefined') {
  barba.init({
    prevent: ({ el }) => el.classList && el.classList.contains('no-barba'),
    transitions: [{
      name: 'default-transition',
      
      async leave(data) {
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
          overlay.classList.add('active');
        }

        // Cleanup typing effect if leaving home page
        if (data.current.namespace === 'home') {
          cleanupTypingEffect();
        }

        // Animate out current page
        await gsap.to(data.current.container, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in'
        });
      },

      async enter(data) {
        // Get new page namespace
        const namespace = data.next.namespace;
        
        console.log('Entering page:', namespace);

        // Initialize new page (includes Vanta)
        initPage(namespace);

        // Animate in new page
        gsap.fromTo(data.next.container,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: 'power2.out',
            clearProps: 'all'
          }
        );

        // Remove overlay
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
          setTimeout(() => {
            overlay.classList.remove('active');
          }, 400);
        }
      }
    }]
  });

  console.log('✓ Barba.js initialized');
}

// ==================== INITIAL PAGE LOAD (CRITICAL FOR DIRECT NAVIGATION) ====================
// This handles when user directly navigates to or refreshes any page
function handleDirectPageLoad() {
  const namespace = document.querySelector('[data-barba-namespace]')?.getAttribute('data-barba-namespace') || 'home';
  console.log('Direct page load detected, namespace:', namespace);
  
  // Initialize page immediately
  initPage(namespace);
  
  // Force Vanta to reinitialize after a short delay to ensure DOM is stable
  setTimeout(() => {
    if (!vantaEffect && !isMobile) {
      console.log('Forcing Vanta initialization after delay');
      initVanta(namespace);
    }
  }, 300);
}

// Execute on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDirectPageLoad);
} else {
  // DOM already loaded
  handleDirectPageLoad();
}

// Backup: Execute on window load
window.addEventListener('load', () => {
  if (!vantaEffect && !isMobile) {
    const namespace = document.querySelector('[data-barba-namespace]')?.getAttribute('data-barba-namespace') || 'home';
    console.log('Window load - ensuring Vanta is initialized');
    initVanta(namespace);
  }
});

// ==================== CLEANUP ON UNLOAD ====================
window.addEventListener('beforeunload', () => {
  cleanupTypingEffect();
  if (vantaEffect) {
    try {
      vantaEffect.destroy();
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
    vantaEffect = null;
  }
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});
