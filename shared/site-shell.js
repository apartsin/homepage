(function () {
  function normalizePath(pathname) {
    const raw = (pathname || '/').split('?')[0].split('#')[0] || '/';
    return raw.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
  }

  function getAppRelativePath() {
    if (location.protocol !== 'file:') {
      const normalized = normalizePath(location.pathname);
      const marker = '/onesite/';
      const idx = normalized.toLowerCase().indexOf(marker);
      if (idx >= 0) {
        return normalized.slice(idx + marker.length) || 'index.html';
      }
      return normalized.replace(/^\//, '') || 'index.html';
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
    return `/onesite/${getAppRelativePath()}`;
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
    const clean = (path || '').replace(/^\/+/, '');

    if (location.protocol === 'file:') {
      return relativePath(getAppRelativePath(), clean);
    }

    return `/onesite/${clean}`;
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
          /\/about\/employment\.html$/i,
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
          /\/research\/index\.html$/i,
          /\/about\/phd-thesis\.html$/i,
          /\/teaching\/research-projects-open-for-students\.html$/i,
          /\/teaching\/former-students-overview\.html$/i,
          /\/teaching\/current-students-overview\.html$/i,
          /\/teaching\/former-students\.html$/i,
          /\/teaching\/current-students\.html$/i,
        ],
        [
          { label: 'Recent Publications', path: 'research/recent-publications.html' },
          { label: 'Research Projects', path: 'research/research-projects.html' },
          { label: 'Open 4 Grad Students', path: 'research/grad-opportunities.html' },
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
          /\/teaching\/index\.html$/i,
          /\/teaching\/innovation\.html$/i,
          /\/teaching\/ai-engineering-projects-open-for-students\.html$/i,
          /\/courses\//i,
        ],
        [
          {
            label: 'Hands-On AI Science Courses',
            path: 'teaching/overview.html#hands-on-ai-science-courses',
            secondary: [
              { label: 'Courses', path: 'teaching/overview.html#hands-on-courses' },
              { label: 'Past Offerings', path: 'teaching/overview.html#hands-on-past-offerings' },
              { label: 'Student Projects', path: 'teaching/overview.html#hands-on-student-projects' },
            ],
          },
          { label: 'Other CS Courses', path: 'teaching/overview.html#other-cs-courses' },
          { label: 'Available AI Projects for Undergrads', path: 'teaching/overview.html#undergrad-projects' },
          { label: 'Innovation-First Learning', path: 'teaching/overview.html#innovation-first-learning' },
          { label: 'Curriculum Development', path: 'teaching/overview.html#curriculum-development' },
        ],
      ),
      link(
        'Writing',
        'writing/overview.html',
        [
          /\/writing\/overview\.html$/i,
          /\/writing\/blog-posts\.html$/i,
          /\/writing\/books-overview\.html$/i,
          /\/writing\/essays-and-writings\.html$/i,
          /\/writing\/books\.html$/i,
        ],
        [
          { label: 'Blog Posts', path: 'writing/overview.html#blog-posts' },
          { label: 'Books', path: 'writing/overview.html#books' },
        ],
      ),
      link(
        'Building',
        'work/overview.html',
        [
          /\/work\/overview\.html$/i,
          /\/work\/past-projects\.html$/i,
          /\/work\/recent-projects\.html$/i,
          /\/work\/tech-stack-over-years\.html$/i,
          /\/work\/projects\.html$/i,
          /\/about\/industry-experience\.html$/i,
          /\/work\/consulting\.html$/i,
        ],
        [
          { label: 'Past Projects', path: 'work/overview.html#past-projects' },
          { label: 'Recent Projects', path: 'work/overview.html#recent-projects' },
          { label: 'Tech Stack Over Years', path: 'work/overview.html#tech-stack-over-years' },
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
          /\/work\/innovation-and-entrepreneurship\.html$/i,
        ],
        [
          { label: 'Awards & Achievements', path: 'work/innovation-overview.html#awards-achievements' },
          { label: 'Patents', path: 'work/patents.html' },
          { label: 'Entrepreneurship', path: 'work/innovation-overview.html#entrepreneurship' },
          { label: 'Innovation-First Learning', path: 'work/innovation-overview.html#innovation-first-learning' },
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
      { label: 'Course List', path: 'teaching/hands-on-ai-science-courses-courses.html' },
      { label: 'Student Projects', path: 'teaching/hands-on-ai-science-courses-student-projects.html' },
    ],
    'teaching/hands-on-ai-science-courses-past-offerings.html': [
      { label: 'Other CS Courses', path: 'teaching/other-cs-courses.html' },
      { label: 'Course List', path: 'teaching/hands-on-ai-science-courses-courses.html' },
    ],
  };

  function normalizeHash(hashValue) {
    return String(hashValue || '')
      .trim()
      .replace(/^#/, '')
      .toLowerCase();
  }

  function linkMatchesCurrent(path) {
    const raw = String(path || '').trim();
    const hashIndex = raw.indexOf('#');
    const rawPath = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
    const rawHash = hashIndex >= 0 ? raw.slice(hashIndex + 1) : '';

    const target = normalizePath(`/onesite/${rawPath.replace(/^\/+/, '')}`);
    const current = normalizePath(appPathname());
    if (target !== current) {
      return false;
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

      const anchor = document.createElement('a');
      anchor.className = 'apartsin-shell__home-nav-link';
      anchor.href = sitePath(entry.path);
      anchor.textContent = entry.label;
      if (entry === activePrimary || linkMatchesCurrent(entry.path)) {
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
            if (linkMatchesCurrent(secondaryEntry.path)) {
              subAnchor.setAttribute('aria-current', 'page');
              item.classList.add('is-active');
            }
            dropdown.appendChild(subAnchor);
            return;
          }

          const nestedItem = document.createElement('div');
          nestedItem.className = 'apartsin-shell__menu-subitem';

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

          if (linkMatchesCurrent(secondaryEntry.path)) {
            nestedAnchor.setAttribute('aria-current', 'page');
            item.classList.add('is-active');
            nestedItem.classList.add('is-active');
          }

          secondaryEntry.secondary.forEach((thirdLevelEntry) => {
            const thirdAnchor = document.createElement('a');
            thirdAnchor.href = sitePath(thirdLevelEntry.path);
            thirdAnchor.textContent = thirdLevelEntry.label;
            thirdAnchor.setAttribute('role', 'menuitem');
            if (linkMatchesCurrent(thirdLevelEntry.path)) {
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
