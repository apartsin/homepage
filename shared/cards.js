(function () {
  const pageConfigs = {};
  const APP_ROOT_SEGMENTS = new Set([
    'about',
    'research',
    'teaching',
    'work',
    'writing',
    'courses',
    'index.html',
  ]);

  function isExternalHref(href) {
    return /^https?:\/\//i.test(href);
  }

  function getFileAppRelativePath() {
    const decoded = decodeURIComponent(location.pathname || '').replace(/\\/g, '/');
    const marker = '/onesite/';
    const idx = decoded.toLowerCase().lastIndexOf(marker);
    if (idx >= 0) {
      return decoded.slice(idx + marker.length) || 'index.html';
    }
    return decoded.replace(/^\/+/, '') || 'index.html';
  }

  function relativePath(fromFilePath, targetPath) {
    const fromParts = (fromFilePath || 'index.html').split('/').filter(Boolean);
    const toParts = (targetPath || 'index.html').replace(/^\/+/, '').split('/').filter(Boolean);

    if (fromParts.length > 0 && /\.[a-z0-9]+$/i.test(fromParts[fromParts.length - 1])) {
      fromParts.pop();
    }

    while (
      fromParts.length > 0 &&
      toParts.length > 0 &&
      fromParts[0].toLowerCase() === toParts[0].toLowerCase()
    ) {
      fromParts.shift();
      toParts.shift();
    }

    const up = '../'.repeat(fromParts.length);
    const down = toParts.join('/');
    return `${up}${down}` || './';
  }

  function getHttpBasePath() {
    const pathname = (location.pathname || '/').split('?')[0].split('#')[0];
    const segments = pathname.replace(/^\/+/, '').split('/').filter(Boolean);
    if (segments.length === 0) {
      return '/';
    }

    const rootIndex = segments.findIndex((segment) => APP_ROOT_SEGMENTS.has(segment.toLowerCase()));
    if (rootIndex < 0) {
      if (segments.length === 1 && !/\.[a-z0-9]+$/i.test(segments[0])) {
        return `/${segments[0]}/`;
      }
      return '/';
    }

    return rootIndex === 0 ? '/' : `/${segments.slice(0, rootIndex).join('/')}/`;
  }

  function resolveSiteHref(href) {
    const raw = String(href || '').trim();
    if (
      !raw ||
      raw.startsWith('#') ||
      /^data:/i.test(raw) ||
      /^mailto:/i.test(raw) ||
      /^tel:/i.test(raw) ||
      /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)
    ) {
      return raw;
    }

    let clean = raw;
    if (clean.startsWith('/onesite/')) {
      clean = clean.slice('/onesite/'.length);
    } else if (clean.startsWith('/')) {
      clean = clean.replace(/^\/+/, '');
    } else {
      return clean;
    }

    if (location.protocol === 'file:') {
      return relativePath(getFileAppRelativePath(), clean);
    }

    return `${getHttpBasePath()}${clean}`.replace(/\/{2,}/g, '/');
  }

  function fallbackLinkLabel(href) {
    try {
      const url = new URL(resolveSiteHref(href), location.href);
      if (isExternalHref(url.href)) {
        return url.hostname.replace(/^www\./i, '');
      }
    } catch (_) {
      // Ignore malformed links and fallback to generic label.
    }

    return 'Open link';
  }

  function createLink(link) {
    const resolvedHref = resolveSiteHref(link.href);
    const anchor = document.createElement('a');
    anchor.className = 'content-card__link';
    anchor.href = resolvedHref;
    anchor.textContent = link.label || fallbackLinkLabel(resolvedHref);
    if (isExternalHref(resolvedHref)) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    return anchor;
  }

  function normalizeText(value) {
    const ellipsisToken = '__APARTSIN_ELLIPSIS__';

    return (value || '')
      .replace(/\.\.\./g, ellipsisToken)
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+\)/g, ')')
      .replace(/\(\s+/g, '(')
      .replace(/\s+([,;:!?])/g, '$1')
      .replace(/([,;:!?])(?!\s|$)/g, '$1 ')
      .replace(/\s+\./g, '.')
      .replace(/\bM\.Sc\s*\./g, 'M.Sc.')
      .replace(/\bPh\.D\s*\./g, 'Ph.D.')
      .replace(/\.(?=\d{4}\b)/g, '. ')
      .replace(/,\s*(?=\d{4}\b)/g, ', ')
      .replace(new RegExp(ellipsisToken, 'g'), '...')
      .trim();
  }

  function getSectionTitle(section) {
    const heading = section.querySelector('h1, h2, h3');
    return heading ? normalizeText(heading.textContent) : '';
  }

  function getSectionParagraphs(section) {
    return Array.from(section.querySelectorAll('p'))
      .map((paragraph) => normalizeText(paragraph.textContent))
      .filter(Boolean);
  }

  function getSectionParagraphNodes(section) {
    return Array.from(section.querySelectorAll('p'));
  }

  function getSectionParagraphTextsFromNodes(nodes) {
    return nodes
      .map((paragraph) => normalizeText(paragraph.textContent))
      .filter(Boolean);
  }

  function getSectionImages(section) {
    return Array.from(section.querySelectorAll('img[src]'))
      .map((image) => image.getAttribute('src'))
      .filter(Boolean);
  }

  function getSectionLinksFromNodes(nodes) {
    const links = [];
    const seen = new Set();

    nodes.forEach((node) => {
      node.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href') || '';
        const label = normalizeText(anchor.textContent);

        if (!href || href.startsWith('#') || href.includes('#h.')) {
          return;
        }
        if (!label && !isExternalHref(href)) {
          return;
        }

        const key = `${href}::${label}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);

        links.push({ href, label });
      });
    });

    return links;
  }

  function getSectionLinks(section) {
    return Array.from(section.querySelectorAll('a[href]'))
      .map((anchor) => ({
        href: anchor.getAttribute('href') || '',
        label: normalizeText(anchor.textContent),
      }))
      .filter((link) => {
        if (!link.href || link.href.startsWith('#') || link.href.includes('#h.')) {
          return false;
        }
        if (link.label) {
          return true;
        }
        return /^https?:\/\//i.test(link.href);
      });
  }

  function isLabelParagraph(text) {
    return /^(GitHub|Paper|Video|Moodle|Projects|Syllabus|Browse)$/i.test(text);
  }

  function looksLikeMetaLine(text) {
    const value = normalizeText(text);
    if (!value || value.length > 120) {
      return false;
    }

    if (/\b(19|20)\d{2}\b/.test(value)) {
      return true;
    }

    if (/(journal|conference|proceedings|thesis|university|college|advisor|supervisor|b\.sc|m\.sc|ph\.d|arxiv|doi|issn|isbn)/i.test(value)) {
      return true;
    }

    return false;
  }

  function splitMetaAndDescription(paragraphs) {
    const remaining = paragraphs.slice();
    const metaLines = [];

    while (remaining.length > 0 && metaLines.length < 2) {
      const candidate = normalizeText(remaining[0]);
      if (!looksLikeMetaLine(candidate)) {
        break;
      }

      metaLines.push(candidate);
      remaining.shift();
    }

    return {
      meta: metaLines.join(' • '),
      remaining,
    };
  }

  function applyParagraphSummary(card, paragraphs, hasHeading) {
    const normalizedParagraphs = paragraphs.map((item) => normalizeText(item)).filter(Boolean);
    if (normalizedParagraphs.length === 0) {
      return;
    }

    const structured = splitMetaAndDescription(normalizedParagraphs);
    if (structured.meta && structured.remaining.length > 0) {
      card.meta = structured.meta;

      if (structured.remaining.length > 3) {
        card.paragraphs = structured.remaining;
      } else {
        card.description = structured.remaining.join(' ');
      }
      return;
    }

    if (normalizedParagraphs.length > 3) {
      card.paragraphs = normalizedParagraphs;
      return;
    }

    if (hasHeading) {
      if (normalizedParagraphs.length >= 4) {
        card.meta = normalizedParagraphs[1];
        card.description = [normalizedParagraphs[0], normalizedParagraphs[normalizedParagraphs.length - 1]].filter(Boolean).join(' ');
      } else if (normalizedParagraphs.length === 3) {
        card.meta = normalizedParagraphs[1];
        card.description = [normalizedParagraphs[0], normalizedParagraphs[2]].filter(Boolean).join(' ');
      } else if (normalizedParagraphs.length === 2) {
        card.meta = normalizedParagraphs[0];
        card.description = normalizedParagraphs[1];
      } else if (normalizedParagraphs.length === 1) {
        card.description = normalizedParagraphs[0];
      }
      return;
    }

    if (normalizedParagraphs.length >= 3) {
      card.meta = normalizedParagraphs[0];
      card.description = normalizedParagraphs.slice(1).join(' ');
    } else if (normalizedParagraphs.length === 2) {
      card.meta = normalizedParagraphs[0];
      card.description = normalizedParagraphs[1];
    } else if (normalizedParagraphs.length === 1) {
      card.meta = normalizedParagraphs[0];
    }
  }

  function createCardFromParts({ eyebrow, title, paragraphs, image, links, hasHeading }) {
    const card = {
      eyebrow,
      title,
    };

    applyParagraphSummary(card, paragraphs, hasHeading);

    if (image) {
      card.image = image;
    }

    if (links.length > 0) {
      card.links = links;
    }

    return card;
  }

  function inferCardVariant(card, gridVariant) {
    if (gridVariant === 'wide-text') {
      return 'wide-text';
    }

    if (gridVariant === 'text-grid') {
      return 'essay';
    }

    if (gridVariant === 'stacked') {
      return 'stacked';
    }

    if (gridVariant === 'collection') {
      return 'collection';
    }

    const eyebrow = normalizeText(card.eyebrow).toLowerCase();
    const descriptionLength = normalizeText(card.description).length;
    const metaLength = normalizeText(card.meta).length;
    const linkCount = Array.isArray(card.links) ? card.links.length : 0;
    const paragraphCount = Array.isArray(card.paragraphs) ? card.paragraphs.length : 0;
    const paragraphLength = paragraphCount > 0
      ? normalizeText(card.paragraphs.join(' ')).length
      : 0;
    const hasImage = Boolean(card.image);

    if (/thesis|essay|publication|writing/.test(eyebrow)) {
      return 'essay';
    }

    if (!hasImage && (descriptionLength > 160 || linkCount > 3 || paragraphCount > 2 || paragraphLength > 220)) {
      return 'wide-text';
    }

    if (descriptionLength > 260 || paragraphLength > 360 || (hasImage && descriptionLength > 160) || metaLength > 90 || paragraphCount > 3) {
      return 'feature';
    }

    return '';
  }

  function buildSectionCard(section, eyebrow) {
    const paragraphs = getSectionParagraphs(section).filter((text) => !isLabelParagraph(text));
    const image = getSectionImages(section)[0] || '';
    let links = getSectionLinks(section);
    let title = getSectionTitle(section);
    const hasHeading = Boolean(title);

    if (!title && paragraphs.length > 0) {
      title = paragraphs.shift();
    }

    if (!title) {
      return null;
    }

    if (!hasHeading) {
      links = links.filter((link) => normalizeText(link.label) !== normalizeText(title));
    }

    return createCardFromParts({
      eyebrow,
      title,
      paragraphs,
      image,
      links,
      hasHeading,
    });
  }

  function buildSectionCards(sections, eyebrow) {
    return sections
      .map((section) => buildSectionCard(section, eyebrow))
      .filter(Boolean);
  }

  function shouldSplitSection(section) {
    const paragraphs = getSectionParagraphs(section);
    const images = getSectionImages(section);
    const title = getSectionTitle(section);

    if (title || images.length <= 1 || paragraphs.length === 0) {
      return false;
    }

    if (paragraphs.length % images.length !== 0) {
      return false;
    }

    const chunkSize = paragraphs.length / images.length;
    return chunkSize >= 1 && chunkSize <= 6;
  }

  function buildSectionGridCards(section, eyebrow) {
    const paragraphNodes = getSectionParagraphNodes(section);
    const imageNodes = Array.from(section.querySelectorAll('img[src]'));
    const imageSources = imageNodes
      .map((image) => image.getAttribute('src'))
      .filter(Boolean);

    if (imageSources.length <= 1 || paragraphNodes.length === 0) {
      return [];
    }

    if (paragraphNodes.length % imageSources.length !== 0) {
      return [];
    }

    const chunkSize = paragraphNodes.length / imageSources.length;
    if (chunkSize < 1 || chunkSize > 6) {
      return [];
    }

    const cards = [];

    for (let index = 0; index < imageSources.length; index += 1) {
      const chunkNodes = paragraphNodes.slice(index * chunkSize, (index + 1) * chunkSize);
      const chunkParagraphs = getSectionParagraphTextsFromNodes(chunkNodes).filter((text) => !isLabelParagraph(text));
      const title = chunkParagraphs.shift();

      if (!title) {
        continue;
      }

      const card = createCardFromParts({
        eyebrow,
        title,
        paragraphs: chunkParagraphs,
        image: imageSources[index] || imageSources[0],
        links: getSectionLinksFromNodes(chunkNodes).filter((link) => normalizeText(link.label) !== normalizeText(title)),
        hasHeading: false,
      });

      if (card) {
        cards.push(card);
      }
    }

    return cards;
  }

  function buildSectionGrid(sections, eyebrow) {
    const cards = [];

    sections.forEach((section) => {
      if (shouldSplitSection(section)) {
        cards.push(...buildSectionGridCards(section, eyebrow));
        return;
      }

      const card = buildSectionCard(section, eyebrow);
      if (card) {
        cards.push(card);
      }
    });

    return cards;
  }

  function buildTimelineCards(sections) {
    const cards = [];

    sections.forEach((section) => {
      const paragraphs = getSectionParagraphs(section);
      const images = Array.from(section.querySelectorAll('img[src]'))
        .map((image) => image.getAttribute('src'))
        .filter(Boolean);

      for (let i = 0; i + 2 < paragraphs.length; i += 3) {
        const year = paragraphs[i];
        const role = paragraphs[i + 1];
        const domain = paragraphs[i + 2];

        if (!year || !role || !domain) {
          continue;
        }

        cards.push({
          eyebrow: 'Experience',
          title: role,
          meta: year,
          description: domain,
          image: images[Math.floor(i / 3)] || images[0],
        });
      }
    });

    return cards;
  }

  function buildCards(pageName, config, sections) {
    if (Array.isArray(config.cards)) {
      return config.cards;
    }

    if (config.mode === 'timeline') {
      return buildTimelineCards(sections);
    }

    if (config.mode === 'section-grid') {
      return buildSectionGrid(sections, config.cardEyebrow || 'Student project');
    }

    return buildSectionCards(sections, config.cardEyebrow || 'Student project');
  }

  function getRenderBlocks(config, sections) {
    if (Array.isArray(config.blocks) && config.blocks.length > 0) {
      return config.blocks
        .map((block) => ({
          start: Math.max(0, block.start || 0),
          end: Math.max(Math.max(0, block.start || 0), Math.min(sections.length, block.end == null ? sections.length : block.end)),
          anchor: block.anchor,
          mode: block.mode || config.mode,
          cardEyebrow: block.cardEyebrow || config.cardEyebrow || 'Student project',
          cards: block.cards,
        }))
        .filter((block) => block.end > block.start);
    }

    const keepCount = Math.max(0, config.keepSections || 0);
    const tailCount = Math.max(0, config.tailSections || 0);
    const start = keepCount;
    const end = Math.max(start, sections.length - tailCount);

    return [{
      start,
      end,
      anchor: Math.max(0, keepCount - 1),
      mode: config.mode,
      cardEyebrow: config.cardEyebrow || 'Student project',
      cards: config.cards,
    }];
  }

  function createCard(card) {
    const article = document.createElement('article');
    article.className = `content-card${card.image ? '' : ' content-card--text'}`;

    if (card.variant) {
      article.classList.add(`content-card--${card.variant}`);
    }

    if (Array.isArray(card.paragraphs) && card.paragraphs.length > 0) {
      article.classList.add('content-card--rich');
    }

    if (card.image) {
      const media = document.createElement('div');
      media.className = 'content-card__media';

      const img = document.createElement('img');
      img.src = resolveSiteHref(card.image);
      img.alt = card.imageAlt || card.title;
      media.appendChild(img);
      article.appendChild(media);
    }

    const body = document.createElement('div');
    body.className = 'content-card__body';

    if (card.eyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'content-card__eyebrow';
      eyebrow.textContent = card.eyebrow;
      body.appendChild(eyebrow);
    }

    const title = document.createElement('h3');
    title.className = 'content-card__title';
    title.textContent = card.title;
    body.appendChild(title);

    if (card.meta) {
      const meta = document.createElement('p');
      meta.className = 'content-card__meta';
      meta.textContent = card.meta;
      body.appendChild(meta);
    }

    if (Array.isArray(card.paragraphs) && card.paragraphs.length > 0) {
      const rich = document.createElement('div');
      rich.className = 'content-card__rich';
      card.paragraphs.forEach((paragraphText) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        rich.appendChild(paragraph);
      });
      body.appendChild(rich);
    } else if (card.description) {
      const desc = document.createElement('p');
      desc.className = 'content-card__desc';
      desc.textContent = card.description;
      body.appendChild(desc);
    }

    if (Array.isArray(card.links) && card.links.length > 0) {
      const links = document.createElement('div');
      links.className = 'content-card__links';
      const seen = new Set();
      card.links.forEach((link) => {
        const key = `${link.href || ''}::${normalizeText(link.label || '')}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        links.appendChild(createLink(link));
      });
      body.appendChild(links);
    }

    article.appendChild(body);
    return article;
  }

  function renderPage(pageName, config) {
    const sections = Array.from(document.querySelectorAll('section.yaqOZd'));
    const blocks = getRenderBlocks(config, sections);
    if (blocks.length === 0) {
      return false;
    }

    let renderedAny = false;

    blocks.forEach((block) => {
      const blockSections = sections.slice(block.start, block.end);
      const cards = buildCards(pageName, block, blockSections).map((card) => ({
        ...card,
        variant: card.variant
          || block.cardVariant
          || config.cardVariant
          || inferCardVariant(card, block.gridVariant || config.gridVariant || ''),
      }));
      if (cards.length === 0) {
        return;
      }

      const shell = document.createElement('section');
      shell.className = 'cards-shell';
      const gridVariant = block.gridVariant || config.gridVariant || '';
      if (gridVariant) {
        shell.classList.add(`cards-shell--${gridVariant}`);
        shell.dataset.cardGrid = gridVariant;
      }
      shell.dataset.cardShell = `${pageName}-${block.start}-${block.end}`;

      const grid = document.createElement('div');
      grid.className = 'cards-grid';
      cards.forEach((card) => grid.appendChild(createCard(card)));
      shell.appendChild(grid);

      const anchorIndex = Math.min(sections.length - 1, Math.max(0, block.anchor == null ? block.start - 1 : block.anchor));
      const anchor = sections[anchorIndex] || sections[0];
      if (!anchor) {
        return;
      }

      anchor.insertAdjacentElement('afterend', shell);

      for (let i = block.start; i < block.end; i += 1) {
        const section = sections[i];
        if (section) {
          section.remove();
        }
      }

      renderedAny = true;
    });

    if (!renderedAny) {
      return false;
    }

    document.body.classList.add('cards-enhanced');
    return true;
  }


  function tryRender() {
    const pageName = document.body && document.body.dataset ? document.body.dataset.cardPage : '';
    if (!pageName || !pageConfigs[pageName]) {
      return false;
    }
    if (document.body.classList.contains('cards-enhanced')) {
      return true;
    }
    return renderPage(pageName, pageConfigs[pageName]);
  }

  function registerPage(pageName, config) {
    pageConfigs[pageName] = config || {};
    tryRender();
  }

  window.ApartsinCards = window.ApartsinCards || {};
  window.ApartsinCards.registerPage = registerPage;
  window.ApartsinCards.renderPage = renderPage;
  window.ApartsinCards.pages = pageConfigs;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryRender, { once: true });
  } else {
    tryRender();
  }
})();
