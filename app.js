// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('no-scroll');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ===== SCROLL REVEAL =====
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
  '.pricing-card', '.testimonial-card', '.why-item',
  '.trust-badge', '.section-header', '.contact-info', '.contact-form',
  '.comparison-container', '.faq-item', '.better-side', 'section.reveal'
];
document.querySelectorAll(revealSelectors.join(', ')).forEach((el, i) => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== SERVICE CATEGORY FILTER =====
const catBtns = document.querySelectorAll('.cat-btn');
const serviceCards = document.querySelectorAll('.service-card');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-cat');

    serviceCards.forEach(card => {
      const cardCat = card.getAttribute('data-cat');
      if (cat === 'all' || cardCat === cat) {
        card.classList.remove('hidden');
        card.classList.add('card-anim');
        setTimeout(() => card.classList.remove('card-anim'), 400);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.innerHTML = `<span>${currentLang === 'en' ? 'Sending...' : 'भेज रहे हैं...'}</span>`;
  submitBtn.style.opacity = '0.8';
  submitBtn.disabled = true;

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    business: document.getElementById('business').value,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      formSuccess.style.color = '#4ade80';
      formSuccess.style.backgroundColor = 'rgba(74,222,128,0.1)';
      formSuccess.style.borderColor = 'rgba(74,222,128,0.3)';
      
      const waMsg = encodeURIComponent(`Hi BrandBazi! I'm ${formData.name}. I just submitted an enquiry for ${formData.service} on your website. Let's discuss!`);
      const waLink = `https://wa.me/917250538660?text=${waMsg}`;
      
      formSuccess.innerHTML = `
        <div style="margin-bottom:12px">✅ ${data.message}</div>
        <a href="${waLink}" target="_blank" class="wa-success-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Chat on WhatsApp for Fast Reply
        </a>
      `;
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Something went wrong.');
    }
  } catch (error) {
    formSuccess.style.color = '#ef4444';
    formSuccess.style.backgroundColor = 'rgba(239,68,68,0.1)';
    formSuccess.style.borderColor = 'rgba(239,68,68,0.3)';
    formSuccess.innerHTML = '❌ ' + error.message;
  } finally {
    formSuccess.style.display = 'block';
    const submitText = translations[currentLang]['form-submit'];
    submitBtn.innerHTML = `<span>${submitText}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;

    setTimeout(() => {
      formSuccess.style.display = 'none';
      formSuccess.style.color = '';
      formSuccess.style.backgroundColor = '';
      formSuccess.style.borderColor = '';
    }, 5000);
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});



// ===== CUSTOM CURSOR SYSTEM =====
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.className = 'custom-cursor';
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant dot position
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth ring animation
function animateCursor() {
  let distX = mouseX - cursorX;
  let distY = mouseY - cursorY;
  
  cursorX = cursorX + (distX * 0.15);
  cursorY = cursorY + (distY * 0.15);
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect for links and buttons
document.querySelectorAll('a, button, .service-card, .portfolio-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    cursorDot.classList.add('dot-hide');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    cursorDot.classList.remove('dot-hide');
  });
});

// ===== ADD KEYFRAMES & GLOBAL REVEAL =====
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ===== CUSTOM CURSOR STYLES ===== */
  @media (pointer: fine) {
    body { cursor: none; }
    a, button { cursor: none; }

    .custom-cursor {
      width: 40px;
      height: 40px;
      border: 1.5px solid var(--accent);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 10001;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, background-color 0.3s, border-color 0.3s;
    }

    .cursor-dot {
      width: 6px;
      height: 6px;
      background-color: var(--accent-2);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 10002;
      transform: translate(-50%, -50%);
    }

    .cursor-hover {
      width: 70px;
      height: 70px;
      background-color: rgba(124,58,237,0.1);
      border-color: var(--accent-2);
    }

    .dot-hide {
      opacity: 0;
    }
  }

  /* Fallback for touch devices */
  @media (pointer: coarse) {
    .custom-cursor, .cursor-dot { display: none; }
    body { cursor: auto; }
  }
`;
document.head.appendChild(styleEl);

// ===== MULTILINGUAL SUPPORT (EN / HI) =====
const translations = {
  en: {
    // Nav
    'nav-services': 'Services',
    'nav-process': 'Process',
    'nav-portfolio': 'Portfolio',
    'nav-pricing': 'Pricing',
    'nav-quote': 'Get a Quote',
    'cat-all': 'All Services',
    'cat-branding': 'Branding',
    'cat-digital': 'Digital',
    'cat-print': 'Print',
    // Hero
    'hero-badge': 'Available for New Projects',
    'hero-title': 'We Build <span class=\"gradient-text\">Digital Identity</span><br/> For Every Business',
    'hero-subtitle': 'From a local chai shop to a shopping mall &mdash; we create <strong>logos, banners, menus &amp; websites</strong> that make your brand unforgettable. Delivered on time.',
    'hero-btn-start': 'Start Your Project',
    'hero-btn-work': 'View Our Work',
    // Trust
    'trust-label': 'We work with businesses of all sizes',
    'trust-local': '&#127978; Local Shops',
    'trust-rect': '&#127869; Restaurants',
    'trust-super': '&#128722; Supermarkets',
    'trust-malls': '&#127980; Malls',
    'trust-startups': '&#128188; Startups',
    'trust-clinics': '&#127973; Clinics',
    'trust-inst': '&#127891; Institutes',
    'trust-hotels': '&#127976; Hotels',
    // Services
    'services-tag': 'What We Do',
    'services-title': 'Services That <span class=\"gradient-text\">Grow Your Brand</span>',
    'services-subtitle': 'Everything your business needs to look professional and attract more customers',
    'svc-logo-title': 'Logo &amp; Brand Identity',
    'svc-logo-desc': 'Unique, memorable logos that represent your brand perfectly. Includes multiple variations for print and digital use.',
    'svc-logo-f1': '&#10003; 3 unique concepts',
    'svc-logo-f2': '&#10003; Unlimited revisions',
    'svc-logo-f3': '&#10003; All file formats (PNG, SVG, PDF)',
    'svc-logo-f4': '&#10003; Brand color palette',
    'svc-banner-title': 'Banner &amp; Poster Design',
    'svc-banner-desc': 'Eye-catching banners for shops, events, festivals, sales promotions and social media campaigns.',
    'svc-banner-f1': '&#10003; Print-ready files',
    'svc-banner-f2': '&#10003; Social media sizes',
    'svc-banner-f3': '&#10003; Festival/Event banners',
    'svc-banner-f4': '&#10003; Flex/Vinyl banners',
    'svc-get-started': 'Get Started &rarr;',
    'svc-web-title': 'Website Development',
    'svc-web-desc': 'Professional websites for your business that look great on mobile &amp; desktop. From landing pages to full e-commerce stores.',
    'svc-web-f1': '&#10003; Mobile responsive design',
    'svc-web-f2': '&#10003; Contact form &amp; WhatsApp',
    'svc-web-f3': '&#10003; SEO optimized',
    'svc-web-f4': '&#10003; 1 year free support',
    'svc-menu-title': 'Menu &amp; Catalogue Design',
    'svc-menu-desc': 'Beautiful menus for restaurants, cafes, hotels and product catalogues for any business type.',
    'svc-menu-f1': '&#10003; Print &amp; digital versions',
    'svc-menu-f2': '&#10003; QR code menus',
    'svc-menu-f3': '&#10003; Food photography layout',
    'svc-menu-f4': '&#10003; Easy to update',
    'svc-social-title': 'Social Media &amp; Marketing',
    'svc-social-desc': 'Complete social media branding &ndash; profile setup, post templates, stories, reels covers and ad creatives.',
    'svc-social-f1': '&#10003; Instagram, Facebook, YouTube',
    'svc-social-f2': '&#10003; Post templates (30/month)',
    'svc-social-f3': '&#10003; Story highlights covers',
    'svc-social-f4': 'Ad creative design',
    'svc-gmb-title': 'Google Business Profile',
    'svc-gmb-desc': 'Boost your local presence! We set up and optimize your Google Maps profile to attract nearby customers.',
    'svc-gmb-f1': '&#10003; Maps & Search verification',
    'svc-gmb-f2': '&#10003; Portfolio & Photo upload',
    'svc-gmb-f3': '&#10003; Local SEO optimization',
    'svc-gmb-f4': '&#10003; Review management setup',
    'svc-ent-pkg': 'Complete Business Package',
    // Process
    'process-tag': 'How It Works',
    'process-title': 'Simple <span class=\"gradient-text\">4-Step Process</span>',
    'process-subtitle': 'From idea to delivery &mdash; fast and hassle-free',
    'step1-title': 'Discuss Requirements',
    'step1-desc': "Tell us about your business and what you need. We'll understand your vision and goals through a quick call or chat.",
    'step2-title': 'Get a Custom Quote',
    'step2-desc': "We'll send you a detailed quote with timeline and pricing based on your specific requirements. No hidden charges.",
    'step3-title': 'We Create &amp; Revise',
    'step3-desc': "Our team starts working immediately. You'll get regular updates and can request changes until you're 100% satisfied.",
    'step4-title': 'Deliver On Time',
    'step4-desc': 'Your project is delivered within the agreed timeline with all files and support documentation. Ready to use!',
    // Portfolio (Expertise Showcase)
    'portfolio-tag': 'Design Showcase',
    'portfolio-title': 'What We Can <span class=\"gradient-text\">Build For You</span>',
    'portfolio-subtitle': 'Take a look at the premium quality and styles we can deliver for your brand',
    'port-filter-all': 'All',
    'port-filter-logo': 'Logo',
    'port-filter-banner': 'Banner',
    'port-filter-web': 'Website',
    'port-filter-menu': 'Menu',
    'port-1-title': 'Royal Curry',
    'port-1-desc': 'Premium Restaurant Branding',
    'port-2-title': 'BioOrganics',
    'port-2-desc': 'Healthy Lifestyle E-commerce',
    'port-3-title': 'Homely Decor',
    'port-3-desc': 'Sale &amp; Event Banner',
    'port-4-title': 'FoodieExpress',
    'port-4-desc': 'Contactless Digital Menu',
    'port-5-title': 'The Shoe Lab',
    'port-5-desc': 'Retail Brand Identity',
    'port-6-title': 'SuperMegamart',
    'port-6-desc': 'Festive Season Banners',
    // Pricing
    'pricing-tag': 'Pricing Plans',
    'pricing-title': 'Transparent <span class=\"gradient-text\">Pricing</span>',
    'pricing-subtitle': 'Choose a plan that fits your budget. Custom quotes also available!',
    'plan-starter-name': 'Starter',
    'plan-starter-desc': 'Perfect for small local shops',
    'plan-starter-f1': 'Logo Design (1 concept)',
    'plan-starter-f2': '2 Banner Designs',
    'plan-starter-f3': 'Business Card Design',
    'plan-starter-f4': '3 Revisions',
    'plan-starter-f5': '3 Day Delivery',
    'plan-starter-btn': 'Choose Starter',
    'plan-pro-name': 'Professional',
    'plan-pro-desc': 'Best for growing businesses',
    'plan-pro-f1': 'Complete Brand Identity',
    'plan-pro-f2': '5 Banner Designs',
    'plan-pro-f3': 'Menu Design (up to 20 items)',
    'plan-pro-f4': '5-Page Website',
    'plan-pro-f5': 'Unlimited Revisions',
    'plan-pro-f6': '7 Day Delivery',
    'plan-pro-btn': 'Choose Professional',
    'plan-ent-name': 'Enterprise',
    'plan-ent-desc': 'For large businesses &amp; chains',
    'plan-ent-f1': 'Full Brand Strategy',
    'plan-ent-f2': 'Unlimited Banners',
    'plan-ent-f3': 'Full Menu System',
    'plan-ent-f4': 'Custom Website',
    'plan-ent-f5': 'Social Media Setup',
    'plan-ent-f6': '6 Month Support',
    'plan-ent-btn': 'Contact Us',
    'plan-popular': '&#11088; Most Popular',
    'plan-no-web': 'Website',
    'price-period': '/project',
    'price-custom': 'Custom',
    'compare-title': 'Detailed Plan Comparison',
    'feat-logo': 'Logo Concepts',
    'feat-logo-s': '1 Concept',
    'feat-logo-p': '3 Concepts',
    'feat-revisions': 'Revisions',
    'feat-website': 'Website',
    'feat-website-p': '5 Pages',
    'feat-website-e': 'Custom App/Web',
    'feat-delivery': 'Delivery Time',
    'feat-delivery-s': '3 Days',
    'feat-delivery-p': '7 Days',
    'feat-delivery-e': 'Priority',
    'pricing-note': '&#128161; <strong>Note:</strong> All prices are starting rates. Final price depends on project complexity. We always give a detailed quote before starting!',
    // FAQ
    'faq-tag': 'Questions?',
    'faq-title': 'Frequently Asked <span class=\"gradient-text\">Questions</span>',
    'faq-subtitle': 'Everything you need to know about starting your project with BrandBazi',
    'faq-q1': 'How much time does it take for a logo?',
    'faq-a1': 'Usually, we deliver the first concepts within 24-48 hours. The final project duration depends on the number of revisions.',
    'faq-q2': 'Will I get the source files?',
    'faq-a2': 'Yes, absolutely! We provide all professional source files (AI, SVG, PNG, PDF) for your designs, ready for both web and high-quality printing.',
    'faq-q3': 'Do you provide printing services?',
    'faq-a3': 'We are a design agency, but we have local printing partners. We can manage the printing and delivery process for you upon request!',
    'faq-q4': 'How many revisions can I ask for?',
    'faq-a4': 'We offer unlimited revisions in our Pro and Enterprise plans because your 100% satisfaction is our top priority.',
    'faq-q5': 'How do I pay?',
    'faq-a5': 'We accept UPI, Bank Transfer, and all major digital payment methods in India. Usually, we start with a 50% advance for new projects.',
    'wa-tooltip': 'Need Help? Chat with us',
    // Why Us
    'why-tag': 'Why Us?',
    'why-title': 'We\'re Different <span class=\"gradient-text\">Here\'s Why</span>',
    'why1-title': 'Lightning Fast Delivery',
    'why1-desc': 'Most projects delivered within 3-7 days. Rush delivery also available!',
    'why2-title': '100% Satisfaction',
    'why2-desc': 'We revise until you love it. No extra charges for revisions.',
    'why3-title': 'Direct Communication',
    'why3-desc': 'Talk directly with the designer. No middlemen, no confusion.',
    'why4-title': 'Honest Pricing',
    'why4-desc': 'Clear pricing upfront. No hidden charges, ever.',
    'why5-title': 'Your Files, Always',
    'why5-desc': 'All source files and formats handed over to you after delivery.',
    'why6-title': 'Long-term Support',
    'why6-desc': "We're here even after delivery for any changes or updates.",
    // Better Than
    'better-tag': 'Why Choose Us vs Local Print Shops?',
    'better-title': 'The <span class=\"gradient-text\">Premium Advantage</span>',
    'better-local-title': 'Local Print Shop',
    'better-local-f1': '<span>&cross;</span> Low resolution, blurry designs',
    'better-local-f2': '<span>&cross;</span> Same generic clip-art for everyone',
    'better-local-f3': '<span>&cross;</span> Won\'t give you source files',
    'better-local-f4': '<span>&cross;</span> Takes 3-5 days to make changes',
    'better-local-f5': '<span>&cross;</span> No digital integration (No Smart QR)',
    'better-premium-title': 'BrandBazi',
    'better-premium-f1': '<span>&check;</span> Ultra-HD Premium Quality',
    'better-premium-f2': '<span>&check;</span> Custom, unique brand identity',
    'better-premium-f3': '<span>&check;</span> All Source Files (AI, SVG, PDF)',
    'better-premium-f4': '<span>&check;</span> Priority changes in hours',
    'better-premium-f5': '<span>&check;</span> Smart QR-Code Integration',
    // Contact
    'contact-tag': 'Get In Touch',
    'contact-title': 'Let\'s Build Something <span class=\"gradient-text\">Amazing Together</span>',
    'contact-subtitle': "Tell us about your project and we'll get back to you within 24 hours",
    'contact-quick': 'Quick Contact',
    'contact-wa': 'WhatsApp',
    'contact-email': 'Email',
    'contact-hours': 'Working Hours',
    'contact-loc': 'Location',
    'contact-loc-val': 'India (Remote Services Everywhere)',
    'contact-chat': 'Chat on WhatsApp',
    'form-name': 'Your Name *',
    'form-email': 'Email Address *',
    'form-phone': 'Phone / WhatsApp *',
    'form-biz-type': 'Business Type',
    'form-svc-label': 'Service Needed *',
    'form-svc-default': 'Select a service...',
    'form-msg-label': 'Tell us about your project',
    'form-submit': 'Send Message',
    'form-success': '&check; Message sent! We\'ll contact you within 24 hours.',
    'ph-name': 'Your Name',
    'ph-email': 'example@email.com',
    'ph-phone': 'Your Number',
    'ph-biz': 'e.g. Restaurant, Shop',
    'ph-msg': 'Describe your requirements, preferred colors, style, deadline, etc.',
    // Footer
    'footer-desc': 'Making every business look premium &ndash; from small shops to large enterprises.',
    'founded-by': 'Founded by',
    'founder-title': 'Founder',
    'co-founder-title': 'Co-Founder',
    'footer-company': 'Company',
    'footer-wa': 'WhatsApp Us',
    'footer-email': 'Email Us',
    'footer-hours': 'Mon&ndash;Sat, 9AM&ndash;8PM',
    'footer-rights': '&copy; 2026 BrandBazi. All rights reserved. | Made with &#10084;&#65039; in India',
  },
  hi: {
    // Nav
    'nav-services': 'सेवाएँ',
    'nav-process': 'प्रक्रिया',
    'nav-portfolio': 'पोर्टफोलियो',
    'nav-pricing': 'मूल्य',
    'nav-quote': 'कोटेशन लें',
    'cat-all': 'सभी सेवाएँ',
    'cat-branding': 'ब्रांडिंग',
    'cat-digital': 'डिजिटल',
    'cat-print': 'प्रिंट',
    // Hero
    'hero-badge': 'नए प्रोजेक्ट्स के लिए उपलब्ध',
    'hero-title': 'हम बनाते हैं <span class=\"gradient-text\">डिजिटल पहचान</span><br/> हर व्यवसाय के लिए',
    'hero-subtitle': 'एक छोटी चाय की दुकान से लेकर बड़े मॉल तक &mdash; हम बनाते हैं <strong>लोगो, बैनर, मेनू और वेबसाइट</strong> जो आपके ब्रांड को यादगार बनाएं। समय पर डिलीवरी।',
    'hero-btn-start': 'प्रोजेक्ट शुरू करें',
    'hero-btn-work': 'हमारा काम देखें',
    // Trust
    'trust-label': 'हम हर आकार के व्यवसायों के साथ काम करते हैं',
    'trust-local': '&#127978; स्थानीय दुकानें',
    'trust-rect': '&#127869; रेस्टोरेंट',
    'trust-super': '&#128722; सुपरमार्केट',
    'trust-malls': '&#127980; मॉल',
    'trust-startups': '&#128188; स्टार्टअप',
    'trust-clinics': '&#127973; क्लीनिक',
    'trust-inst': '&#127891; संस्थान',
    'trust-hotels': '&#127976; होटल',
    // Services
    'services-tag': 'हम क्या करते हैं',
    'services-title': 'सेवाएँ जो <span class=\"gradient-text\">आपका ब्रांड बढ़ाएँ</span>',
    'services-subtitle': 'आपके व्यवसाय को प्रोफेशनल दिखाने के लिए सब कुछ',
    'svc-logo-title': 'लोगो और ब्रांड आइडेंटिटी',
    'svc-logo-desc': 'अनोखे और यादगार लोगो जो आपके ब्रांड को पूरी तरह से दर्शाते हैं। प्रिंट और डिजिटल दोनों के लिए वेरिएशन शामिल हैं।',
    'svc-logo-f1': '&#10003; 3 अनोखे कॉन्सेप्ट',
    'svc-logo-f2': '&#10003; असीमित सुधार',
    'svc-logo-f3': '&#10003; सभी फ़ाइल फ़ॉर्मेट (PNG, SVG, PDF)',
    'svc-logo-f4': '&#10003; ब्रांड कलर पैलेट',
    'svc-banner-title': 'बैनर और पोस्टर डिजाइन',
    'svc-banner-desc': 'दुकानों, कार्यक्रमों, त्योहारों और सोशल मीडिया के लिए आकर्षक बैनर।',
    'svc-banner-f1': '&#10003; प्रिंट के लिए तैयार फाइलें',
    'svc-banner-f2': '&#10003; सोशल मीडिया साइज',
    'svc-banner-f3': '&#10003; त्योहार/इवेंट बैनर',
    'svc-banner-f4': '&#10003; फ्लेक्स/विनाइल बैनर',
    'svc-get-started': 'शुरू करें &rarr;',
    'svc-web-title': 'वेबसाइट डेवलपमेंट',
    'svc-web-desc': 'आपके व्यवसाय के लिए प्रोफेशनल वेबसाइट जो मोबाइल और डेस्कटॉप पर अच्छी दिखे।',
    'svc-web-f1': '&#10003; मोबाइल रिस्पॉन्सिव डिजाइन',
    'svc-web-f2': '&#10003; कॉन्टैक्ट फॉर्म और व्हाट्सएप',
    'svc-web-f3': '&#10003; SEO ऑप्टिमाइज्ड',
    'svc-web-f4': '&#10003; 1 साल फ्री सपोर्ट',
    'svc-menu-title': 'मेनू और कैटलॉग डिजाइन',
    'svc-menu-desc': 'रेस्टोरेंट, कैफे और होटलों के लिए सुंदर मेनू और किसी भी व्यवसाय के लिए प्रोडक्ट कैटलॉग।',
    'svc-menu-f1': '&#10003; प्रिंट और डिजिटल वर्जन',
    'svc-menu-f2': '&#10003; QR कोड मेनू',
    'svc-menu-f3': '&#10003; फूड फोटोग्राफी लेआउट',
    'svc-menu-f4': '&#10003; अपडेट करने में आसान',
    'svc-social-title': 'सोशल मीडिया और मार्केटिंग',
    'svc-social-desc': 'पूरी सोशल मीडिया ब्रांडिंग - प्रोफाइल सेटअप, पोस्ट टेम्प्लेट और विज्ञापन डिजाइन।',
    'svc-social-f1': '&#10003; इंस्टाग्राम, फेसबुक, यूट्यूब',
    'svc-social-f2': '&#10003; पोस्ट टेम्प्लेट (30/महीना)',
    'svc-social-f3': '&#10003; स्टोरी हाईलाइट्स कवर',
    'svc-social-f4': 'ऐड क्रिएटिव डिजाइन',
    'svc-gmb-title': 'गूगल बिजनेस प्रोफाइल',
    'svc-gmb-desc': 'अपने स्थानीय व्यवसाय को बढ़ाएं! हम आपके गूगल मैप्स प्रोफाइल को सेट और ऑप्टिमाइज़ करते हैं।',
    'svc-gmb-f1': '&#10003; मैप्स और सर्च वेरिफिकेशन',
    'svc-gmb-f2': '&#10003; पोर्टफोलियो और फोटो अपलोड',
    'svc-gmb-f3': '&#10003; लोकल SEO ऑप्टिमाइजेशन',
    'svc-gmb-f4': '&#10003; रिव्यू मैनेजमेंट सेटअप',
    'svc-ent-pkg': 'कम्पलीट बिज़नेस पैकेज',
    // Process
    'process-tag': 'कैसे काम करता है',
    'process-title': 'सरल <span class=\"gradient-text\">4 स्टेप प्रक्रिया</span>',
    'process-subtitle': 'आइडिया से डिलीवरी तक &mdash; तेज़ और बिना किसी परेशानी के',
    'step1-title': 'जरूरतों पर चर्चा',
    'step1-desc': 'अपने व्यवसाय के बारे में बताएं। हम एक कॉल या चैट से आपकी ज़रूरतें समझेंगे।',
    'step2-title': 'कोटेशन पाएँ',
    'step2-desc': 'हम आपको समयसीमा और मूल्य के साथ विस्तृत कोटेशन भेजेंगे। कोई छिपे हुए चार्ज नहीं।',
    'step3-title': 'हम बनाएंगे और सुधारेंगे',
    'step3-desc': 'हमारी टीम तुरंत काम शुरू करती है। आपको रेगुलर अपडेट मिलेंगे और आप सुधार करवा सकते हैं।',
    'step4-title': 'समय पर डिलीवरी',
    'step4-desc': 'आपका प्रोजेक्ट तय समय में सभी फाइलों के साथ डिलीवर होता है। उपयोग के लिए तैयार!',
    // Portfolio (Expertise Showcase)
    'portfolio-tag': 'डिजाइन प्रदर्शन',
    'portfolio-title': 'हम आपके लिए <span class=\"gradient-text\">क्या बना सकते हैं</span>',
    'portfolio-subtitle': 'उन प्रीमियम डिजाइनों की एक झलक जो हम आपके ब्रांड के लिए तैयार कर सकते हैं',
    'port-filter-all': 'सभी',
    'port-filter-logo': 'लोगो',
    'port-filter-banner': 'बैनर',
    'port-filter-web': 'वेबसाइट',
    'port-filter-menu': 'मेनू',
    'port-1-title': 'रॉयल करी',
    'port-1-desc': 'प्रीमियम रेस्टोरेंट ब्रांडिंग',
    'port-2-title': 'बायोऑर्गेनिक',
    'port-2-desc': 'हेल्दी लाइफस्टाइल ई-कॉमर्स',
    'port-3-title': 'होमेली डेकोर',
    'port-3-desc': 'सेल और इवेंट बैनर',
    'port-4-title': 'फूडीएक्सप्रेस',
    'port-4-desc': 'कॉन्टैक्टलेस डिजिटल मेनू',
    'port-5-title': 'द शू लैब',
    'port-5-desc': 'रिटेल ब्रांड आइडेंटिटी',
    'port-6-title': 'सुपरमेगामार्ट',
    'port-6-desc': 'फेस्टिव सीजन बैनर',
    // Pricing
    'pricing-tag': 'मूल्य योजनाएँ',
    'pricing-title': 'पारदर्शी <span class=\"gradient-text\">मूल्य</span>',
    'pricing-subtitle': 'अपने बजट के अनुसार प्लान चुनें। कस्टम कोटेशन भी उपलब्ध!',
    'plan-starter-name': 'स्टार्टर',
    'plan-starter-desc': 'छोटी स्थानीय दुकानों के लिए सही',
    'plan-starter-f1': 'लोगो डिजाइन (1 कॉन्सेप्ट)',
    'plan-starter-f2': '2 बैनर डिजाइन',
    'plan-starter-f3': 'बिजनेस कार्ड डिजाइन',
    'plan-starter-f4': '3 सुधार (Revisions)',
    'plan-starter-f5': '3 दिन में डिलीवरी',
    'plan-starter-btn': 'स्टार्टर चुनें',
    'plan-pro-name': 'प्रोफेशनल',
    'plan-pro-desc': 'बढ़ते व्यवसायों के लिए सर्वश्रेष्ठ',
    'plan-pro-f1': 'पूरी ब्रांड पहचान',
    'plan-pro-f2': '5 बैनर डिजाइन',
    'plan-pro-f3': 'मेनू डिजाइन (20 आइटम तक)',
    'plan-pro-f4': '5-पेज की वेबसाइट',
    'plan-pro-f5': 'असीमित सुधार',
    'plan-pro-f6': '7 दिन में डिलीवरी',
    'plan-pro-btn': 'प्रोफेशनल चुनें',
    'plan-ent-name': 'एंटरप्राइज',
    'plan-ent-desc': 'बड़े व्यवसायों और चेन के लिए',
    'plan-ent-f1': 'पूरी ब्रांड रणनीति',
    'plan-ent-f2': 'असीमित बैनर',
    'plan-ent-f3': 'पूरा मेनू सिस्टम',
    'plan-ent-f4': 'कस्टम वेबसाइट',
    'plan-ent-f5': 'सोशल मीडिया सेटअप',
    'plan-ent-f6': '6 महीने का सपोर्ट',
    'plan-ent-btn': 'संपर्क करें',
    'plan-popular': '&#11088; सबसे लोकप्रिय',
    'plan-no-web': 'वेबसाइट',
    'price-period': '/प्रोजेक्ट',
    'price-custom': 'कस्टम',
    'compare-title': 'विस्तृत प्लान तुलना',
    'feat-logo': 'लोगो कॉन्सेप्ट',
    'feat-logo-s': '1 कॉन्सेप्ट',
    'feat-logo-p': '3 कॉन्सेप्ट',
    'feat-revisions': 'सुधार (Revisions)',
    'feat-website': 'वेबसाइट',
    'feat-website-p': '5 पेज',
    'feat-website-e': 'कस्टम ऐप/वेब',
    'feat-delivery': 'डिलीवरी का समय',
    'feat-delivery-s': '3 दिन',
    'feat-delivery-p': '7 दिन',
    'feat-delivery-e': 'प्राथमिकता (Priority)',
    'pricing-note': '&#128161; <strong>नोट:</strong> सभी कीमतें शुरुआती दरें हैं। अंतिम कीमत प्रोजेक्ट की जटिलता पर निर्भर करती है।',
    // FAQ
    'faq-tag': 'सवाल?',
    'faq-title': 'अक्सर पूछे जाने वाले <span class=\"gradient-text\">सवाल</span>',
    'faq-subtitle': 'BrandBazi के साथ अपना प्रोजेक्ट शुरू करने के लिए वह सब कुछ जो आपको जानना चाहिए',
    'faq-q1': 'लोगो बनाने में कितना समय लगता है?',
    'faq-a1': 'आमतौर पर, हम 24-48 घंटों के भीतर पहले कॉन्सेप्ट की डिलीवरी करते हैं। अंतिम समय सुधारों (रिवीजन) की संख्या पर निर्भर करता है।',
    'faq-q2': 'क्या मुझे सोर्स फाइलें मिलेंगी?',
    'faq-a2': 'जी हाँ, बिल्कुल! हम आपके डिजाइन के लिए सभी प्रोफेशनल सोर्स फाइलें (AI, SVG, PNG, PDF) प्रदान करेंगे।',
    'faq-q3': 'क्या आप प्रिंटिंग की सेवाएँ देते हैं?',
    'faq-a3': 'हम एक डिजाइन एजेंसी हैं, लेकिन हमारे पास लोकल प्रिंटिंग पार्टनर्स हैं। हम आपकी मांग पर प्रिंटिंग और डिलीवरी की व्यवस्था कर सकते हैं।',
    'faq-q4': 'मैं कितनी बार सुधार (रविजन) के लिए कह सकता हूँ?',
    'faq-a4': 'हम अपने प्रो और एंटरप्राइज प्लान में असीमित रिवीजन की सुविधा देते हैं क्योंकि आपकी संतुष्टि हमारी प्राथमिकता है।',
    'faq-q5': 'मैं भुगतान कैसे करूँ?',
    'faq-a5': 'हम UPI, बैंक ट्रांसफर और भारत के सभी मुख्य डिजिटल पेमेंट मेथड्स स्वीकार करते हैं।',
    'wa-tooltip': 'मदद चाहिए? हमसे चैट करें',
    // Why Us
    'why-tag': 'हमें क्यों चुनें?',
    'why-title': 'हम अलग क्यों हैं <span class=\"gradient-text\">यहाँ जानें</span>',
    'why1-title': 'बिजली की तरह तेज़ डिलीवरी',
    'why1-desc': 'अधिकांश प्रोजेक्ट 3-7 दिनों में डिलीवर। तत्काल डिलीवरी भी उपलब्ध!',
    'why2-title': '100% संतुष्टि',
    'why2-desc': 'जब तक आप खुश नहीं होते, हम सुधार करते हैं। कोई अतिरिक्त शुल्क नहीं।',
    'why3-title': 'सीधा संपर्क',
    'why3-desc': 'डिजाइनर से सीधे बात करें। कोई बिचौलिया नहीं, कोई भ्रम नहीं।',
    'why4-title': 'ईमानदार मूल्य',
    'why4-desc': 'सब कुछ पारदर्शी। कोई छिपे हुए शुल्क नहीं।',
    'why5-title': 'आपकी फाइलें, हमेशा',
    'why5-desc': 'डिलीवरी के बाद सभी सोर्स फाइलें आपको दे दी जाती हैं।',
    'why6-title': 'लंबे समय का साथ',
    'why6-desc': 'डिलीवरी के बाद भी किसी भी बदलाव के लिए हम यहाँ हैं।',
    // Better Than
    'better-tag': 'लोकल प्रिंट शॉप बनाम BrandBazi?',
    'better-title': 'हमारा <span class=\"gradient-text\">प्रीमियम फायदा</span>',
    'better-local-title': 'लोकल प्रिंट शॉप',
    'better-local-f1': '<span>&cross;</span> कम क्वालिटी, धुंधले डिजाइन',
    'better-local-f2': '<span>&cross;</span> सबके लिए वही पुराने डिजाइन',
    'better-local-f3': '<span>&cross;</span> सोर्स फाइलें नहीं देते',
    'better-local-f4': '<span>&cross;</span> बदलाव में हफ़्तों लगते हैं',
    'better-local-f5': '<span>&cross;</span> कोई स्मार्ट QR सिस्टम नहीं',
    'better-premium-title': 'BrandBazi',
    'better-premium-f1': '<span>&check;</span> अल्ट्रा-HD प्रीमियम क्वालिटी',
    'better-premium-f2': '<span>&check;</span> अनोखे और कस्टम डिजाइन',
    'better-premium-f3': '<span>&check;</span> सभी सोर्स फाइलें (AI, SVG, PDF)',
    'better-premium-f4': '<span>&check;</span> कुछ ही घंटों में बदलाव',
    'better-premium-f5': '<span>&check;</span> स्मार्ट QR-कोड इंटीग्रेशन',
    // Contact
    'contact-tag': 'संपर्क करें',
    'contact-title': 'आइए मिलकर <span class=\"gradient-text\">कुछ शानदार बनाएं</span>',
    'contact-subtitle': 'अपने प्रोजेक्ट के बारे में बताएं, हम 24 घंटे में जवाब देंगे',
    'contact-quick': 'त्वरित संपर्क',
    'contact-wa': 'व्हाट्सएप',
    'contact-email': 'ईमेल',
    'contact-hours': 'कार्य समय',
    'contact-loc': 'स्थान',
    'contact-loc-val': 'भारत (दुनिया भर में रिमोट सेवाएँ)',
    'contact-chat': 'व्हाट्सएप पर बात करें',
    'form-name': 'आपका नाम *',
    'form-email': 'ईमेल पता *',
    'form-phone': 'फोन / व्हाट्सएप *',
    'form-biz-type': 'व्यवसाय का प्रकार',
    'form-svc-label': 'जरूरी सेवा *',
    'form-svc-default': 'सेवा चुनें...',
    'form-msg-label': 'अपने प्रोजेक्ट के बारे में बताएं',
    'form-submit': 'संदेश भेजें',
    'form-success': '&check; संदेश भेज दिया गया! हम जल्द ही संपर्क करेंगे।',
    'ph-name': 'आपका नाम',
    'ph-email': 'example@email.com',
    'ph-phone': 'आपका नंबर',
    'ph-biz': 'जैसे: रेस्टोरेंट, दुकान',
    'ph-msg': 'अपनी जरूरतें, पसंदीदा रंग, स्टाइल आदि बताएं।',
    // Footer
    'footer-desc': 'हर बिजनेस को प्रीमियम लुक देना - छोटी दुकानों से लेकर बड़े उद्यमों तक।',
    'founded-by': 'संस्थापक',
    'founder-title': 'फाउंडर',
    'co-founder-title': 'को-फाउंडर',
    'footer-company': 'कंपनी',
    'footer-wa': 'व्हाट्सएप करें',
    'footer-email': 'ईमेल करें',
    'footer-hours': 'सोम-शनि, सुबह 9 से रात 8 बजे',
    'footer-rights': '&copy; 2026 BrandBazi. सर्वाधिकार सुरक्षित। | भारत में निर्मित &#10084;&#65039;',
  }
};

let currentLang = 'en';

function applyTranslations(lang) {
  const t = translations[lang];
  
  // Update normal elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });
}

const langSwitch = document.getElementById('lang-switch');
if (langSwitch) {
  langSwitch.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    langSwitch.querySelector('.lang-text').textContent = currentLang === 'en' ? 'EN' : 'HI';
    applyTranslations(currentLang);

    // Animate the button
    langSwitch.style.transform = 'scale(0.9)';
    setTimeout(() => { langSwitch.style.transform = 'scale(1)'; }, 200);
  });
}

// FAQ Accordion Logic
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close other items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    
    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Apply initial translations
applyTranslations(currentLang);
