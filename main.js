// Portfolio JavaScript - Main Module
// Handles typing effect, scroll animations, and interactive enhancements

// Typing Effect Configuration
const roles = [
  "AI / ML Engineer",
  "B.Tech CSE (AI & ML)",
  "Google Student Ambassador",
  "Tech Community Builder"
];

let typedText = null;
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout = null;

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Enhanced Typing Effect with smoother timing
function typeEffect() {
  if (!typedText) return;

  const currentRole = roles[roleIndex];

  // Prevent multiple timeouts stacking
  if (typeTimeout) {
    clearTimeout(typeTimeout);
    typeTimeout = null;
  }

  if (!isDeleting) {
    // Typing phase
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      // pause at end before deleting
      typeTimeout = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1400);
      return;
    }
  } else {
    // Deleting phase
    typedText.textContent = currentRole.substring(0, Math.max(0, charIndex - 1));
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      // small pause before typing next role
      typeTimeout = setTimeout(typeEffect, 300);
      return;
    }
  }

  const speed = isDeleting ? 50 : 90;
  typeTimeout = setTimeout(typeEffect, speed);
}

// Scroll-based Animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Only handle page-internal anchors
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

// Future Hooks for Enhanced Features
function toggleTheme() {
  // Placeholder for dark/light mode toggle
  console.log('Theme toggle - to be implemented');
}

function updateNavActive() {
  // Placeholder for navbar active state on scroll
  console.log('Nav active update - to be implemented');
}

// Accessibility Enhancements
function initAccessibility() {
  // Ensure focus management for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  // Acquire typedText after DOM is available
  typedText = document.getElementById("typed-text");

  // Start typing effect only if element exists
  if (typedText) {
    // small initial delay
    setTimeout(typeEffect, 250);
  }

  // Initialize scroll animations
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el) observer.observe(el);
  });

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize accessibility features
  initAccessibility();
});

// Cleanup on page unload (optional, for performance)
window.addEventListener('beforeunload', () => {
  if (typeTimeout) {
    clearTimeout(typeTimeout);
    typeTimeout = null;
  }
  observer.disconnect();
});
