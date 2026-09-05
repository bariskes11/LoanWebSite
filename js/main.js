const slider = document.querySelector('[data-slider]');
const slides = [...document.querySelectorAll('[data-slide]')];
const dots = [...document.querySelectorAll('.dot')];
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-navigation');
let currentSlide = 0;
let timer;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === currentSlide));
    dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentSlide;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
    });
}

function restartTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(currentSlide + 1), 6000);
}

slider.addEventListener('click', (event) => {
    const directionButton = event.target.closest('[data-direction]');
    const dot = event.target.closest('.dot');
    if (directionButton) showSlide(currentSlide + (directionButton.dataset.direction === 'next' ? 1 : -1));
    if (dot) showSlide(dots.indexOf(dot));
    if (directionButton || dot) restartTimer();
});

slider.addEventListener('mouseenter', () => window.clearInterval(timer));
slider.addEventListener('mouseleave', restartTimer);
showSlide(0);
restartTimer();

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
});

navigation.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
    }
});