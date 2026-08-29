(() => {
  const header = document.getElementById('site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.getElementById('year');
  const revealItems = document.querySelectorAll('.reveal');
  const welcomePopup = document.getElementById('welcome-popup');
  const welcomeCloseButtons = [...document.querySelectorAll('[data-welcome-close]')];
  const posterModal = document.getElementById('poster-modal');
  const posterOpen = document.querySelector('[data-poster-open]');
  const posterClose = document.querySelector('[data-poster-close]');

  if (year) year.textContent = new Date().getFullYear();

  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-nav a[data-page]').forEach(a => {
    if ((a.dataset.page || '').toLowerCase() === file) a.classList.add('active');
  });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
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
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize',() => { if(innerWidth>930) closeMenu(); });

  const setScrolledState = () => {
    header?.classList.toggle('scrolled', scrollY > 24);
    backToTop?.classList.toggle('visible', scrollY > 620);
  };
  setScrolledState();
  addEventListener('scroll', setScrolledState, {passive:true});
  backToTop?.addEventListener('click',() => scrollTo({top:0,behavior:'smooth'}));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); obs.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -30px 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('in-view'));

  const closeWelcome = (event) => {
    event?.preventDefault(); event?.stopPropagation();
    if(!welcomePopup) return;
    welcomePopup.hidden = true;
    welcomePopup.setAttribute('aria-hidden','true');
    document.body.classList.remove('popup-open');
    try{localStorage.setItem('tcsWelcomePopupSeen','true')}catch(_){ }
  };
  welcomeCloseButtons.forEach(b => b.addEventListener('click',closeWelcome));
  addEventListener('load',() => {
    if(!welcomePopup) return;
    let seen=false; try{seen=localStorage.getItem('tcsWelcomePopupSeen')==='true'}catch(_){ }
    if(seen) return;
    welcomePopup.hidden=false;
    welcomePopup.setAttribute('aria-hidden','false');
    document.body.classList.add('popup-open');
  },{once:true});

  document.querySelectorAll('.tab-shell').forEach(shell => {
    const buttons=[...shell.querySelectorAll('.tab-button')];
    const panels=[...shell.querySelectorAll('.tab-panel')];
    const activate = id => {
      buttons.forEach(b => { const on=b.dataset.tab===id; b.classList.toggle('active',on); b.setAttribute('aria-selected',String(on)); b.tabIndex=on?0:-1; });
      panels.forEach(p => p.classList.toggle('active',p.id===id));
      if(history.replaceState) history.replaceState(null,'',`#${id}`);
    };
    buttons.forEach(b => b.addEventListener('click',() => activate(b.dataset.tab)));
    const initial = location.hash.slice(1);
    if(initial && panels.some(p=>p.id===initial)) activate(initial);
  });

  posterOpen?.addEventListener('click',()=>{ if(typeof posterModal?.showModal==='function') posterModal.showModal(); });
  posterClose?.addEventListener('click',()=>posterModal?.close());
  posterModal?.addEventListener('click',e=>{ if(e.target===posterModal) posterModal.close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeMenu(); if(welcomePopup&&!welcomePopup.hidden) closeWelcome(e); } });
})();
