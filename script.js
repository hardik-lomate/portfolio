const root = document.documentElement;
const body = document.body;
body.classList.add('js-enabled');

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('DOMContentLoaded', () => {
  body.classList.add('ready');
});

const header = document.getElementById('siteHeader');
root.style.setProperty('--header-h', `${Math.round(header.getBoundingClientRect().height)}px`);

const nav = document.getElementById('mainNav');
const navIndicator = document.getElementById('navIndicator');
const menuToggle = document.getElementById('menuToggle');
const navLinks = [...nav.querySelectorAll('a')];

function closeMenu() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
});

const sectionEls = [...document.querySelectorAll('main section[id]')];

function setActiveLink() {
  const top = window.scrollY + (header.offsetHeight + 48);
  let active = navLinks[0];

  for (const section of sectionEls) {
    if (top >= section.offsetTop) {
      const candidate = navLinks.find((link) => link.getAttribute('href') === `#${section.id}`);
      if (candidate) active = candidate;
    }
  }

  navLinks.forEach((l) => l.classList.toggle('active', l === active));
  if (window.innerWidth > 980 && active) {
    const left = active.offsetLeft;
    navIndicator.style.left = `${left}px`;
    navIndicator.style.top = `${active.offsetTop}px`;
    navIndicator.style.width = `${active.offsetWidth}px`;
    navIndicator.style.height = `${active.offsetHeight}px`;
  }
}

setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', () => {
  root.style.setProperty('--header-h', `${Math.round(header.getBoundingClientRect().height)}px`);
  setActiveLink();
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  scrollCue.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

const backTop = document.getElementById('backTop');
backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
});

const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
const interactiveCards = document.querySelectorAll('.interactive-card');

if (supportsFinePointer && !prefersReduced) {
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--btn-px', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--btn-py', `${e.clientY - rect.top}px`);
    });
  });

  const tiltTarget = document.querySelector('[data-tilt]');
  tiltTarget?.addEventListener('mousemove', (e) => {
    const rect = tiltTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 6;
    const rx = (0.5 - py) * 5;
    tiltTarget.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  tiltTarget?.addEventListener('mouseleave', () => {
    tiltTarget.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  });
}

const particleWrap = document.getElementById('floatingParticles');
if (particleWrap && !prefersReduced) {
  const count = window.innerWidth < 700 ? 12 : 26;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const left = Math.random() * 100;
    const delay = Math.random() * 18;
    const duration = 16 + Math.random() * 26;
    dot.style.left = `${left}%`;
    dot.style.bottom = `${-10 - Math.random() * 30}px`;
    dot.style.animationDelay = `${delay}s`;
    dot.style.animationDuration = `${duration}s`;
    dot.style.opacity = String(0.25 + Math.random() * 0.55);
    particleWrap.appendChild(dot);
  }
}

const mailForm = document.getElementById('mailForm');
mailForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(mailForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim() || 'Portfolio Inquiry';
  const message = formData.get('message')?.toString().trim();

  const bodyText = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');
  const mailto = `mailto:hardiklomate53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  window.location.href = mailto;
});
