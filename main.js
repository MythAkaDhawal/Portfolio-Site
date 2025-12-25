

// Portfolio JavaScript - Main Module
// Handles typing effect, scroll animations, and interactive enhancements

// Typing Effect Configuration
const roles = [
  "AI / ML Engineer",
  "B.Tech CSE (AI & ML)",
  "Google Student Ambassador",
  "Tech Community Builder"
];

const typedText = document.getElementById("typed-text");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout;

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Enhanced Typing Effect with smoother timing
function typeEffect() {
  if (!typedText) return; // Safety check for missing element

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Typing phase
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      typeTimeout = setTimeout(() => (isDeleting = true), 1400);
    }
  } else {
    // Deleting phase
    typedText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
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
      } else {
        // Optional: remove class if not intersecting (for re-triggering)
        // entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.1 } // Reduced threshold for better triggering with adjusted padding
);

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
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
  // Implementation: Toggle classes on body, update CSS variables
  console.log('Theme toggle - to be implemented');
}

function updateNavActive() {
  // Placeholder for navbar active state on scroll
  // Implementation: Check scroll position, update .active class on nav links
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
  // Start typing effect
  typeEffect();

  // Initialize scroll animations
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el) observer.observe(el);
  });

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize accessibility features
  initAccessibility();

  // Future feature hooks (commented out until implemented)
  // updateNavActive();
  // toggleTheme();
});

// Cleanup on page unload (optional, for performance)
window.addEventListener('beforeunload', () => {
  if (typeTimeout) clearTimeout(typeTimeout);
  observer.disconnect();
});
