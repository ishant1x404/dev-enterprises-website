/* DEV ENTERPRISES — site interactions */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initStickyHeader();
    initProjectFilters();
    initLightbox();
    initContactForm();
    initScrollReveal();
  });

  function initMobileNav() {
    const toggle = qs('.nav-toggle');
    const nav = qs('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    qsa('.nav-link', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        nav.classList.remove('nav-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initStickyHeader() {
    const header = qs('.site-header');
    if (!header) return;
    const update = debounce(function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, 10);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initProjectFilters() {
    const filterBar = qs('#project-filters');
    const gallery = qs('#project-gallery');
    if (!filterBar || !gallery) return;

    const buttons = qsa('.filter-btn', filterBar);
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) { item.classList.remove('active'); });
        button.classList.add('active');
        filterProjects(button.dataset.filter, gallery);
      });
    });
  }

  function filterProjects(category, gallery) {
    qsa('.project-thumb', gallery).forEach(function (thumb) {
      const visible = category === 'all' || thumb.dataset.category === category;
      thumb.hidden = !visible;
    });
  }

  function initLightbox() {
    const lightbox = qs('#lightbox');
    const image = qs('#lightbox-image');
    const caption = qs('#lightbox-caption');
    if (!lightbox || !image) return;

    qsa('.project-thumb img').forEach(function (img) {
      img.addEventListener('click', function () {
        const figure = img.closest('.project-thumb');
        const text = figure ? qs('.project-caption', figure) : null;
        image.src = img.src;
        image.alt = img.alt;
        if (caption) caption.textContent = text ? text.textContent.trim() : img.alt;
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function close() {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      image.src = '';
      document.body.style.overflow = '';
    }

    const overlay = qs('#lightbox-close');
    const button = qs('#lightbox-close-btn');
    if (overlay) overlay.addEventListener('click', close);
    if (button) button.addEventListener('click', close);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !lightbox.hidden) close();
    });
  }

  function initContactForm() {
    const form = qs('#contact-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const status = qs('#form-status');
      const data = Object.fromEntries(new FormData(form).entries());
      const error = validateContactForm(data);
      if (error) {
        showFormStatus(status, error, false);
        return;
      }

      const recipient = 'enterprisesdev6283@gmail.com';
      const subject = encodeURIComponent('Website Quote Request - ' + data.service);
      const body = encodeURIComponent(
        'Name: ' + data.name + '\n' +
        'Email: ' + data.email + '\n' +
        'Phone: ' + (data.phone || 'Not provided') + '\n' +
        'Service: ' + data.service + '\n\n' +
        'Message:\n' + (data.message || 'Not provided')
      );

      window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
      showFormStatus(status, 'Your email app should open with the enquiry ready to send.', true);
    });
  }

  function validateContactForm(data) {
    if (!data.name || !data.name.trim()) return 'Please enter your name.';
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) return 'Please enter a valid email address.';
    return null;
  }

  function showFormStatus(element, message, success) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('success', success);
    element.classList.toggle('error', !success);
  }

  function initScrollReveal() {
    const targets = qsa('.service-card, .project-thumb, .qs-card, .mvv-card, .team-card');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('reveal-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          entry.target.classList.remove('reveal-pending');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) {
      el.classList.add('reveal-pending');
      observer.observe(el);
    });
  }

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.from((scope || document).querySelectorAll(selector)); }
  function debounce(fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }
})();
