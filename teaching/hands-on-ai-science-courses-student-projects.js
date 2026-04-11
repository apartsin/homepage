(function () {
  const sourceProjects = Array.isArray(window.STUDENT_PROJECTS)
    ? window.STUDENT_PROJECTS
    : (typeof STUDENT_PROJECTS !== 'undefined' && Array.isArray(STUDENT_PROJECTS) ? STUDENT_PROJECTS : null);

  if (!Array.isArray(sourceProjects)) {
    return;
  }

  function normalizeProject(project) {
    if (!project || typeof project !== 'object') {
      return null;
    }

    const title = project.t || project.title || '';
    const course = project.c || project.course || '';
    if (!title || !course) {
      return null;
    }

    const links = Array.isArray(project.l)
      ? project.l
      : (Array.isArray(project.links) ? project.links : []);

    return {
      t: String(title).trim(),
      c: String(course).trim(),
      a: String(project.a || project.authors || '').trim(),
      d: String(project.d || project.description || '').trim(),
      i: String(project.i || project.image || '').trim(),
      l: links.map((link) => ({
        k: String(link && (link.k || link.label) ? (link.k || link.label) : '').trim(),
        u: String(link && (link.u || link.href) ? (link.u || link.href) : '').trim(),
      })).filter((link) => link.u),
    };
  }

  const projects = sourceProjects.map(normalizeProject).filter((project) => project && project.t && project.c);
  const grid = document.getElementById('student-projects-grid');
  const typeSelect = document.getElementById('student-project-filter-type');
  const institutionSelect = document.getElementById('student-project-filter-institution');
  const yearSelect = document.getElementById('student-project-filter-year');
  const resetBtn = document.getElementById('student-project-filter-reset');
  const status = document.getElementById('student-project-status');

  if (!grid || !typeSelect || !institutionSelect || !yearSelect || !resetBtn || !status) {
    return;
  }

  function titleCase(text) {
    return String(text || '')
      .split(/\s+/)
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(' ');
  }

  function parseInstitutionToken(token) {
    const value = String(token || '').trim().toUpperCase();
    const map = {
      HIT: 'Holon Institute of Technology',
      BIU: 'Bar-Ilan University',
      TAU: 'Tel Aviv University',
      MTA: 'The Academic College of Tel Aviv-Yafo',
    };
    return map[value] || titleCase(token);
  }

  function parseDateToken(token) {
    const value = String(token || '').trim();
    const termMatch = value.match(/^(\d{4})([FS])$/i);
    if (termMatch) {
      const year = termMatch[1];
      const term = termMatch[2].toUpperCase() === 'F' ? 'Fall' : 'Spring';
      return `${year} ${term}`;
    }
    const rangeMatch = value.match(/^(\d{4})\/(\d{2})$/);
    if (rangeMatch) {
      return `${rangeMatch[1]}/${rangeMatch[2]}`;
    }
    const yearMatch = value.match(/^(\d{4})$/);
    if (yearMatch) {
      return yearMatch[1];
    }
    return value || 'Not specified';
  }

  function yearFromDate(dateText) {
    const match = String(dateText || '').match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : 'Not specified';
  }

  function inferType(instanceTitle) {
    const value = String(instanceTitle || '').toLowerCase();
    if (/vision|image|generative models|computer vision|genai/.test(value)) {
      return 'Vision AI';
    }
    if (/llm|language|agent|convers/.test(value)) {
      return 'Conversation AI';
    }
    if (/scalable|big data|distributed|cloud|data science/.test(value)) {
      return 'Scalable AI';
    }
    if (/temporal|sequential|reinforcement/.test(value)) {
      return 'Temporal AI';
    }
    return 'AI Systems';
  }

  function typeSlugFromLabel(label) {
    const normalized = String(label || '').trim().toLowerCase();
    if (normalized === 'conversation ai') return 'language-ai';
    if (normalized === 'vision ai') return 'vision-ai';
    if (normalized === 'scalable ai') return 'scalable-ai';
    if (normalized === 'temporal ai') return 'temporal-ai';
    return 'ai-systems';
  }

  function typeLabelFromSlug(slug) {
    const normalized = String(slug || '').trim().toLowerCase();
    if (normalized === 'language-ai' || normalized === 'conversation-ai') return 'Conversation AI';
    if (normalized === 'vision-ai') return 'Vision AI';
    if (normalized === 'scalable-ai') return 'Scalable AI';
    if (normalized === 'temporal-ai') return 'Temporal AI';
    if (normalized === 'ai-systems') return 'AI Systems';
    return '';
  }

  function parseCourseMeta(courseLabel) {
    const raw = String(courseLabel || '').trim();
    const [instancePartRaw, rightPartRaw] = raw.split(/\s-\s(.+)/);
    const instancePart = String(instancePartRaw || raw).trim();
    const rightPart = String(rightPartRaw || '').trim();
    let institution = 'Not specified';
    let courseInstance = rightPart || raw;
    let date = 'Not specified';

    if (rightPart) {
      const tokens = rightPart.split(/\s+/).filter(Boolean);
      const dateToken = tokens.length > 0 ? tokens[tokens.length - 1] : '';
      date = parseDateToken(dateToken);
      if (tokens.length >= 1) {
        institution = parseInstitutionToken(tokens[0]);
      }
    }

    const type = inferType(instancePart);
    return {
      instanceTitle: instancePart,
      institution,
      courseInstance,
      date,
      year: yearFromDate(date),
      type,
      typeSlug: typeSlugFromLabel(type),
    };
  }

  function optionLabelFromSlug(slug) {
    return typeLabelFromSlug(slug) || String(slug || '');
  }

  function appendOptions(selectEl, values, toLabel) {
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = toLabel(value);
      selectEl.appendChild(option);
    });
  }

  const cards = projects.map((project) => {
    const courseMeta = parseCourseMeta(project.c);
    const article = document.createElement('article');
    article.className = 'content-card content-card--collection student-project-card';
    article.dataset.type = courseMeta.typeSlug;
    article.dataset.institution = courseMeta.institution;
    article.dataset.year = courseMeta.year;

    if (project.i) {
      const media = document.createElement('div');
      media.className = 'content-card__media';
      const img = document.createElement('img');
      img.src = project.i;
      img.alt = project.t;
      img.loading = 'lazy';
      img.decoding = 'async';
      media.appendChild(img);
      article.appendChild(media);
    }

    const body = document.createElement('div');
    body.className = 'content-card__body';

    const title = document.createElement('h2');
    title.className = 'content-card__title';
    title.textContent = project.t;
    body.appendChild(title);

    const tags = document.createElement('div');
    tags.className = 'student-project-card__tags';
    [
      { text: courseMeta.year, cls: 'student-project-card__tag--year' },
      { text: courseMeta.instanceTitle, cls: 'student-project-card__tag--course' },
      { text: courseMeta.type, cls: 'student-project-card__tag--type' },
      { text: courseMeta.institution, cls: 'student-project-card__tag--institution' },
    ].forEach((item) => {
      const tag = document.createElement('span');
      tag.className = `student-project-card__tag ${item.cls}`;
      tag.textContent = item.text;
      tags.appendChild(tag);
    });
    body.appendChild(tags);

    if (project.a) {
      const meta = document.createElement('p');
      meta.className = 'content-card__meta';
      meta.textContent = project.a;
      body.appendChild(meta);
    }

    if (project.d) {
      const desc = document.createElement('p');
      desc.className = 'content-card__desc';
      desc.textContent = project.d;
      body.appendChild(desc);
    }

    const links = (project.l || []).filter((link) => link && link.u);
    if (links.length > 0) {
      const linksWrap = document.createElement('div');
      linksWrap.className = 'content-card__links';
      links.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.className = 'content-card__link';
        anchor.href = link.u;
        anchor.textContent = link.k || 'Open';
        if (/^https?:\/\//i.test(link.u)) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        linksWrap.appendChild(anchor);
      });
      body.appendChild(linksWrap);
    }

    article.appendChild(body);
    return article;
  });

  cards.forEach((card) => grid.appendChild(card));

  const allTypes = Array.from(new Set(cards.map((card) => card.dataset.type).filter(Boolean))).sort();
  const allInstitutions = Array.from(new Set(cards.map((card) => card.dataset.institution).filter(Boolean))).sort();
  const allYears = Array.from(new Set(cards.map((card) => card.dataset.year).filter(Boolean)))
    .sort((a, b) => {
      if (a === 'Not specified') return 1;
      if (b === 'Not specified') return -1;
      return Number(b) - Number(a);
    });

  appendOptions(typeSelect, allTypes, optionLabelFromSlug);
  appendOptions(institutionSelect, allInstitutions, (v) => v);
  appendOptions(yearSelect, allYears, (v) => v);

  const params = new URLSearchParams(window.location.search);
  const presetType = String(params.get('type') || '').trim().toLowerCase();
  const presetInstitution = String(params.get('institution') || '').trim();
  const presetYear = String(params.get('year') || '').trim();

  if (presetType && allTypes.includes(presetType)) {
    typeSelect.value = presetType;
  }
  if (presetInstitution && allInstitutions.includes(presetInstitution)) {
    institutionSelect.value = presetInstitution;
  }
  if (presetYear && allYears.includes(presetYear)) {
    yearSelect.value = presetYear;
  }

  function applyFilters() {
    const type = typeSelect.value;
    const institution = institutionSelect.value;
    const year = yearSelect.value;
    let visible = 0;

    cards.forEach((card) => {
      const typeMatch = type === 'all' || card.dataset.type === type;
      const institutionMatch = institution === 'all' || card.dataset.institution === institution;
      const yearMatch = year === 'all' || card.dataset.year === year;
      const match = typeMatch && institutionMatch && yearMatch;
      card.hidden = !match;
      if (match) {
        visible += 1;
      }
    });

    status.textContent = `Showing ${visible} of ${cards.length} projects`;
  }

  [typeSelect, institutionSelect, yearSelect].forEach((selectEl) => {
    selectEl.addEventListener('change', applyFilters);
  });

  resetBtn.addEventListener('click', () => {
    typeSelect.value = 'all';
    institutionSelect.value = 'all';
    yearSelect.value = 'all';
    applyFilters();
  });

  applyFilters();
})();
