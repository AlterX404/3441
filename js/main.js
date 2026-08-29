(() => {
  const header = document.getElementById('site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.getElementById('year');
  const revealItems = document.querySelectorAll('.reveal');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const posterModal = document.getElementById('poster-modal');
  const posterOpen = document.querySelector('[data-poster-open]');
  const posterClose = document.querySelector('[data-poster-close]');
  const welcomePopup = document.getElementById('welcome-popup');
  const welcomeCloseButtons = [...document.querySelectorAll('[data-welcome-close]')];

  if (year) year.textContent = new Date().getFullYear();

  const closeWelcomePopup = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (!welcomePopup) return;
    welcomePopup.hidden = true;
    welcomePopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
    try { localStorage.setItem('tcsWelcomePopupSeen', 'true'); } catch (_) {}
  };

  const openWelcomePopup = () => {
    if (!welcomePopup) return;
    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem('tcsWelcomePopupSeen') === 'true'; } catch (_) {}
    if (alreadySeen) return;
    welcomePopup.hidden = false;
    welcomePopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
    welcomePopup.querySelector('.welcome-popup-close')?.focus();
  };

  welcomeCloseButtons.forEach(button => button.addEventListener('click', closeWelcomePopup));
  window.addEventListener('load', openWelcomePopup, { once: true });

  const setScrolledState = () => {
    const isScrolled = window.scrollY > 24;
    header?.classList.toggle('scrolled', isScrolled);
    backToTop?.classList.toggle('visible', window.scrollY > 620);
  };
  setScrolledState();
  window.addEventListener('scroll', setScrolledState, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav?.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));

    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const current = entry.target.id;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
      });
    }, { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(section => navObserver.observe(section));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  posterOpen?.addEventListener('click', () => {
    if (typeof posterModal?.showModal === 'function') posterModal.showModal();
  });
  posterClose?.addEventListener('click', () => posterModal?.close());
  posterModal?.addEventListener('click', event => {
    if (event.target === posterModal) posterModal.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      if (welcomePopup && !welcomePopup.hidden) closeWelcomePopup(event);
    }
  });
})();
