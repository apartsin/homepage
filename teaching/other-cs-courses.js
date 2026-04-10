(function () {
  const switchRoot = document.querySelector('.other-cs-switch');
  if (!switchRoot) {
    return;
  }

  const buttons = Array.from(switchRoot.querySelectorAll('.other-cs-switch__item[data-filter]'));
  const cards = Array.from(document.querySelectorAll('.other-cs-card[data-institution]'));
  if (buttons.length === 0 || cards.length === 0) {
    return;
  }

  function setActiveFilter(filter) {
    const active = (filter || 'all').toLowerCase();

    buttons.forEach((button) => {
      const isActive = (button.dataset.filter || 'all').toLowerCase() === active;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    cards.forEach((card) => {
      const institution = (card.dataset.institution || '').toLowerCase();
      card.hidden = active !== 'all' && institution !== active;
    });
  }

  switchRoot.addEventListener('click', (event) => {
    const button = event.target.closest('.other-cs-switch__item[data-filter]');
    if (!button) {
      return;
    }
    setActiveFilter(button.dataset.filter);
  });

  setActiveFilter('all');
})();
