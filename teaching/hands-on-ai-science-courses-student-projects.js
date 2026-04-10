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
  const filterRoot = document.getElementById('student-project-filter');
  const status = document.getElementById('student-project-status');

  if (!grid || !filterRoot || !status) {
    return;
  }

  const uniqueCourses = Array.from(new Set(projects.map((project) => project.c)));
  const courseOrder = ['All'].concat(uniqueCourses);
  let activeCourse = 'All';

  const cards = projects.map((project) => {
    const article = document.createElement('article');
    article.className = 'content-card content-card--collection student-project-card';
    article.dataset.course = project.c;

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

    const eyebrow = document.createElement('p');
    eyebrow.className = 'content-card__eyebrow';
    eyebrow.textContent = project.c;
    body.appendChild(eyebrow);

    const title = document.createElement('h2');
    title.className = 'content-card__title';
    title.textContent = project.t;
    body.appendChild(title);

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

    const courseTag = project.c.split(' - ')[0] || project.c;
    const derivedTags = Array.from(new Set((project.l || [])
      .map((link) => (link && link.k ? String(link.k).trim() : ''))
      .filter((label) => label && !/^course page$/i.test(label))));

    if (courseTag || derivedTags.length > 0) {
      const tags = document.createElement('div');
      tags.className = 'student-project-card__tags';
      if (courseTag) {
        const coursePill = document.createElement('span');
        coursePill.className = 'student-project-card__tag student-project-card__tag--course';
        coursePill.textContent = courseTag;
        tags.appendChild(coursePill);
      }
      derivedTags.slice(0, 3).forEach((tagText) => {
        const tag = document.createElement('span');
        tag.className = 'student-project-card__tag';
        tag.textContent = tagText;
        tags.appendChild(tag);
      });
      body.appendChild(tags);
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

  function applyFilter() {
    let visible = 0;
    cards.forEach((card) => {
      const match = activeCourse === 'All' || card.dataset.course === activeCourse;
      card.hidden = !match;
      if (match) {
        visible += 1;
      }
    });
    status.textContent = `Showing ${visible} of ${cards.length} projects`;
  }

  courseOrder.forEach((course) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `student-projects-chip${course === activeCourse ? ' is-active' : ''}`;
    button.textContent = course;
    button.setAttribute('aria-pressed', course === activeCourse ? 'true' : 'false');
    button.addEventListener('click', () => {
      activeCourse = course;
      Array.from(filterRoot.querySelectorAll('.student-projects-chip')).forEach((chip) => {
        const selected = chip.textContent === course;
        chip.classList.toggle('is-active', selected);
        chip.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      applyFilter();
    });
    filterRoot.appendChild(button);
  });

  applyFilter();
})();
