document.addEventListener('DOMContentLoaded', () => {
  const navigationToggle = document.querySelector('.nav-toggle');
  const navigation = document.getElementById('siteNavigation');

  function setNavigationOpen(isOpen) {
    if (!navigationToggle || !navigation) return;
    navigation.classList.toggle('is-open', isOpen);
    navigationToggle.setAttribute('aria-expanded', String(isOpen));
  }

  navigationToggle?.addEventListener('click', () => {
    setNavigationOpen(navigationToggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setNavigationOpen(false));
  });

  const SiteModal = {
    active: null,
    trigger: null,
    open(modal, trigger = document.activeElement) {
      if (!modal) return;
      this.active = modal;
      this.trigger = trigger;
      modal.hidden = false;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.classList.add('modal-open');
      (modal.querySelector('[data-modal-dismiss]') || modal).focus();
    },
    close(modal = this.active) {
      if (!modal) return;
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.querySelectorAll('video').forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
      document.body.classList.remove('modal-open');
      if (this.active === modal) {
        this.active = null;
        this.trigger?.focus();
        this.trigger = null;
      }
    }
  };
  window.SiteModal = SiteModal;

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-modal-target]');
    if (trigger) {
      SiteModal.open(document.querySelector(trigger.dataset.modalTarget), trigger);
      return;
    }
    const dismiss = event.target.closest('[data-modal-dismiss]');
    if (dismiss) {
      SiteModal.close(dismiss.closest('.site-modal'));
      return;
    }
    if (event.target.classList.contains('site-modal')) SiteModal.close(event.target);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      SiteModal.close();
      setNavigationOpen(false);
      return;
    }
    if (event.key === 'Tab' && SiteModal.active) {
      const focusable = Array.from(SiteModal.active.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) {
        event.preventDefault();
        SiteModal.active.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const heroElement = document.querySelector('.home-swiper');
  if (heroElement) {
    const slideCount = heroElement.querySelectorAll('.swiper-slide').length;
    const heroSwiper = new Swiper(heroElement, {
      slidesPerView: 1,
      speed: 4000,
      parallax: true,
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 2000, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next-home',
        prevEl: '.swiper-button-prev-home',
        disabledClass: 'swiper-button-disabled'
      },
      pagination: {
        el: '.swiper-pagination-home',
        type: 'custom',
        renderCustom(swiper) {
          const current = swiper.realIndex + 1;
          return `<span class="pagination-zero">0</span><span class="swiper-pagination-current">${current}</span><div class="home-progress-track"><span class="home-progress-fill" style="width:${current === 1 ? 30 : ((current - 1) / (slideCount - 1)) * 100}%"></span></div><span class="pagination-zero">0</span><span class="swiper-pagination-total">${slideCount}</span>`;
        }
      }
    });

    heroSwiper.on('slideChange', () => {
      const current = heroSwiper.realIndex + 1;
      const progress = heroElement.querySelector('.home-progress-fill');
      if (progress) progress.style.width = `${current === 1 ? 30 : ((current - 1) / (slideCount - 1)) * 100}%`;
    });
  }

  const partnerTrack = document.querySelector('.partner-track');
  if (partnerTrack) {
    const firstGroup = document.createElement('div');
    firstGroup.className = 'partner-group';
    Array.from(partnerTrack.querySelectorAll('img')).forEach((image) => firstGroup.append(image));

    const repeatedGroup = firstGroup.cloneNode(true);
    repeatedGroup.setAttribute('aria-hidden', 'true');
    repeatedGroup.querySelectorAll('img').forEach((image) => { image.alt = ''; });
    partnerTrack.replaceChildren(firstGroup, repeatedGroup);
  }

  const statCounters = document.querySelectorAll('.stat-value[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      element.textContent = target.toLocaleString('en-US');
      return;
    }

    const start = performance.now();
    const duration = 1600;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.floor(progress * target).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    statCounters.forEach((counter) => observer.observe(counter));
  } else {
    statCounters.forEach(animateCounter);
  }

});