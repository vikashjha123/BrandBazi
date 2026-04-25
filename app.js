// ===== CONFIG & STATE =====
let currentLang = localStorage.getItem('brandbazi_lang') || 'en';
const translations = window.translations || {};

// ===== UTILITIES =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    $('#navbar').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
const spans = $$('#hamburger span');

const toggleMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : navLinks.classList.toggle('open');
    if (forceClose) navLinks.classList.remove('open');
    
    document.body.classList.toggle('no-scroll', isOpen);
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    }
};

hamburger.addEventListener('click', () => toggleMenu());
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(true)));

// ===== SCROLL REVEAL (Optimized) =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

const revealSelectors = [
    '.service-card', '.process-step', '.portfolio-item',
    '.pricing-card', '.why-item', '.trust-badge', 
    '.section-header', '.contact-info', '.contact-form',
    '.comparison-container', '.faq-item', '.better-side', 
    'section.reveal', '.free-audit-banner'
];

$$(revealSelectors.join(', ')).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 50}ms`;
    revealObserver.observe(el);
});

// ===== PORTFOLIO & SERVICE FILTERS =====
const setupFilter = (btnSelector, itemSelector, attr, fadeAnim = false) => {
    const btns = $$(btnSelector);
    const items = $$(itemSelector);

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute(attr);

            items.forEach(item => {
                const val = item.getAttribute(attr) || item.getAttribute('data-category');
                const isMatch = filter === 'all' || val === filter;
                
                if (fadeAnim) {
                    if (isMatch) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    item.classList.toggle('hidden', !isMatch);
                }
            });
        });
    });
};

setupFilter('.filter-btn', '.portfolio-item', 'data-filter', true);
setupFilter('.cat-btn', '.service-card', 'data-cat');

// ===== CONTACT FORM =====
const contactForm = $('#contactForm');
const formSuccess = $('#formSuccess');
const submitBtn = $('#submitBtn');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('span');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    btnText.textContent = currentLang === 'en' ? 'Sending...' : 'भेज रहे हैं...';

    const formData = Object.fromEntries(new FormData(contactForm));

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,12}$/;

    let error = '';
    if (!emailRegex.test(formData.email)) error = currentLang === 'en' ? 'Valid email required.' : 'सही ईमेल जरूरी है।';
    else if (!phoneRegex.test(formData.phone)) error = currentLang === 'en' ? '10-digit phone required.' : '10 अंकों का फोन नंबर दें।';

    if (error) {
        showFormStatus(error, true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        return;
    }

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (data.success) {
            const waMsg = encodeURIComponent(`Hi BrandBazi! I'm ${formData.name}. I just submitted an enquiry for ${formData.service}.`);
            const waLink = `https://wa.me/917250538660?text=${waMsg}`;
            
            showSuccess(data.message, waLink);
            contactForm.reset();
        } else {
            throw new Error(data.message);
        }
    } catch (err) {
        showFormStatus(err.message, true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
});

function showFormStatus(msg, isError = false) {
    formSuccess.style.cssText = `
        display: block;
        color: ${isError ? '#ef4444' : '#4ade80'};
        background: ${isError ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)'};
        border-color: ${isError ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'};
    `;
    formSuccess.innerHTML = (isError ? '❌ ' : '✅ ') + msg;
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
}

function showSuccess(msg, waLink) {
    showFormStatus(msg);
    formSuccess.innerHTML += `
        <br/><a href="${waLink}" target="_blank" class="wa-success-btn">
            Chat on WhatsApp for Fast Reply
        </a>
    `;
}

// ===== CUSTOM CURSOR (Optimized) =====
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'custom-cursor';
    dot.className = 'cursor-dot';
    document.body.append(cursor, dot);

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }
    animate();

    $$( 'a, button, .service-card, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            dot.classList.add('dot-hide');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            dot.classList.remove('dot-hide');
        });
    });
}

// ===== MULTILINGUAL SYSTEM =====
function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;
    
    $$('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerHTML = t[key];
    });

    $$('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key]) el.placeholder = t[key];
    });
    
    document.documentElement.lang = lang;
}

const langBtn = $('#lang-switch');
langBtn?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('brandbazi_lang', currentLang);
    langBtn.querySelector('.lang-text').innerText = currentLang.toUpperCase();
    applyTranslations(currentLang);
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(currentLang);
    if (currentLang === 'hi' && langBtn) {
        langBtn.querySelector('.lang-text').innerText = 'HI';
    }
});

// FAQ Accordion
$$('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const isOpen = item.classList.contains('active');
        $$('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
    });
});
