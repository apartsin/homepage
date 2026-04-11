(function () {
  const APP_ROOT_SEGMENTS = new Set([
    'about',
    'research',
    'teaching',
    'work',
    'writing',
    'courses',
    'index.html',
  ]);

  function normalizePath(pathname) {
    return (pathname || '/').split('?')[0].split('#')[0];
  }

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeToken(value) {
    return normalizeText(value).toLowerCase();
  }

  function slugify(value) {
    return normalizeText(value)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cleanedPageTitle() {
    const raw = normalizeText(document.title || '');
    if (!raw) {
      return '';
    }

    let title = raw;
    title = title.replace(/^Home\|\s*Sasha Apartsin\s*-\s*/i, '');
    title = title.replace(/^Home\|\s*Sasha Apartsin\s*/i, '');
    title = title.replace(/^Home\|\s*/i, '');
    title = title.replace(/\s*\|\s*Sasha Apartsin.*$/i, '');
    title = title.replace(/^Sasha Apartsin\s*-\s*/i, '');
    title = title.replace(/\s{2,}/g, ' ').trim();

    const generic = new Set(['home', 'sasha apartsin', 'hos offerings']);
    if (!title || generic.has(title.toLowerCase())) {
      return '';
    }
    return title;
  }

  function inferSection(pathname) {
    if (/\/about\//i.test(pathname)) return 'about';
    if (/\/research\//i.test(pathname)) return 'research';
    if (/\/work\//i.test(pathname)) return 'work';
    if (/\/teaching\//i.test(pathname)) return 'teaching';
    if (/\/courses\//i.test(pathname)) return 'courses';
    if (/\/writing\//i.test(pathname)) return 'writing';
    return 'home';
  }

  function ensureBodySection() {
    const path = normalizePath(location.pathname);
    document.body.dataset.siteSection = inferSection(path);
  }

  function onesiteRootPrefix() {
    const pathname = normalizePath(location.pathname || '/');
    const marker = '/onesite/';
    const markerIndex = pathname.toLowerCase().indexOf(marker);
    let afterRoot = '';
    if (markerIndex >= 0) {
      afterRoot = pathname.slice(markerIndex + marker.length);
    } else {
      const segments = pathname.replace(/^\/+/, '').split('/').filter(Boolean);
      if (segments.length === 0) {
        return './';
      }

      const rootIndex = segments.findIndex((segment) => APP_ROOT_SEGMENTS.has(segment.toLowerCase()));
      if (rootIndex < 0) {
        if (segments.length === 1 && !/\.[a-z0-9]+$/i.test(segments[0])) {
          return './';
        }
        afterRoot = segments.join('/');
      } else {
        afterRoot = segments.slice(rootIndex).join('/');
      }
    }

    const parts = afterRoot.split('/').filter(Boolean);
    if (parts.length <= 1) {
      return './';
    }

    return '../'.repeat(parts.length - 1);
  }

  function toOnesiteHref(path) {
    const raw = String(path || '').trim();
    if (!raw) {
      return './';
    }

    let target = raw;
    target = target.replace(/^https?:\/\/[^/]+/i, '');
    target = target.replace(/^\/+/, '');
    if (/^onesite\//i.test(target)) {
      target = target.slice('onesite/'.length);
    }

    return `${onesiteRootPrefix()}${target}`;
  }

  function mapLegacyHref(url) {
    const host = (url.hostname || '').toLowerCase();
    const path = normalizePath(url.pathname || '/');

    const wwwMap = {
      '/': '/onesite/index.html',
      '/index.html': '/onesite/index.html',
      '/home': '/onesite/about/academic-profile.html',
      '/home.html': '/onesite/about/academic-profile.html',
      '/phd-thesis': '/onesite/about/phd-thesis.html',
      '/phd-thesis.html': '/onesite/about/phd-thesis.html',
      '/research': '/onesite/research/interests.html',
      '/research.html': '/onesite/research/interests.html',
      '/industry-experience': '/onesite/about/industry-experience.html',
      '/industry-experience.html': '/onesite/about/industry-experience.html',
      '/innovation-and-entrepreneurship': '/onesite/work/innovation-overview.html',
      '/innovation-and-entrepreneurship.html': '/onesite/work/innovation-overview.html',
      '/patents': '/onesite/work/patents.html',
      '/patents.html': '/onesite/work/patents.html',
      '/teaching/innovation': '/onesite/teaching/innovation-first-learning.html',
      '/teaching/innovation.html': '/onesite/teaching/innovation-first-learning.html',
      '/projects': '/onesite/work/overview.html',
      '/projects.html': '/onesite/work/overview.html',
      '/teaching-and-curriculum-development': '/onesite/teaching/overview.html',
      '/teaching-and-curriculum-development.html': '/onesite/teaching/overview.html',
      '/former-students': '/onesite/teaching/former-students.html',
      '/former-students.html': '/onesite/teaching/former-students.html',
      '/current-students': '/onesite/teaching/current-students.html',
      '/current-students.html': '/onesite/teaching/current-students.html',
      '/ai-engineering-projects-open-for-students': '/onesite/teaching/ai-engineering-projects-open-for-students.html',
      '/ai-engineering-projects-open-for-students.html': '/onesite/teaching/ai-engineering-projects-open-for-students.html',
      '/research-projects-open-for-students': '/onesite/research/grad-opportunities.html',
      '/research-projects-open-for-students.html': '/onesite/research/grad-opportunities.html',
      '/essays-and-writings': '/onesite/writing/blog-posts.html',
      '/essays-and-writings.html': '/onesite/writing/blog-posts.html',
      '/highschool': '/onesite/about/education.html',
      '/highschool.html': '/onesite/about/education.html',
    };

    const coursesMap = {
      '/': '/onesite/courses/index.html',
      '/index.html': '/onesite/courses/index.html',
      '/hos-projects': '/onesite/courses/hos/projects.html',
      '/hos-projects.html': '/onesite/courses/hos/projects.html',
      '/llmhit-cs-2025f': '/onesite/courses/hit-cs/llmhit-cs-2025f.html',
      '/llmhit-cs-2025f.html': '/onesite/courses/hit-cs/llmhit-cs-2025f.html',
      '/llmhit-cs-2025s': '/onesite/courses/hit-cs/llmhit-cs-2025s.html',
      '/llmhit-cs-2025s.html': '/onesite/courses/hit-cs/llmhit-cs-2025s.html',
      '/genaihit-cs-2025f': '/onesite/courses/hit-cs/genaihit-cs-2025f.html',
      '/genaihit-cs-2025f.html': '/onesite/courses/hit-cs/genaihit-cs-2025f.html',
      '/llm-hit-cs-2026f': '/onesite/courses/hit-cs/llm-hit-cs-2026f.html',
      '/llm-hit-cs-2026f.html': '/onesite/courses/hit-cs/llm-hit-cs-2026f.html',
      '/llm-hit-dh-2025s': '/onesite/courses/hit-dh/llm-hit-dh-2025s.html',
      '/llm-hit-dh-2025s.html': '/onesite/courses/hit-dh/llm-hit-dh-2025s.html',
      '/llm-hit-dh-2026f': '/onesite/courses/hit-dh/llm-hit-dh-2026f.html',
      '/llm-hit-dh-2026f.html': '/onesite/courses/hit-dh/llm-hit-dh-2026f.html',
      '/llmbiu-ds-2025f': '/onesite/courses/biu-ds/llmbiu-ds-2025f.html',
      '/llmbiu-ds-2025f.html': '/onesite/courses/biu-ds/llmbiu-ds-2025f.html',
      '/genaibiu-ds-2026s': '/onesite/courses/biu-ds/genaibiu-ds-2026s.html',
      '/genaibiu-ds-2026s.html': '/onesite/courses/biu-ds/genaibiu-ds-2026s.html',
      '/visionbiu-ee-2026s': '/onesite/courses/biu-ee/visionbiu-ee-2026s.html',
      '/visionbiu-ee-2026s.html': '/onesite/courses/biu-ee/visionbiu-ee-2026s.html',
      '/computer-vision-workshophit-cs-2025-26': '/onesite/courses/workshops/computer-vision-workshophit-cs-2025-26.html',
      '/computer-vision-workshophit-cs-2025-26.html': '/onesite/courses/workshops/computer-vision-workshophit-cs-2025-26.html',
      '/genai-workshophit-cs-2025-26': '/onesite/courses/workshops/genai-workshophit-cs-2025-26.html',
      '/genai-workshophit-cs-2025-26.html': '/onesite/courses/workshops/genai-workshophit-cs-2025-26.html',
      '/llm-workshophit-cs-2025-26': '/onesite/courses/workshops/llm-workshophit-cs-2025-26.html',
      '/llm-workshophit-cs-2025-26.html': '/onesite/courses/workshops/llm-workshophit-cs-2025-26.html',
    };

    const hosMap = {
      '/': '/onesite/courses/hos/index.html',
      '/index.html': '/onesite/courses/hos/index.html',
      '/hos-home': '/onesite/courses/hos/series/index.html',
      '/hos-home.html': '/onesite/courses/hos/series/index.html',
      '/hos-home/bigdata-course.html': '/onesite/courses/hos/series/bigdata-course.html',
      '/hos-home/dai-course.html': '/onesite/courses/hos/series/dai-course.html',
      '/hos-home/embvision-course.html': '/onesite/courses/hos/series/embvision-course.html',
      '/hos-home/genai-course.html': '/onesite/courses/hos/series/genai-course.html',
      '/hos-home/llm-course.html': '/onesite/courses/hos/series/llm-course.html',
      '/hos-home/temporalai-course.html': '/onesite/courses/hos/series/temporalai-course.html',
    };

    if (host === 'www.apartsin.com') {
      return wwwMap[path] || '';
    }
    if (host === 'courses.apartsin.com') {
      return coursesMap[path] || '';
    }
    if (host === 'hos.apartsin.com') {
      return hosMap[path] || '';
    }

    return '';
  }

  function rewriteLegacyInternalLinks() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) {
        return;
      }

      try {
        const url = new URL(href, location.href);
        const mapped = mapLegacyHref(url);
        if (!mapped) {
          return;
        }

        const localHref = toOnesiteHref(mapped);
        const withHash = url.hash ? `${localHref}${url.hash}` : localHref;
        anchor.setAttribute('href', withHash);
      } catch (_) {
        // ignore malformed URLs
      }
    });
  }

  function ensureExternalLinks() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href)) {
        anchor.target = '_blank';
        if (!anchor.rel) {
          anchor.rel = 'noopener noreferrer';
        }
      }
    });
  }

  function normalizeHeadingCopyLinks() {
    const currentPath = normalizePath(location.pathname);
    document.querySelectorAll('a[href*="#h."]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      try {
        const url = new URL(href, location.href);
        if (normalizePath(url.pathname) === currentPath && url.hash) {
          anchor.setAttribute('href', url.hash);
        }
      } catch (_) {
        // ignore malformed URLs
      }
    });
  }

  function buildCardsToolbar(cardsShell) {
    if (
      cardsShell.dataset.disableToolbar === 'true' ||
      document.body.dataset.disableCardsToolbar === 'true'
    ) {
      return;
    }

    const cards = Array.from(cardsShell.querySelectorAll('.content-card'));
    if (cards.length < 4 || cardsShell.querySelector('.cards-toolbar')) {
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'cards-toolbar';

    const search = document.createElement('input');
    search.className = 'cards-toolbar__search';
    search.type = 'search';
    search.placeholder = 'Filter cards by title, collaborator, or keyword';
    search.setAttribute('aria-label', 'Filter cards');
    toolbar.appendChild(search);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'cards-toolbar__chips';

    const cardLabels = Array.from(new Set(cards
      .map((card) => {
        const eyebrow = card.querySelector('.content-card__eyebrow');
        return (eyebrow ? eyebrow.textContent : '').trim();
      })
      .filter(Boolean)));

    const labels = ['All'].concat(cardLabels);
    const chips = [];
    labels.forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cards-toolbar__chip';
      button.textContent = label;
      button.dataset.label = label;
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      chipsWrap.appendChild(button);
      chips.push(button);
    });

    toolbar.appendChild(chipsWrap);

    const status = document.createElement('div');
    status.className = 'cards-toolbar__status';
    toolbar.appendChild(status);

    cardsShell.insertBefore(toolbar, cardsShell.firstChild);

    function applyFilter(activeLabel) {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const eyebrow = (card.querySelector('.content-card__eyebrow')?.textContent || '').trim();
        const text = card.textContent.toLowerCase();
        const labelMatch = activeLabel === 'All' || eyebrow === activeLabel;
        const textMatch = !query || text.includes(query);
        card.hidden = !(labelMatch && textMatch);
        if (!card.hidden) {
          visible += 1;
        }
      });
      status.textContent = `Showing ${visible} of ${cards.length} cards`;
    }

    let activeLabel = 'All';
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeLabel = chip.dataset.label || 'All';
        chips.forEach((item) => item.setAttribute('aria-pressed', item === chip ? 'true' : 'false'));
        applyFilter(activeLabel);
      });
    });

    search.addEventListener('input', () => applyFilter(activeLabel));
    applyFilter(activeLabel);
  }

  function normalizeCardLine(value) {
    return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function dedupeCardContent(cardsShell) {
    cardsShell.querySelectorAll('.content-card').forEach((card) => {
      const seen = new Set();
      const title = card.querySelector('.content-card__title');
      const titleText = normalizeCardLine(title?.textContent || '');
      if (titleText) {
        seen.add(titleText);
      }

      const meta = card.querySelector('.content-card__meta');
      const metaText = normalizeCardLine(meta?.textContent || '');
      if (meta && (!metaText || seen.has(metaText))) {
        meta.remove();
      } else if (metaText) {
        seen.add(metaText);
      }

      const desc = card.querySelector('.content-card__desc');
      const descText = normalizeCardLine(desc?.textContent || '');
      if (desc && (!descText || seen.has(descText))) {
        desc.remove();
      } else if (descText) {
        seen.add(descText);
      }

      const richParagraphs = Array.from(card.querySelectorAll('.content-card__rich p'));
      richParagraphs.forEach((paragraph) => {
        const line = normalizeCardLine(paragraph.textContent || '');
        if (!line || seen.has(line)) {
          paragraph.remove();
          return;
        }
        seen.add(line);
      });

      const rich = card.querySelector('.content-card__rich');
      if (rich && rich.children.length === 0) {
        rich.remove();
      }
    });
  }

  function enhanceCards() {
    document.querySelectorAll('.cards-shell').forEach((cardsShell) => {
      dedupeCardContent(cardsShell);
      buildCardsToolbar(cardsShell);
    });
  }

  function cleanupGoogleEmbeds() {
    const embedFrames = Array.from(document.querySelectorAll('iframe[src*="atari-embeds.googleusercontent.com"], .w536ob[data-url*="atari-embeds.googleusercontent.com"]'));
    if (embedFrames.length === 0) {
      return;
    }

    embedFrames.forEach((embed) => {
      const container = embed.closest('section.yaqOZd') || embed.closest('div');
      if (!container || container.dataset.embedChecked === 'true') {
        return;
      }
      container.dataset.embedChecked = 'true';
      container.classList.add('legacy-google-embed');
    });
  }

  function addRelatedLinks() {
    return;

    if (document.querySelector('.related-links')) {
      return;
    }

    const section = document.body.dataset.siteSection || 'home';
    const map = {
      about: [
        { label: 'Innovations', href: '/onesite/work/innovation-overview.html' },
        { label: 'Teaching', href: '/onesite/teaching/overview.html' },
      ],
      work: [
        { label: 'Recent Projects', href: '/onesite/work/recent-projects.html' },
        { label: 'Blog Posts', href: '/onesite/writing/blog-posts.html' },
      ],
      teaching: [
        { label: 'Course Syllabi', href: '/onesite/teaching/hands-on-ai-science-courses-courses.html' },
        { label: 'Current Students', href: '/onesite/teaching/current-students.html' },
      ],
      courses: [
        { label: 'Course Syllabi', href: '/onesite/teaching/hands-on-ai-science-courses-courses.html' },
        { label: 'Student Projects', href: '/onesite/teaching/hands-on-ai-science-courses-student-projects.html' },
      ],
      writing: [
        { label: 'Innovations', href: '/onesite/work/innovation-overview.html' },
        { label: 'Recent Projects', href: '/onesite/work/recent-projects.html' },
      ],
    };

    const links = map[section];
    if (!Array.isArray(links) || links.length === 0) {
      return;
    }

    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const block = document.createElement('section');
    block.className = 'related-links';
    block.innerHTML = '<h2>Related</h2>';
    const list = document.createElement('ul');
    links.forEach((item) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      li.appendChild(anchor);
      list.appendChild(li);
    });
    block.appendChild(list);
    main.appendChild(block);
  }

  function inferPageHeading(main, sectionLabel) {
    const fromTitle = cleanedPageTitle();
    if (fromTitle) {
      return fromTitle;
    }

    const heading = main.querySelector('h1, .duRjpb, h2, .JYVBee');
    const headingText = normalizeText(heading?.textContent || '');
    if (headingText && headingText.length >= 3) {
      return headingText;
    }
    return sectionLabel;
  }

  function inferPageLede(sectionKey) {
    const map = {
      about: 'Background, experience, and professional context.',
      research: 'Publications, research directions, and active topics.',
      teaching: 'Courses, supervision, and curriculum development.',
      courses: 'Course offerings, material, and project work.',
      work: 'Projects, applied systems, and delivery tracks.',
      writing: 'Blog posts and long-form writing projects.',
    };
    return map[sectionKey] || 'Overview and key links.';
  }

  function resolveSectionHref(sectionKey) {
    const map = {
      home: '/onesite/index.html',
      about: '/onesite/about/academic-profile.html',
      research: '/onesite/research/interests.html',
      work: '/onesite/work/overview.html',
      teaching: '/onesite/teaching/overview.html',
      courses: '/onesite/courses/index.html',
      writing: '/onesite/writing/overview.html',
    };
    return map[sectionKey] || '/onesite/index.html';
  }

  function addUnifiedPageHeader() {
    if (
      document.body.dataset.siteSection === 'home' ||
      document.querySelector('.apartsin-page-header') ||
      document.querySelector('.hub-page')
    ) {
      return;
    }

    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const sectionMap = {
      about: 'About',
      research: 'Research',
      work: 'Building',
      teaching: 'Teaching',
      courses: 'Courses',
      writing: 'Writings',
    };
    const sectionKey = document.body.dataset.siteSection || 'home';
    const sectionLabel = sectionMap[sectionKey] || 'Site';
    const heading = inferPageHeading(main, sectionLabel);
    const lede = inferPageLede(sectionKey);
    const homeHref = toOnesiteHref('/onesite/index.html');
    const sectionHref = toOnesiteHref(resolveSectionHref(sectionKey));

    const block = document.createElement('section');
    block.className = 'apartsin-page-header apartsin-page-header--standard';
    block.innerHTML = `
      <div class="apartsin-page-header__top">
        <p class="apartsin-page-header__kicker">${escapeHtml(sectionLabel)}</p>
        <nav class="apartsin-page-header__crumbs" aria-label="Breadcrumb">
          <a href="${homeHref}">Home</a>
          <span aria-hidden="true">/</span>
          <a href="${sectionHref}">${escapeHtml(sectionLabel)}</a>
          <span aria-hidden="true">/</span>
          <strong>${escapeHtml(heading)}</strong>
        </nav>
      </div>
      <h1 class="apartsin-page-header__title">${escapeHtml(heading)}</h1>
      <p class="apartsin-page-header__lede">${escapeHtml(lede)}</p>
    `;

    main.insertBefore(block, main.firstChild);
  }

  function ensureDeepLinkAnchors() {
    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const used = new Set(Array.from(document.querySelectorAll('[id]'))
      .map((node) => String(node.id || '').toLowerCase())
      .filter(Boolean));

    const targets = Array.from(main.querySelectorAll('.hub-page, .hub-card, .content-card, section.yaqOZd, .cards-shell, .apartsin-page-header'));
    let fallbackIndex = 1;

    targets.forEach((node) => {
      if (!node || node.id) {
        return;
      }

      const heading = node.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > .content-card__title, h1, h2, h3, .content-card__title, .duRjpb, .JYVBee');
      const headingText = normalizeText(heading?.textContent || '');
      let base = slugify(headingText || `section-${fallbackIndex++}`);
      if (!base) {
        base = `section-${fallbackIndex++}`;
      }

      let candidate = base;
      let suffix = 2;
      while (used.has(candidate.toLowerCase())) {
        candidate = `${base}-${suffix++}`;
      }

      node.id = candidate;
      used.add(candidate.toLowerCase());
    });
  }

  function removeLegacyAboutInstitutionBanner() {
    const path = normalizePath(location.pathname);
    if (!/\/about\/index\.html$/i.test(path)) {
      return;
    }

    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const sections = Array.from(main.querySelectorAll(':scope > section.yaqOZd'));
    sections.forEach((section) => {
      const text = normalizeToken(section.textContent || '');
      const looksLikeLegacyBanner = section.classList.contains('O13XJf') || section.classList.contains('LB7kq');
      const hasInstitutionLine = text.includes('school of computer science') && text.includes('holon institute of technology');
      const hasLegacyName = text.includes('alexander (sasha) apartsin');

      if (hasInstitutionLine || (looksLikeLegacyBanner && hasLegacyName)) {
        section.classList.add('apartsin-legacy-banner-hidden');
      }
    });
  }

  function addAboutPortrait() {
    const path = normalizePath(location.pathname);
    if (!/\/about\/index\.html$/i.test(path) || document.querySelector('.about-portrait')) {
      return;
    }

    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const block = document.createElement('section');
    block.className = 'about-portrait';
    block.innerHTML = `
      <img src="../shared-media/www-apartsin-com/assets/home/img-001-25abe63564-5677768a55.jpg" alt="Portrait of Sasha Apartsin">
      <p>Background and current focus across research, teaching, building, and writing.</p>
    `;

    const header = main.querySelector('.apartsin-page-header');
    if (header) {
      header.insertAdjacentElement('afterend', block);
    } else {
      main.insertBefore(block, main.firstChild);
    }
  }

  function softenLegacyTopHeading() {
    if (document.body.dataset.siteSection === 'home') {
      return;
    }

    const main = document.querySelector('.apartsin-shell__main');
    if (!main) {
      return;
    }

    const canonical = normalizeToken(inferPageHeading(main, ''));
    if (!canonical) {
      return;
    }

    const legacyHeading = main.querySelector('section.yaqOZd h1, section.yaqOZd .duRjpb, section.yaqOZd h2');
    if (!legacyHeading) {
      return;
    }

    const legacy = normalizeToken(legacyHeading.textContent || '');
    if (!legacy || legacy.length < 3) {
      return;
    }

    const matches = canonical === legacy || canonical.includes(legacy) || legacy.includes(canonical);
    if (matches) {
      legacyHeading.classList.add('apartsin-legacy-title-hidden');
    }
  }

  function addBackToTop() {
    if (document.querySelector('.apartsin-backtotop')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'apartsin-backtotop';
    button.setAttribute('aria-label', 'Back to top');
    button.textContent = 'Top';
    document.body.appendChild(button);

    const refresh = () => {
      button.hidden = window.scrollY < 440;
    };

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', refresh, { passive: true });
    refresh();
  }

  function init() {
    ensureBodySection();
    rewriteLegacyInternalLinks();
    ensureExternalLinks();
    normalizeHeadingCopyLinks();
    enhanceCards();
    cleanupGoogleEmbeds();
    removeLegacyAboutInstitutionBanner();
    addUnifiedPageHeader();
    addAboutPortrait();
    ensureDeepLinkAnchors();
    softenLegacyTopHeading();
    addBackToTop();
    initScrollReveal();
    injectSocialMeta();
  }

  /* #15 Scroll-reveal: staggered fade-in for cards */
  function initScrollReveal() {
    var selectors = '.content-card, .prt-card, .industry-card, .student-project-card, .book-card, .bot-card, .hub-card, .syllabus-card';
    var cards = document.querySelectorAll(selectors);
    if (!cards.length || !('IntersectionObserver' in window)) {
      /* If no IntersectionObserver, just reveal everything */
      for (var i = 0; i < cards.length; i++) cards[i].classList.add('is-revealed');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          /* Stagger siblings: find index among visible grid children */
          var parent = el.parentElement;
          var siblings = parent ? Array.prototype.slice.call(parent.children) : [];
          var idx = siblings.indexOf(el);
          var delay = Math.min(idx * 50, 300);
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    cards.forEach(function (card) { observer.observe(card); });
  }

  /* #12 Inject social meta + favicon */
  function injectSocialMeta() {
    var head = document.head;
    if (!head) return;
    var pageTitle = document.title || 'Sasha Apartsin';
    var descMeta = document.querySelector('meta[name="description"]');
    var pageDesc = descMeta ? descMeta.getAttribute('content') : '';
    var pageUrl = location.href;

    function addMeta(prop, content) {
      if (!content) return;
      if (document.querySelector('meta[property="' + prop + '"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('property', prop);
      m.setAttribute('content', content);
      head.appendChild(m);
    }
    function addMetaName(name, content) {
      if (!content) return;
      if (document.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('name', name);
      m.setAttribute('content', content);
      head.appendChild(m);
    }

    addMeta('og:title', pageTitle);
    addMeta('og:description', pageDesc);
    addMeta('og:type', 'website');
    addMeta('og:url', pageUrl);
    addMetaName('twitter:card', 'summary');
    addMetaName('twitter:title', pageTitle);
    addMetaName('twitter:description', pageDesc);

    /* Favicon */
    if (!document.querySelector('link[rel="icon"]')) {
      var link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = (function () {
        /* Generate inline SVG favicon with accent-colored "A" */
        return 'data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
          '<rect width="32" height="32" rx="6" fill="%239c5a2e"/>' +
          '<text x="16" y="24" font-family="sans-serif" font-weight="800" font-size="22" fill="white" text-anchor="middle">A</text>' +
          '</svg>'
        );
      })();
      head.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
