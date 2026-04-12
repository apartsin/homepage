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
    const raw = (pathname || '/').split('?')[0].split('#')[0] || '/';
    return raw.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
  }

  function getHttpAppPathInfo() {
    const normalized = normalizePath(location.pathname);
    const segments = normalized.replace(/^\/+/, '').split('/').filter(Boolean);

    if (segments.length === 0) {
      return { basePath: '/', relativePath: 'index.html' };
    }

    let rootIndex = segments.findIndex((segment) => APP_ROOT_SEGMENTS.has(segment.toLowerCase()));

    if (rootIndex < 0) {
      if (segments.length === 1 && !/\.[a-z0-9]+$/i.test(segments[0])) {
        return { basePath: `/${segments[0]}/`, relativePath: 'index.html' };
      }
      return { basePath: '/', relativePath: segments.join('/') || 'index.html' };
    }

    const baseSegments = segments.slice(0, rootIndex);
    const relativeSegments = segments.slice(rootIndex);
    const basePath = baseSegments.length ? `/${baseSegments.join('/')}/` : '/';
    const relativePath = relativeSegments.join('/') || 'index.html';
    return { basePath, relativePath };
  }

  function appBasePath() {
    if (location.protocol === 'file:') {
      return '/onesite/';
    }
    return getHttpAppPathInfo().basePath;
  }

  function getAppRelativePath() {
    if (location.protocol !== 'file:') {
      return getHttpAppPathInfo().relativePath;
    }

    const decoded = decodeURIComponent(location.pathname || '').replace(/\\/g, '/');
    const marker = '/onesite/';
    const idx = decoded.toLowerCase().lastIndexOf(marker);
    if (idx >= 0) {
      return decoded.slice(idx + marker.length) || 'index.html';
    }
    return decoded.replace(/^\/+/, '') || 'index.html';
  }

  function appPathname() {
    return normalizePath(`${appBasePath()}${getAppRelativePath()}`);
  }

  function relativePath(fromFilePath, targetPath) {
    const fromParts = (fromFilePath || 'index.html').split('/').filter(Boolean);
    const toParts = (targetPath || 'index.html').replace(/^\//, '').split('/').filter(Boolean);

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

  function sitePath(path) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path || '')) {
      return path;
    }

    const clean = (path || '').replace(/^\/+/, '');

    if (location.protocol === 'file:') {
      return relativePath(getAppRelativePath(), clean);
    }

    return normalizePath(`${appBasePath()}${clean}`);
  }

  function link(label, path, matches, secondary) {
    return {
      label,
      path,
      matches: Array.isArray(matches) ? matches : [],
      secondary: Array.isArray(secondary) ? secondary : [],
    };
  }

  const SITE_CONFIG = {
    subtitle: 'Scientist | Educator | Innovator | Builder | Writer',
    primaryNav: [
      link(
        'About',
        'about/academic-profile.html',
        [
          /\/about\/academic-profile\.html$/i,
          /\/about\/education\.html$/i,
          /\/about\/industry-experience\.html$/i,
          /\/about\/phd-thesis\.html$/i,
        ],
        [
          { label: 'Education', path: 'about/education.html' },
          { label: 'Industry Experience', path: 'about/industry-experience.html' },
          { label: 'PhD Thesis', path: 'about/phd-thesis.html' },
        ],
      ),
      link(
        'Research',
        'research/interests.html',
        [
          /\/research\/interests\.html$/i,
          /\/research\/recent-publications\.html$/i,
          /\/research\/research-projects\.html$/i,
          /\/research\/grad-opportunities\.html$/i,
          /\/about\/phd-thesis\.html$/i,
          /\/teaching\/former-students\.html$/i,
          /\/teaching\/current-students\.html$/i,
        ],
        [
          { label: 'Recent Publications', path: 'research/recent-publications.html' },
          { label: 'Current Research Projects', path: 'research/research-projects.html' },
          { label: 'Research Projects for M.Sc. Students', path: 'research/grad-opportunities.html' },
          { label: 'Former Students', path: 'teaching/former-students.html' },
          { label: 'Current Students', path: 'teaching/current-students.html' },
        ],
      ),
      link(
        'Teaching',
        'teaching/overview.html',
        [
          /\/teaching\/overview\.html$/i,
          /\/teaching\/curriculum-development\.html$/i,
          /\/teaching\/other-cs-courses\.html$/i,
          /\/teaching\/undergrad-ai-projects\.html$/i,
          /\/teaching\/hands-on-ai-science-courses\.html$/i,
          /\/teaching\/hands-on-ai-science-courses-courses\.html$/i,
          /\/teaching\/hands-on-ai-science-courses-past-offerings\.html$/i,
          /\/teaching\/hands-on-ai-science-courses-student-projects\.html$/i,
          /\/teaching\/innovation-first-learning\.html$/i,
          /\/teaching\/ai-engineering-projects-open-for-students\.html$/i,
          /\/teaching\/course-bots\.html$/i,
          /\/courses\//i,
        ],
        [
          {
            label: 'Hands-On AI Science Course Series',
            path: 'teaching/hands-on-ai-science-courses-courses.html',
            secondary: [
              { label: 'Course Syllabi', path: 'teaching/hands-on-ai-science-courses-courses.html' },
              { label: 'Course Offerings', path: 'teaching/hands-on-ai-science-courses-past-offerings.html' },
              { label: 'Student Course Projects', path: 'teaching/hands-on-ai-science-courses-student-projects.html' },
              { label: 'Course Bots', path: 'teaching/course-bots.html' },
            ],
          },
          { label: 'Computer Science Courses', path: 'teaching/other-cs-courses.html' },
          { label: 'Projects for B.Sc. Students', path: 'teaching/undergrad-ai-projects.html' },
          { label: 'Former Students', path: 'teaching/former-students.html' },
          { label: 'Current Students', path: 'teaching/current-students.html' },
          { label: 'Innovation-First Learning', path: 'work/innovation-first-learning.html' },
          { label: 'Curriculum Development', path: 'teaching/curriculum-development.html' },
        ],
      ),
      link(
        'Writing',
        'writing/overview.html',
        [
          /\/writing\/overview\.html$/i,
          /\/writing\/blog-posts\.html$/i,
          /\/writing\/books-overview\.html$/i,
          /\/writing\/books\.html$/i,
        ],
        [
          {
            label: 'Blog Posts',
            path: 'writing/blog-posts.html',
            secondary: [
              { label: 'Vibe-Coding', path: 'writing/blog-posts.html?theme=vibe-coding' },
              { label: 'AI Product Strategy', path: 'writing/blog-posts.html?theme=ai-product-strategy' },
              { label: 'AI in Academia', path: 'writing/blog-posts.html?theme=ai-in-academia' },
              { label: 'Project Brief', path: 'writing/blog-posts.html?theme=project-brief' },
            ],
          },
          {
            label: 'Online Books Drafts',
            path: 'writing/books-overview.html',
            secondary: [
              {
                label: 'Building Language AI with LLMs and Agents',
                path: 'http://llmbook.apartsin.com/',
              },
              {
                label: 'From AI-Assisted Software Development to AI-Powered Software Products',
                path: 'http://vibebook.apartsin.com/',
              },
            ],
          },
        ],
      ),
      link(
        'Building',
        'work/overview.html',
        [
          /\/work\/overview\.html$/i,
          /\/work\/past-projects\.html$/i,
          /\/work\/recent-projects\.html$/i,
          /\/work\/tech-stack\.html$/i,
          /\/work\/consulting\.html$/i,
          /\/about\/industry-experience\.html$/i,
        ],
        [
          { label: 'Industry Experience', path: 'about/industry-experience.html' },
          { label: 'Recent Projects', path: 'work/recent-projects.html' },
          { label: 'Selected Past Projects', path: 'work/past-projects.html' },
          { label: 'Tech Stack Evolution', path: 'work/tech-stack.html' },
          { label: 'Consulting', path: 'work/consulting.html' },
        ],
      ),
      link(
        'Innovations',
        'work/innovation-overview.html',
        [
          /\/work\/innovation-overview\.html$/i,
          /\/work\/awards-achievements\.html$/i,
          /\/work\/patents\.html$/i,
          /\/work\/entrepreneurship\.html$/i,
          /\/work\/innovation-first-learning\.html$/i,
        ],
        [
          { label: 'Awards & Achievements', path: 'work/awards-achievements.html' },
          { label: 'Patents', path: 'work/patents.html' },
          { label: 'Entrepreneurship', path: 'work/entrepreneurship.html' },
          { label: 'Innovation-First Learning', path: 'work/innovation-first-learning.html' },
        ],
      ),
    ],
  };

  const CROSS_PATHS = {
    'work/innovation-overview.html': [
      { label: 'Innovation-First Learning in Teaching', path: 'teaching/innovation-first-learning.html' },
      { label: 'Related Build Tracks', path: 'work/recent-projects.html' },
    ],
    'teaching/innovation-first-learning.html': [
      { label: 'Innovation Overview', path: 'work/innovation-overview.html' },
      { label: 'Applied Experiments', path: 'teaching/ai-engineering-projects-open-for-students.html' },
    ],
    'work/awards-achievements.html': [
      { label: 'Innovation Overview', path: 'work/innovation-overview.html' },
      { label: 'Entrepreneurship', path: 'work/entrepreneurship.html' },
    ],
    'work/entrepreneurship.html': [
      { label: 'Innovation Overview', path: 'work/innovation-overview.html' },
      { label: 'Teaching Innovation', path: 'teaching/innovation-first-learning.html' },
    ],
    'teaching/hands-on-ai-science-courses.html': [
      { label: 'Course Syllabi', path: 'teaching/hands-on-ai-science-courses-courses.html' },
      { label: 'Student Course Projects', path: 'teaching/hands-on-ai-science-courses-student-projects.html' },
    ],
    'teaching/hands-on-ai-science-courses-past-offerings.html': [
      { label: 'Computer Science Courses', path: 'teaching/other-cs-courses.html' },
      { label: 'Course Syllabi', path: 'teaching/hands-on-ai-science-courses-courses.html' },
    ],
  };

  function normalizeHash(hashValue) {
    return String(hashValue || '')
      .trim()
      .replace(/^#/, '')
      .toLowerCase();
  }

  function normalizeQuery(queryValue) {
    const raw = String(queryValue || '').trim().replace(/^\?/, '');
    if (!raw) {
      return '';
    }
    const params = new URLSearchParams(raw);
    const entries = [];
    params.forEach((value, key) => {
      entries.push([key, value]);
    });
    entries.sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1].localeCompare(b[1]);
      }
      return a[0].localeCompare(b[0]);
    });
    return entries.map(([key, value]) => `${key}=${value}`).join('&');
  }

  function linkMatchesCurrent(path) {
    const raw = String(path || '').trim();
    const hashIndex = raw.indexOf('#');
    const rawPathWithQuery = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
    const rawHash = hashIndex >= 0 ? raw.slice(hashIndex + 1) : '';
    const queryIndex = rawPathWithQuery.indexOf('?');
    const rawPath = queryIndex >= 0 ? rawPathWithQuery.slice(0, queryIndex) : rawPathWithQuery;
    const rawQuery = queryIndex >= 0 ? rawPathWithQuery.slice(queryIndex + 1) : '';

    const target = normalizePath(`${appBasePath()}${rawPath.replace(/^\/+/, '')}`);
    const current = normalizePath(appPathname());
    if (target !== current) {
      return false;
    }

    if (rawQuery) {
      return normalizeQuery(rawQuery) === normalizeQuery(window.location.search);
    }

    const targetHash = normalizeHash(rawHash);
    if (!targetHash) {
      return true;
    }

    return normalizeHash(location.hash) === targetHash;
  }

  function findActivePrimary(config) {
    const current = normalizePath(appPathname());
    const active = config.primaryNav.find((entry) => {
      if (linkMatchesCurrent(entry.path)) {
        return true;
      }
      return entry.matches.some((pattern) => pattern.test(current));
    });

    return active || null;
  }

  function ensureBrandVisual(brand) {
    return;
  }

  function ensureSidebarStructure(sidebar, config) {
    let header = sidebar.querySelector('.apartsin-shell__sidebar-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'apartsin-shell__sidebar-header';
      const brand = sidebar.querySelector('.apartsin-shell__brand');
      const subtitle = sidebar.querySelector('.apartsin-shell__subtitle');
      const divider = sidebar.querySelector('.apartsin-shell__divider');

      if (brand) {
        brand.setAttribute('href', sitePath('index.html'));
        ensureBrandVisual(brand);
        header.appendChild(brand);
      }
      if (!subtitle) {
        const subtitleEl = document.createElement('div');
        subtitleEl.className = 'apartsin-shell__subtitle';
        subtitleEl.textContent = config.subtitle || '';
        header.appendChild(subtitleEl);
      } else {
        subtitle.textContent = config.subtitle || '';
        header.appendChild(subtitle);
      }
      if (divider) {
        header.appendChild(divider);
      }
      sidebar.insertBefore(header, sidebar.firstChild);
      return;
    }

    let subtitle = header.querySelector('.apartsin-shell__subtitle');
    if (!subtitle) {
      subtitle = document.createElement('div');
      subtitle.className = 'apartsin-shell__subtitle';
      header.appendChild(subtitle);
    }
    subtitle.textContent = config.subtitle || '';

    const brand = header.querySelector('.apartsin-shell__brand') || sidebar.querySelector('.apartsin-shell__brand');
    if (brand) {
      brand.setAttribute('href', sitePath('index.html'));
      ensureBrandVisual(brand);
    }
  }

  function buildPrimaryMenuFragment(config, activePrimary) {
    const frag = document.createDocumentFragment();

    config.primaryNav.forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'apartsin-shell__menu-item';
      const isPrimaryActive = entry === activePrimary || (!activePrimary && linkMatchesCurrent(entry.path));

      const anchor = document.createElement('a');
      anchor.className = 'apartsin-shell__home-nav-link';
      anchor.href = sitePath(entry.path);
      anchor.textContent = entry.label;
      if (isPrimaryActive) {
        anchor.setAttribute('aria-current', 'page');
        item.classList.add('is-active');
      }
      if (entry.secondary && entry.secondary.length > 0) {
        anchor.setAttribute('aria-haspopup', 'menu');
      }

      item.appendChild(anchor);

      if (entry.secondary && entry.secondary.length > 0) {
        const dropdown = document.createElement('div');
        dropdown.className = 'apartsin-shell__menu-dropdown';
        dropdown.setAttribute('role', 'menu');
        dropdown.setAttribute('aria-label', `${entry.label} submenu`);

        entry.secondary.forEach((secondaryEntry) => {
          const hasNested = Array.isArray(secondaryEntry.secondary) && secondaryEntry.secondary.length > 0;

          if (!hasNested) {
            const subAnchor = document.createElement('a');
            subAnchor.href = sitePath(secondaryEntry.path);
            subAnchor.textContent = secondaryEntry.label;
            subAnchor.setAttribute('role', 'menuitem');
            if (isPrimaryActive && linkMatchesCurrent(secondaryEntry.path)) {
              subAnchor.setAttribute('aria-current', 'page');
              item.classList.add('is-active');
            }
            dropdown.appendChild(subAnchor);
            return;
          }

          const nestedItem = document.createElement('div');
          nestedItem.className = 'apartsin-shell__menu-subitem';
          if (
            secondaryEntry.secondary.length === 1 ||
            /online books drafts/i.test(secondaryEntry.label || '')
          ) {
            nestedItem.classList.add('is-easy-open');
          }

          const nestedAnchor = document.createElement('a');
          nestedAnchor.href = sitePath(secondaryEntry.path);
          nestedAnchor.className = 'apartsin-shell__menu-subitem-trigger';
          nestedAnchor.textContent = secondaryEntry.label;
          nestedAnchor.setAttribute('role', 'menuitem');
          nestedAnchor.setAttribute('aria-haspopup', 'menu');
          nestedItem.appendChild(nestedAnchor);

          const nestedDropdown = document.createElement('div');
          nestedDropdown.className = 'apartsin-shell__menu-subitem-dropdown';
          nestedDropdown.setAttribute('role', 'menu');
          nestedDropdown.setAttribute('aria-label', `${secondaryEntry.label} submenu`);

          if (isPrimaryActive && linkMatchesCurrent(secondaryEntry.path)) {
            nestedAnchor.setAttribute('aria-current', 'page');
            item.classList.add('is-active');
            nestedItem.classList.add('is-active');
          }

          secondaryEntry.secondary.forEach((thirdLevelEntry) => {
            const thirdAnchor = document.createElement('a');
            thirdAnchor.href = sitePath(thirdLevelEntry.path);
            thirdAnchor.textContent = thirdLevelEntry.label;
            thirdAnchor.setAttribute('role', 'menuitem');
            if (isPrimaryActive && linkMatchesCurrent(thirdLevelEntry.path)) {
              thirdAnchor.setAttribute('aria-current', 'page');
              item.classList.add('is-active');
              nestedItem.classList.add('is-active');
            }
            nestedDropdown.appendChild(thirdAnchor);
          });

          nestedItem.appendChild(nestedDropdown);
          dropdown.appendChild(nestedItem);
        });

        item.appendChild(dropdown);
      }

      frag.appendChild(item);
    });

    return frag;
  }

  function decorateTopNav(nav, config, activePrimary) {
    if (nav.dataset.shellEnhanced === 'true') {
      return;
    }

    nav.replaceChildren(buildPrimaryMenuFragment(config, activePrimary));
    nav.dataset.shellEnhanced = 'true';
  }

  function decorateHomeHeroSwitcher(config, activePrimary) {
    const switcher = document.querySelector('.home-hero-switcher');
    if (!switcher || switcher.dataset.shellEnhanced === 'true') {
      return;
    }

    switcher.replaceChildren(buildPrimaryMenuFragment(config, activePrimary));
    switcher.dataset.shellEnhanced = 'true';
  }

  function ensureSecondaryNav(sidebar, activePrimary) {
    if (!sidebar) {
      return;
    }

    const existing = sidebar.querySelector('.apartsin-shell__subnav');
    if (
      !activePrimary ||
      !Array.isArray(activePrimary.secondary) ||
      activePrimary.secondary.length === 0
    ) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    const nav = existing || document.createElement('nav');
    nav.className = 'apartsin-shell__subnav';
    nav.setAttribute('aria-label', `${activePrimary.label} sections`);
    nav.dataset.navLevel = 'secondary';
    nav.innerHTML = '';

    activePrimary.secondary.forEach((entry) => {
      const anchor = document.createElement('a');
      anchor.href = sitePath(entry.path);
      anchor.textContent = entry.label;
      if (linkMatchesCurrent(entry.path)) {
        anchor.setAttribute('aria-current', 'page');
      }
      nav.appendChild(anchor);
    });

    if (!existing) {
      const primaryNav = sidebar.querySelector('.apartsin-shell__nav');
      if (primaryNav) {
        primaryNav.insertAdjacentElement('afterend', nav);
      } else {
        sidebar.appendChild(nav);
      }
    }
  }

  function ensureCrossNav(sidebar) {
    if (!sidebar) {
      return;
    }

    const current = getAppRelativePath().replace(/^\/+/, '');
    const links = CROSS_PATHS[current] || [];
    const existing = sidebar.querySelector('.apartsin-shell__crossnav');

    if (!Array.isArray(links) || links.length === 0) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    const nav = existing || document.createElement('nav');
    nav.className = 'apartsin-shell__crossnav';
    nav.dataset.navLevel = 'cross';
    nav.setAttribute('aria-label', 'Cross-listed paths');
    nav.innerHTML = '';

    const prefix = document.createElement('span');
    prefix.className = 'apartsin-shell__crossnav-label';
    prefix.textContent = 'Also in';
    nav.appendChild(prefix);

    links.forEach((entry) => {
      const anchor = document.createElement('a');
      anchor.href = sitePath(entry.path);
      anchor.textContent = entry.label;
      if (linkMatchesCurrent(entry.path)) {
        anchor.setAttribute('aria-current', 'page');
      }
      nav.appendChild(anchor);
    });

    if (!existing) {
      const secondary = sidebar.querySelector('.apartsin-shell__subnav');
      if (secondary) {
        secondary.insertAdjacentElement('afterend', nav);
      } else {
        const primary = sidebar.querySelector('.apartsin-shell__nav');
        if (primary) {
          primary.insertAdjacentElement('afterend', nav);
        } else {
          sidebar.appendChild(nav);
        }
      }
    }
  }

  function ensureMobileToggle(sidebar, nav) {
    const header = sidebar.querySelector('.apartsin-shell__sidebar-header');
    if (!header) {
      return;
    }

    let toggle = header.querySelector('.apartsin-shell__mobile-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'apartsin-shell__mobile-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      header.appendChild(toggle);
    }

    const mobileQuery = window.matchMedia('(max-width: 960px)');
    const syncState = () => {
      document.body.classList.toggle('apartsin-nav-collapsible', mobileQuery.matches);
      if (!mobileQuery.matches) {
        document.body.classList.remove('apartsin-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };

    toggle.addEventListener('click', () => {
      const open = !document.body.classList.contains('apartsin-nav-open');
      document.body.classList.toggle('apartsin-nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    sidebar.querySelectorAll('.apartsin-shell__nav a, .apartsin-shell__subnav a').forEach((linkEl) => {
      linkEl.addEventListener('click', () => {
        if (!mobileQuery.matches) {
          return;
        }
        document.body.classList.remove('apartsin-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', syncState);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(syncState);
    }

    syncState();
  }

  function enhanceShell() {
    const shell = document.querySelector('.apartsin-shell');
    const sidebar = document.querySelector('.apartsin-shell__sidebar');
    const nav = document.querySelector('.apartsin-shell__nav');
    if (!shell || !sidebar || !nav) {
      return;
    }

    // Apply shell classes up front to minimize visual flicker while nav is enhanced.
    document.body.classList.add('site-shell-enhanced');
    document.body.classList.add('apartsin-shell-topnav');

    const config = SITE_CONFIG;
    const activePrimary = findActivePrimary(config);

    ensureSidebarStructure(sidebar, config);
    decorateTopNav(nav, config, activePrimary);
    decorateHomeHeroSwitcher(config, activePrimary);
    ensureSecondaryNav(sidebar, activePrimary);
    ensureCrossNav(sidebar);
    ensureMobileToggle(sidebar, nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceShell, { once: true });
  } else {
    enhanceShell();
  }
})();
