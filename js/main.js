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
    const selectedLink = event.target.closest('a');

    if (selectedLink) {
        navigation.querySelectorAll('a').forEach((link) => link.classList.remove('active'));
        selectedLink.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
    }
});

const calculator = document.querySelector('#loan-calculator');
const amountInput = document.querySelector('#loan-amount');
const rateDisplay = document.querySelector('#interest-rate');
const termInput = document.querySelector('#loan-term');
const monthlyPayment = document.querySelector('#monthly-payment');
const totalPayment = document.querySelector('#total-payment');
const totalInterest = document.querySelector('#total-interest');
const calculatorResult = document.querySelector('.calculator-result');
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const ratesByTerm = {
    36: 6.5,
    48: 7,
    60: 7.5,
    72: 8.25,
    84: 9
};

function calculateLoan(shouldHighlight = false) {
    const amount = Number(amountInput.value);
    const months = Number(termInput.value);
    const annualRate = ratesByTerm[months];
    const monthlyRate = annualRate / 100 / 12;
    const payment = monthlyRate === 0
        ? amount / months
        : amount * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
    const repayment = payment * months;

    monthlyPayment.textContent = currency.format(payment);
    totalPayment.textContent = currency.format(repayment);
    totalInterest.textContent = currency.format(repayment - amount);
    rateDisplay.textContent = `${annualRate}%`;
    if (shouldHighlight) {
        calculatorResult.classList.remove('is-calculated');
        calculatorResult.classList.add('is-resetting');
        void calculatorResult.offsetWidth;
        calculatorResult.classList.remove('is-resetting');
        calculatorResult.classList.add('is-calculated');
    }
}

calculator.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateLoan(true);
});

[amountInput, termInput].forEach((input) => input.addEventListener('input', calculateLoan));
calculateLoan();