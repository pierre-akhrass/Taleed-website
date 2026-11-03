document.addEventListener('DOMContentLoaded', () => {
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

  const videoModal = document.getElementById('introVideo');
  const video = videoModal?.querySelector('video');
  videoModal?.addEventListener('hidden.bs.modal', () => {
    video.pause();
    video.currentTime = 0;
  });

  document.querySelectorAll('#siteNavigation .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const navigation = document.getElementById('siteNavigation');
      const collapse = bootstrap.Collapse.getInstance(navigation);
      collapse?.hide();
    });
  });
});