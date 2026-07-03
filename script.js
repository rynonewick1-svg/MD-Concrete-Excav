// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('primary-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }));
}

// Sticky header shrink
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('shrink', window.scrollY > 40);
  }, { passive: true });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  if (item.classList.contains('open')) { a.style.maxHeight = a.scrollHeight + 'px'; }
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.closest('.faq-list, body').querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = 0;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// Gallery filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryTiles = document.querySelectorAll('.gallery-tile');
if (filterBtns.length && galleryTiles.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryTiles.forEach(tile => {
        const match = filter === 'all' || tile.dataset.category === filter;
        tile.classList.toggle('hide', !match);
      });
    });
  });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('.lb-cap');
  const lbClose = lightbox.querySelector('.lb-close');
  document.querySelectorAll('.gallery-tile.is-photo').forEach(tile => {
    tile.addEventListener('click', () => {
      const img = tile.querySelector('img');
      const cap = tile.querySelector('.cap b');
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('open');
    });
  });
  const closeLb = () => lightbox.classList.remove('open');
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

// Quote form -> mailto handoff with validation
const form = document.getElementById('quote-form');
if (form) {
  const msg = document.getElementById('form-msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.phone || !data.email) {
      msg.textContent = 'Please fill in your name, phone and email so we can get back to you.';
      msg.style.color = '#E0AC4C';
      msg.classList.add('show');
      return;
    }
    const subject = encodeURIComponent('Free Quote Request — ' + data.service);
    const body = encodeURIComponent(
      'Name: ' + data.name + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Email: ' + data.email + '\n' +
      'Suburb: ' + (data.suburb || '-') + '\n' +
      'Job type: ' + data.service + '\n\n' +
      'Details:\n' + (data.message || '-')
    );
    window.location.href = 'mailto:info@mdconcreteexcavation.com.au?subject=' + subject + '&body=' + body;
    msg.textContent = 'Thanks — your email app should now be open with the details filled in. Prefer to talk? Call 0423 812 734.';
    msg.style.color = '#C9C0AE';
    msg.classList.add('show');
    form.reset();
  });
}
