(function () {
  const sourceProjects = Array.isArray(window.STUDENT_PROJECTS)
    ? window.STUDENT_PROJECTS
    : (typeof STUDENT_PROJECTS !== 'undefined' && Array.isArray(STUDENT_PROJECTS) ? STUDENT_PROJECTS : null);

  if (!Array.isArray(sourceProjects)) {
    return;
  }

  function normalizeAuthors(value) {
    return String(value || '')
      .replace(/[;|]/g, ',')
      .replace(/\s+and\s+/gi, ', ')
      .replace(/\s*&\s*/g, ', ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+/g, ' ')
      .replace(/^,\s*|\s*,$/g, '')
      .trim();
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

    let normalizedTitle = String(title).trim();
    if (/^RegUl AI tion$/i.test(normalizedTitle)) {
      normalizedTitle = 'RegulAItion';
    }

    return {
      t: normalizedTitle,
      c: String(course).trim(),
      a: normalizeAuthors(project.a || project.authors || ''),
      d: String(project.d || project.description || '').trim(),
      i: String(project.i || project.image || '').trim(),
      l: links.map((link) => ({
        k: String(link && (link.k || link.label) ? (link.k || link.label) : '').trim(),
        u: String(link && (link.u || link.href) ? (link.u || link.href) : '').trim(),
      })).filter((link) => link.u),
    };
  }

  const projects = sourceProjects
    .map(normalizeProject)
    .filter((project) => project && project.t && project.c)
    .filter((project) => !/^LLM EvalSphere$/i.test(project.t));
  const grid = document.getElementById('student-projects-grid');
  const typeSelect = document.getElementById('student-project-filter-type');
  const institutionSelect = document.getElementById('student-project-filter-institution');
  const resetBtn = document.getElementById('student-project-filter-reset');
  const status = document.getElementById('student-project-status');

  if (!grid || !typeSelect || !institutionSelect || !resetBtn || !status) {
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

  const institutionLogos = {
    'Holon Institute of Technology': '../assets/teaching/other-cs-courses/logos/hit.png',
    'Bar-Ilan University': '../assets/teaching/other-cs-courses/logos/biu.png',
    'Tel Aviv University': '../assets/teaching/other-cs-courses/logos/tau.png',
    'The Academic College of Tel Aviv-Yafo': '../assets/teaching/other-cs-courses/logos/mta.jpg',
  };

  function institutionAbbrev(name) {
    const map = {
      'Holon Institute of Technology': 'HIT',
      'Bar-Ilan University': 'BIU',
      'Tel Aviv University': 'TAU',
      'The Academic College of Tel Aviv-Yafo': 'MTA',
    };
    return map[name] || String(name || 'UNI').slice(0, 3).toUpperCase();
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

  function parseSemesterToken(token, dateText) {
    const rawToken = String(token || '').trim();
    if (/^\d{4}[Ff]$/.test(rawToken) || /\bFall\b/i.test(dateText)) {
      return 'Fall';
    }
    if (/^\d{4}[Ss]$/.test(rawToken) || /\bSpring\b/i.test(dateText)) {
      return 'Spring';
    }
    if (/^\d{4}\/\d{2}$/.test(rawToken)) {
      return 'Fall-Spring';
    }
    return 'Not specified';
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
      return 'Language AI';
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
    if (normalized === 'conversation ai' || normalized === 'language ai') return 'language-ai';
    if (normalized === 'vision ai') return 'vision-ai';
    if (normalized === 'scalable ai') return 'scalable-ai';
    if (normalized === 'temporal ai') return 'temporal-ai';
    return 'ai-systems';
  }

  function typeLabelFromSlug(slug) {
    const normalized = String(slug || '').trim().toLowerCase();
    if (normalized === 'language-ai' || normalized === 'conversation-ai') return 'Language AI';
    if (normalized === 'vision-ai') return 'Vision AI';
    if (normalized === 'scalable-ai') return 'Scalable AI';
    if (normalized === 'temporal-ai') return 'Temporal AI';
    if (normalized === 'ai-systems') return 'AI Systems';
    return '';
  }

  function normalizeCourseInstanceName(value) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    const canonical = {
      'LLMs & Agents': 'LLMs and Agents',
      'Workshop: LLM Applications': 'Workshop in Applied LLM Systems',
      'Workshop: GenAI Applications': 'Workshop in Generative Vision Models',
      'Workshop: Computer Vision': 'Workshop in Computer Vision',
    };
    return canonical[text] || text.replace(/\s*&\s*/g, ' and ');
  }

  function parseCourseMeta(courseLabel) {
    const raw = String(courseLabel || '').trim();
    const [instancePartRaw, rightPartRaw] = raw.split(/\s-\s(.+)/);
    const instancePart = normalizeCourseInstanceName(String(instancePartRaw || raw).trim());
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
      var semester = parseSemesterToken(dateToken, date);
    }

    if (typeof semester === 'undefined') {
      semester = parseSemesterToken('', date);
    }

    const type = inferType(instancePart);
    return {
      instanceTitle: instancePart,
      institution,
      courseInstance,
      date,
      year: yearFromDate(date),
      semester,
      type,
      typeSlug: typeSlugFromLabel(type),
    };
  }

  function normalizeDescription(rawDescription, authors) {
    let text = String(rawDescription || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      return '';
    }

    text = text.replace(/\.{3,}\s*$/g, '').trim();

    const authorText = String(authors || '').replace(/\s+/g, ' ').trim();
    if (authorText && text.toLowerCase().startsWith(authorText.toLowerCase())) {
      text = text.slice(authorText.length).trim();
    }

    text = text.replace(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,5}\s+(?=(?:A|An|The|This|It)\s)/, '').trim();

    const sentenceSplit = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentenceSplit.length > 1) {
      const first = sentenceSplit[0].trim();
      const second = sentenceSplit[1].trim();
      if (first.length < 110) {
        text = `${first} ${second}`;
      } else {
        text = first;
      }
    }

    if (text.length > 210) {
      const cutIndex = text.lastIndexOf(' ', 206);
      text = `${text.slice(0, cutIndex > 80 ? cutIndex : 206).trim()}.`;
    }

    return text;
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
    article.dataset.semester = courseMeta.semester;
    var termVal = (courseMeta.year || "") + (courseMeta.semester && courseMeta.semester !== "Not specified" ? " " + courseMeta.semester : "");
    article.dataset.term = termVal.trim() || "Not specified";
    article.dataset.courseTitle = courseMeta.instanceTitle || "";

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

    const topRow = document.createElement('div');
    topRow.className = 'student-project-card__top';

    const yearTag = document.createElement('span');
    yearTag.className = 'student-project-card__chip student-project-card__chip--year';
    yearTag.textContent = courseMeta.year;
    topRow.appendChild(yearTag);

    const institutionTag = document.createElement('span');
    institutionTag.className = 'student-project-card__institution';
    institutionTag.setAttribute('aria-label', courseMeta.institution);
    institutionTag.title = courseMeta.institution;
    const logo = institutionLogos[courseMeta.institution];
    if (logo) {
      const logoImg = document.createElement('img');
      logoImg.src = logo;
      logoImg.alt = `${courseMeta.institution} logo`;
      logoImg.loading = 'lazy';
      logoImg.decoding = 'async';
      institutionTag.appendChild(logoImg);
    } else {
      institutionTag.textContent = institutionAbbrev(courseMeta.institution);
    }
    topRow.appendChild(institutionTag);

    const typeTag = document.createElement('span');
    typeTag.className = 'student-project-card__chip student-project-card__chip--type';
    typeTag.textContent = courseMeta.type;
    topRow.appendChild(typeTag);

    var courseIcons = {
      'language-ai': '../assets/courses/hos-series/llm-course/img-006-language-ai-gemini.png',
      'vision-ai': '../assets/courses/hos-series/embvision-course/img-008-vision-ai-gemini.png',
      'scalable-ai': '../assets/courses/hos-series/bigdata-course/img-012-scalable-ai-gemini.png',
      'temporal-ai': '../assets/courses/hos-series/temporalai-course/img-008-temporal-ai-gemini.png'
    };
    var courseIconSrc = courseIcons[courseMeta.typeSlug];
    if (courseIconSrc) {
      var cIcon = document.createElement('img');
      cIcon.src = courseIconSrc;
      cIcon.alt = (courseMeta.type || '') + ' course';
      cIcon.loading = 'lazy';
      cIcon.style.cssText = 'width:22px;height:22px;object-fit:cover;border-radius:4px;border:1px solid var(--site-border,rgba(24,32,42,0.14));';
      topRow.appendChild(cIcon);
    }

    body.appendChild(topRow);

    /* Title */
    const title = document.createElement('h2');
    title.className = 'content-card__title';
    title.textContent = project.t;
    body.appendChild(title);

    /* Course name */
    const courseTag = document.createElement('p');
    courseTag.className = 'student-project-card__course-name';
    courseTag.textContent = courseMeta.instanceTitle || courseMeta.courseInstance;
    body.appendChild(courseTag);

    /* Description (no label, flows naturally) */
    const shortDescription = normalizeDescription(project.d, project.a);
    if (shortDescription) {
      const desc = document.createElement('p');
      desc.className = 'content-card__desc student-project-card__desc';
      desc.textContent = shortDescription;
      body.appendChild(desc);
    }

    /* Students (inline, no label) */
    if (project.a) {
      const meta = document.createElement('p');
      meta.className = 'content-card__meta student-project-card__students';
      meta.textContent = project.a;
      body.appendChild(meta);
    }

    const links = (project.l || [])
      .filter((link) => link && link.u)
      .filter((link) => !/^course page$/i.test(String(link.k || '').trim()));

    const bottomRow = document.createElement('div');
    bottomRow.className = 'student-project-card__bottom';

    if (links.length > 0) {
      const linksWrap = document.createElement('div');
      linksWrap.className = 'content-card__links student-project-card__links';
      const rankLink = (link) => {
        const key = String(link.k || '').toLowerCase();
        const href = String(link.u || '').toLowerCase();
        if (key.includes('github') || href.includes('github.com')) return 0;
        if (key === 'paper') return 1;
        return 2;
      };
      const orderedLinks = links.slice().sort((a, b) => rankLink(a) - rankLink(b));
      const hasGithub = orderedLinks.some((link) => /github/i.test(link.k || '') || /github\.com/i.test(link.u || ''));
      const hasPaper = orderedLinks.some((link) => /^paper$/i.test(link.k || ''));
      if (hasGithub && hasPaper) {
        linksWrap.classList.add('content-card__links--dual', 'student-project-card__links--paired');
      }
      orderedLinks.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.className = 'content-card__link';
        anchor.href = link.u;
        const isGithub = /github/i.test(link.k || '') || /github\.com/i.test(link.u || '');
        const label = isGithub ? 'GitHub' : (link.k || 'Open');
        if (isGithub) {
          anchor.classList.add('content-card__link--github');
          anchor.innerHTML = '<span class="student-link-icon" aria-hidden="true"></span><span>GitHub</span>';
        } else {
          anchor.textContent = label;
        }
        if (/^https?:\/\//i.test(link.u)) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        linksWrap.appendChild(anchor);
      });
      bottomRow.appendChild(linksWrap);
      body.appendChild(bottomRow);
    }

    article.appendChild(body);
    return article;
  });

  cards.forEach((card) => grid.appendChild(card));

  const termSelect = document.getElementById('student-project-filter-term');
  const courseSelect = document.getElementById('student-project-filter-course');

  const allTypes = Array.from(new Set(cards.map((card) => card.dataset.type).filter(Boolean))).sort();
  const allInstitutions = Array.from(new Set(cards.map((card) => card.dataset.institution).filter(Boolean))).sort();
  const allTerms = Array.from(new Set(cards.map((card) => card.dataset.term).filter(Boolean)))
    .sort((a, b) => {
      if (a === 'Not specified') return 1;
      if (b === 'Not specified') return -1;
      return b.localeCompare(a);
    });
  const allCourses = Array.from(new Set(cards.map((card) => card.dataset.courseTitle).filter(Boolean))).sort();

  appendOptions(typeSelect, allTypes, optionLabelFromSlug);
  appendOptions(institutionSelect, allInstitutions, (v) => v);
  if (termSelect) appendOptions(termSelect, allTerms, (v) => v);
  if (courseSelect) appendOptions(courseSelect, allCourses, (v) => v);

  const params = new URLSearchParams(window.location.search);
  const presetType = String(params.get('type') || '').trim().toLowerCase();
  const presetInstitution = String(params.get('institution') || '').trim();
  const presetTerm = String(params.get('term') || '').trim();
  const presetCourse = String(params.get('course') || '').trim();

  if (presetType && allTypes.includes(presetType)) {
    typeSelect.value = presetType;
  }
  if (presetInstitution && allInstitutions.includes(presetInstitution)) {
    institutionSelect.value = presetInstitution;
  }
  if (presetTerm && termSelect && allTerms.includes(presetTerm)) {
    termSelect.value = presetTerm;
  }
  if (presetCourse && courseSelect && allCourses.includes(presetCourse)) {
    courseSelect.value = presetCourse;
  }

  function applyFilters() {
    const type = typeSelect.value;
    const institution = institutionSelect.value;
    const term = termSelect ? termSelect.value : 'all';
    const course = courseSelect ? courseSelect.value : 'all';
    let visible = 0;

    cards.forEach((card) => {
      const typeMatch = type === 'all' || card.dataset.type === type;
      const institutionMatch = institution === 'all' || card.dataset.institution === institution;
      const termMatch = term === 'all' || card.dataset.term === term;
      const courseMatch = course === 'all' || card.dataset.courseTitle === course;
      const match = typeMatch && institutionMatch && termMatch && courseMatch;
      card.hidden = !match;
      if (match) {
        visible += 1;
      }
    });

    status.textContent = `Showing ${visible} of ${cards.length} projects`;
  }

  [typeSelect, institutionSelect, termSelect, courseSelect].filter(Boolean).forEach((selectEl) => {
    selectEl.addEventListener('change', applyFilters);
  });

  resetBtn.addEventListener('click', () => {
    typeSelect.value = 'all';
    institutionSelect.value = 'all';
    if (termSelect) termSelect.value = 'all';
    if (courseSelect) courseSelect.value = 'all';
    applyFilters();
  });

  applyFilters();
})();
