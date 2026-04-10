(function () {
  const THEME_LABELS = {
    'vibe-coding': 'Vibe-Coding',
    'ai-product-strategy': 'AI Product Strategy',
    'ai-in-academia': 'AI in Academia',
    'project-brief': 'Project Brief',
  };

  const THEME_ALIASES = {
    'on-vibe-coding': 'vibe-coding',
    'vibe': 'vibe-coding',
    'product-strategy': 'ai-product-strategy',
    'ai-strategy': 'ai-product-strategy',
    'academia': 'ai-in-academia',
    'on-my-projects': 'project-brief',
    'projects': 'project-brief',
    'project': 'project-brief',
  };
  const LOCAL_VENUE_ICONS = {
    'ai in plain english': '../assets/venues/ai-in-plain-english.webp',
    'towards ai': '../assets/venues/towards-ai.png',
    'design bootcamp': '../assets/venues/design-bootcamp.webp',
    'educreate': '../assets/venues/educreate.png',
  };

  function normalizeTheme(theme) {
    const clean = String(theme || '').trim().toLowerCase();
    if (!clean) {
      return '';
    }
    if (THEME_LABELS[clean]) {
      return clean;
    }
    return THEME_ALIASES[clean] || '';
  }

  function parseThemesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const fromTheme = params.get('theme') || params.get('filter') || '';
    if (!fromTheme) {
      return [];
    }
    const themes = fromTheme
      .split(',')
      .map((theme) => normalizeTheme(theme))
      .filter(Boolean);
    return themes.length > 0 ? [themes[0]] : [];
  }

  function updateUrl(activeThemes) {
    const params = new URLSearchParams(window.location.search);
    params.delete('theme');
    params.delete('filter');
    if (activeThemes.length > 0) {
      params.set('theme', activeThemes.join(','));
    }
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash || ''}`;
    window.history.replaceState({}, '', nextUrl);
  }

  function applyFilter(activeThemes, cards) {
    const normalized = [...new Set(activeThemes.map(normalizeTheme).filter(Boolean))];

    cards.forEach((card) => {
      const tags = String(card.getAttribute('data-tags') || '')
        .split(',')
        .map((tag) => normalizeTheme(tag))
        .filter(Boolean);
      const visible = normalized.length === 0 || normalized.some((theme) => tags.includes(theme));
      card.hidden = !visible;
    });
  }

  function updateChipState(chips, activeThemes) {
    const hasSpecific = activeThemes.length > 0;
    chips.forEach((chip) => {
      const theme = normalizeTheme(chip.dataset.theme);
      const isAll = theme === '';
      const isActive = isAll ? !hasSpecific : activeThemes.includes(theme);
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function normalizeVenue(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function extractHost(href) {
    try {
      const parsed = new URL(href, window.location.href);
      return String(parsed.hostname || '').replace(/^www\./i, '').toLowerCase();
    } catch (_) {
      return '';
    }
  }

  function venueIconUrl(hostname) {
    if (!hostname) {
      return '';
    }
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(`https://${hostname}`)}`;
  }

  function enhanceVenueMeta(cards) {
    cards.forEach((card) => {
      const meta = card.querySelector('.blog-post-card__meta');
      const link = card.querySelector('.blog-post-card__title a[href]');
      if (!meta || !link || meta.dataset.iconEnhanced === 'true') {
        return;
      }

      const venue = String(meta.textContent || '').trim();
      const venueToken = normalizeVenue(venue);
      const host = extractHost(link.getAttribute('href') || '');
      const iconSrc = LOCAL_VENUE_ICONS[venueToken] || venueIconUrl(host);
      if (!venue || !iconSrc) {
        return;
      }

      const wrap = document.createElement('span');
      wrap.className = 'blog-post-card__meta-wrap';

      const icon = document.createElement('img');
      icon.className = 'blog-post-card__meta-icon';
      icon.src = iconSrc;
      icon.alt = '';
      icon.loading = 'lazy';
      icon.decoding = 'async';
      icon.referrerPolicy = 'no-referrer';
      icon.addEventListener('error', () => {
        icon.remove();
      }, { once: true });

      const text = document.createElement('span');
      text.className = 'blog-post-card__meta-text';
      text.textContent = venue;

      wrap.append(icon, text);
      meta.textContent = '';
      meta.appendChild(wrap);
      meta.dataset.iconEnhanced = 'true';
    });
  }

  function init() {
    const chips = Array.from(document.querySelectorAll('.blog-filter-chip'));
    const cards = Array.from(document.querySelectorAll('.blog-post-card'));
    if (!chips.length || !cards.length) {
      return;
    }

    enhanceVenueMeta(cards);

    let activeThemes = parseThemesFromUrl();
    updateChipState(chips, activeThemes);
    applyFilter(activeThemes, cards);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const theme = normalizeTheme(chip.dataset.theme);
        if (!theme) {
          activeThemes = [];
        } else {
          activeThemes = [theme];
        }
        updateChipState(chips, activeThemes);
        applyFilter(activeThemes, cards);
        updateUrl(activeThemes);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
