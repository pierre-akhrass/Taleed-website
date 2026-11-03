document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('oppGrid');
  if (!grid) return;

  const PAGE_SIZE = 6;
  const cards = Array.from(grid.querySelectorAll('.opp-card'));
  const checks = Array.from(document.querySelectorAll('.filter-checks input'));
  const affiliate = document.getElementById('affiliateFilter');
  const search = document.getElementById('oppSearch');
  const empty = document.getElementById('oppEmpty');
  const loadMore = document.getElementById('loadMore');
  let visibleLimit = PAGE_SIZE;

  function render() {
    const categories = checks.filter((c) => c.checked).map((c) => c.value);
    const term = search.value.trim().toLowerCase();
    const matches = cards.filter((card) => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      return (!categories.length || categories.includes(card.dataset.category))
        && (!affiliate.value || card.dataset.affiliate === affiliate.value)
        && (!term || title.includes(term));
    });

    cards.forEach((card) => { card.hidden = true; });
    matches.slice(0, visibleLimit).forEach((card) => { card.hidden = false; });
    empty.hidden = matches.length > 0;
  }

  [...checks, affiliate, search].forEach((el) => {
    el.addEventListener('input', () => { visibleLimit = PAGE_SIZE; render(); });
  });
  loadMore.addEventListener('click', () => { visibleLimit += PAGE_SIZE; render(); });

  render();

  const storyEl = document.querySelector('.story-swiper');
  if (storyEl && typeof Swiper !== 'undefined') {
    new Swiper(storyEl, {
      loop: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.story-pagination', clickable: true }
    });
  }
});
