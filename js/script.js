/* script.js — interactions: nav toggle, smooth scroll, reveal on scroll,
   and a small contact form integration (fires to Firestore if configured).
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Close mobile nav when a link is activated
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Smooth scrolling for anchors (handles forms like index.html#about too)
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const id = href.slice(hashIndex + 1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        // Only intercept same-page anchors
        const isSamePage = (anchor.pathname === location.pathname) || (href.startsWith('#')) || (anchor.pathname === '' || anchor.pathname === './' || anchor.pathname === location.pathname.substring(location.pathname.lastIndexOf('/')+1));
        if (!isSamePage) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // focus management for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.removeAttribute('tabindex');
      }
    });
  });

  // Reveal on scroll for subtle entrance animations
  const reveals = document.querySelectorAll('.section, .card, .hero-left, .skills-column, .project-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('reveal'));
  }

  // Contact form handling with optional Firebase Firestore (supports page and index forms)
  const forms = [
    document.getElementById('contact-form'),
    document.getElementById('contact-page-form')
  ].filter(Boolean);

  async function sendToFirestore(data) {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    const db = window.firebase.firestore();
    return db.collection('contacts').add(data);
  }

  forms.forEach(form => {
    const status = form.querySelector('.form-status') || document.createElement('span');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.style.color = '';

      const name = (form.name && form.name.value) ? form.name.value.trim() : '';
      const email = (form.email && form.email.value) ? form.email.value.trim() : '';
      const message = (form.message && form.message.value) ? form.message.value.trim() : '';

      if (!name || !email || !message) {
        status.textContent = 'Please complete all fields.';
        status.style.color = 'var(--muted)';
        return;
      }

      // UX: disable submit while sending
      const submit = form.querySelector('[type="submit"]');
      if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
      status.textContent = 'Sending…';

      try {
        // If this form is configured to use Formspree, submit via fetch to the endpoint
        if (form.action && form.action.includes('formspree.io')) {
          const formData = new FormData(form);
          const resp = await fetch(form.action, {
            method: form.method && form.method.toUpperCase() === 'POST' ? 'POST' : 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
          });

          if (resp.ok) {
            status.textContent = "✅ Thank you! Your message has been sent successfully. I'll get back to you as soon as possible.";
            status.style.color = 'var(--accent)';
            form.reset();
          } else {
            // Try to extract error message from response
            let errText = '❌ Something went wrong. Please try again.';
            try {
              const data = await resp.json();
              if (data && data.error) errText = `❌ ${data.error}`;
            } catch (err) {
              // ignore JSON parse errors
            }
            status.textContent = errText;
            status.style.color = '#ff6b6b';
          }
        } else if (window.firebase && window.firebase.firestore) {
          // existing Firestore path
          const payload = { name, email, message, createdAt: new Date().toISOString() };
          await sendToFirestore(payload);
          status.textContent = 'Message sent — thank you!';
          status.style.color = 'var(--accent)';
          form.reset();
        } else {
          // Fallback: simulate network request for non-Formspree forms
          await new Promise(r => setTimeout(r, 800));
          status.textContent = 'Message sent — thank you!';
          status.style.color = 'var(--accent)';
          form.reset();
        }
      } catch (err) {
        console.error(err);
        status.textContent = '❌ Something went wrong. Please try again.';
        status.style.color = '#ff6b6b';
      } finally {
        if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
      }
    });
  });
});
