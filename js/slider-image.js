function setResponsiveBackgrounds() {
  const isMobile = window.innerWidth <= 768;
  document.querySelectorAll('.hero-slide').forEach(slide => {
    const desktopImg = slide.dataset.bgDesktop || slide.dataset.bg;
    const mobileImg = slide.dataset.bgMobile;
    const imageToUse = isMobile && mobileImg ? mobileImg : desktopImg;
    if (imageToUse) {
      slide.style.backgroundImage = `url('${imageToUse}')`;
    }
  });
}

function initializeHeroSlider() {
  setResponsiveBackgrounds();
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-dots');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');

  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let interval;

  // Remove old dots if re-initializing
  dotsContainer.innerHTML = '';

  // Lazy load background images
  slides.forEach(slide => {
    const img = slide.dataset.bg;
    if (img) {
      slide.style.backgroundImage = `url('${img}')`;
    }
  });

  // Create dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.hero-dot');

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetAutoSlide();
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((current - 1 + slides.length) % slides.length);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  function startAutoSlide() {
    interval = setInterval(nextSlide, 7000);
  }

  function resetAutoSlide() {
    clearInterval(interval);
    startAutoSlide();
  }
  

  startAutoSlide();
  // For debug
  console.log('🔥 Hero slider initialized');
}

document.addEventListener('DOMContentLoaded', initializeHeroSlider);
document.addEventListener('homeLoaded', initializeHeroSlider);
window.addEventListener('resize', setResponsiveBackgrounds);