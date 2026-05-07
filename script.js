const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-menu-inner a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = [...document.querySelectorAll('.reveal')];
const form = document.getElementById('contactForm');

const setHeaderShadow = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 10);
};

window.addEventListener('scroll', setHeaderShadow, { passive: true });
setHeaderShadow();

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const setActiveLink = (id) => {
  const desktopLinks = document.querySelectorAll('.desktop-nav a');
  desktopLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveLink(visible.target.id);
      }
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: [0.2, 0.35, 0.5, 0.7],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (form) {
  form.addEventListener('submit', (event) => {
    const privacyAccepted = form.querySelector('input[name="privacy"]')?.checked;
    if (!privacyAccepted) {
      event.preventDefault();
      alert('Debes aceptar la política de privacidad para enviar la solicitud.');
      return;
    }
    // Form will submit to Formspree
  });
}

// Carousel functionality for "Quiénes somos" section
const carousel = document.getElementById('aboutCarousel');
const carouselSlides = carousel ? [...carousel.querySelectorAll('.carousel-slide')] : [];
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

let currentSlide = 0;
let carouselInterval;

const showSlide = (index) => {
  // Normalize index
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  
  carouselSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
};

const nextSlide = () => {
  showSlide(currentSlide + 1);
};

const prevSlide = () => {
  showSlide(currentSlide - 1);
};

const startCarousel = () => {
  if (carouselSlides.length > 0) {
    carouselInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
  }
};

const pauseCarousel = () => {
  clearInterval(carouselInterval);
};

// Arrow buttons click handlers
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    pauseCarousel();
    prevSlide();
    startCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    pauseCarousel();
    nextSlide();
    startCarousel();
  });
}

// Pause on hover
if (carousel) {
  carousel.addEventListener('mouseenter', pauseCarousel);
  carousel.addEventListener('mouseleave', startCarousel);
}

// Start carousel on page load
startCarousel();