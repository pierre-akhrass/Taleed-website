document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('insightsSearch');
  const cards = Array.from(document.querySelectorAll('[data-searchable]'));
  const status = document.getElementById('insightsSearchStatus');

  function filterInsights() {
    const term = search.value.trim().toLowerCase();
    let count = 0;
    cards.forEach((card) => {
      card.hidden = Boolean(term) && !card.textContent.toLowerCase().includes(term);
      if (!card.hidden) count += 1;
    });
    status.hidden = !term;
    status.textContent = count ? `${count} results for "${search.value.trim()}"` : 'No insights match your search.';
  }

  search.addEventListener('input', filterInsights);
  document.querySelector('.insights-search').addEventListener('submit', (event) => {
    event.preventDefault();
    filterInsights();
    if (search.value.trim()) status.scrollIntoView({ block: 'center' });
  });

  document.querySelectorAll('[data-view-all]').forEach((link) => {
    link.addEventListener('click', () => {
      search.value = '';
      filterInsights();
    });
  });

  const preview = document.getElementById('insightPreview');
  document.querySelectorAll('[data-insight-title]').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('insightPreviewTitle').textContent = button.dataset.insightTitle;
      document.getElementById('insightPreviewCopy').textContent = button.closest('article').querySelector('p')?.textContent || '';
      window.SiteModal.open(preview, button);
    });
  });

  document.querySelector('.newsletter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    window.SiteModal.open(document.getElementById('insightsSubscribe'));
  });
});