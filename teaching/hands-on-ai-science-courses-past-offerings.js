(function () {
  const offerings = Array.isArray(window.HOS_PAST_OFFERINGS)
    ? window.HOS_PAST_OFFERINGS
    : [];
  const grid = document.getElementById("past-offerings-grid");
  const yearSelect = document.getElementById("offering-filter-year");
  const institutionSelect = document.getElementById("offering-filter-institution");
  const semesterSelect = document.getElementById("offering-filter-semester");
  const typeSelect = document.getElementById("offering-filter-type");
  const resetBtn = document.getElementById("offering-filter-reset");
  const status = document.getElementById("offering-filter-status");
  if (!grid || !yearSelect || !institutionSelect || !semesterSelect || !typeSelect || !resetBtn || !status || offerings.length === 0) {
    return;
  }

  const labelFromSlug = (value) => value.split("-").map((chunk) => chunk ? chunk[0].toUpperCase() + chunk.slice(1) : "").join(" ");
  const typeLabels = {
    "language-ai": "Language AI",
    "vision-ai": "Vision AI",
    "scalable-ai": "Scalable AI",
    "temporal-ai": "Temporal AI"
  };
  const semesterLabels = {
    "fall-spring": "Fall-Spring",
    "spring": "Spring",
    "fall": "Fall",
    "summer": "Summer",
    "winter": "Winter"
  };
  const semesterSortOrder = {
    "fall-spring": 0,
    "spring": 1,
    "fall": 2,
    "summer": 3,
    "winter": 4
  };
  const institutionLabels = {
    "academic-college-of-tel-aviv-yafo": "The Academic College of Tel Aviv-Yafo",
    "bar-ilan-university": "Bar-Ilan University",
    "holon-institute-of-technology": "Holon Institute of Technology",
    "tel-aviv-university": "Tel-Aviv University"
  };
  const logoByInstitution = {
    "academic-college-of-tel-aviv-yafo": "../assets/teaching/other-cs-courses/logos/mta.jpg",
    "bar-ilan-university": "../assets/teaching/other-cs-courses/logos/biu.png",
    "holon-institute-of-technology": "../assets/teaching/other-cs-courses/logos/hit.png",
    "tel-aviv-university": "../assets/teaching/other-cs-courses/logos/tau.png"
  };
  const fallbackByInstitution = {
    "academic-college-of-tel-aviv-yafo": "MTA",
    "bar-ilan-university": "BIU",
    "holon-institute-of-technology": "HIT",
    "tel-aviv-university": "TAU"
  };
  const imageByType = {
    "language-ai": "../assets/courses/hos-series/llm-course/img-006-language-ai-gemini.png",
    "vision-ai": "../assets/courses/hos-series/embvision-course/img-008-vision-ai-gemini.png",
    "scalable-ai": "../assets/courses/hos-series/bigdata-course/img-012-scalable-ai-gemini.png",
    "temporal-ai": "../assets/courses/hos-series/temporalai-course/img-008-temporal-ai-gemini.png"
  };
  const syllabusByType = {
    "language-ai": "../courses/hos/series/language-ai.html",
    "vision-ai": "../courses/hos/series/vision-ai.html",
    "scalable-ai": "../courses/hos/series/scalable-ai.html",
    "temporal-ai": "../courses/hos/series/temporal-ai.html"
  };
  const normalizeSemester = (value) => {
    const normalized = (value || "").trim().toLowerCase().replace(/\s+/g, "-");
    if (normalized === "spring-fall" || normalized === "spring--fall") {
      return "fall-spring";
    }
    return normalized.replace(/--+/g, "-");
  };

  function semestersFromText(text) {
    const normalizedText = (text || "").trim();
    if (!normalizedText) return [];
    const found = new Set();
    const regex = /(fall\s*-\s*spring|spring\s*-\s*fall|spring|fall|summer|winter)/ig;
    let match = regex.exec(normalizedText);
    while (match) {
      found.add(normalizeSemester(match[1]));
      match = regex.exec(normalizedText);
    }
    return Array.from(found).filter(Boolean);
  }

  function formatYearTag(card) {
    const years = (card.dataset.years || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (years.length >= 2) return `${years[0]}-${years[years.length - 1]}`;
    if (years.length === 1) return years[0];
    const descText = (card.querySelector(".content-card__desc")?.textContent || "").trim();
    const match = descText.match(/\b(19|20)\d{2}\b/g);
    if (!match || match.length === 0) return "";
    if (match.length === 1) return match[0];
    return `${match[0]}-${match[match.length - 1]}`;
  }

  function createCard(item) {
    const article = document.createElement("article");
    article.className = "content-card content-card--collection";
    article.dataset.years = item.years || "";
    article.dataset.institution = item.institution || "";
    article.dataset.courseType = item.type || "";

    const media = document.createElement("div");
    media.className = "content-card__media";
    const image = document.createElement("img");
    image.src = item.image || "";
    image.alt = item.imageAlt || item.title || "Course offering visual";
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "content-card__eyebrow";
    eyebrow.textContent = item.institutionLabel || institutionLabels[item.institution] || "";
    body.appendChild(eyebrow);

    const title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = item.title || "";
    body.appendChild(title);

    const track = document.createElement("p");
    track.className = "course-track-tag";
    const trackLink = document.createElement("a");
    trackLink.href = item.trackHref || "#";
    trackLink.textContent = item.trackLabel || (typeLabels[item.type] || labelFromSlug(item.type || ""));
    track.appendChild(trackLink);
    body.appendChild(track);

    const meta = document.createElement("p");
    meta.className = "content-card__meta";
    meta.textContent = item.meta || "";
    body.appendChild(meta);

    const desc = document.createElement("p");
    desc.className = "content-card__desc";
    desc.textContent = item.desc || "";
    body.appendChild(desc);

    const links = Array.isArray(item.links) ? item.links : [];
    if (links.length > 0) {
      const linksWrap = document.createElement("div");
      linksWrap.className = "content-card__links";
      links.forEach((link) => {
        if (!link || !link.href) return;
        const anchor = document.createElement("a");
        anchor.className = "content-card__link";
        anchor.href = link.href;
        anchor.textContent = link.label || "Open";
        if (/^https?:\/\//i.test(link.href)) {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
        }
        linksWrap.appendChild(anchor);
      });
      body.appendChild(linksWrap);
    }

    article.appendChild(body);
    return article;
  }

  const cards = offerings.map((item) => {
    const card = createCard(item);
    grid.appendChild(card);
    return card;
  });

  cards.forEach((card) => {
    const courseType = card.dataset.courseType || "";
    const institution = card.dataset.institution || "";
    const descTextRaw = (card.querySelector(".content-card__desc")?.textContent || "").trim();
    const explicitSemesters = (card.dataset.semester || "")
      .split(",")
      .map((value) => normalizeSemester(value))
      .filter(Boolean);
    const derivedSemesters = semestersFromText(descTextRaw);
    const mergedSemesters = Array.from(new Set([...explicitSemesters, ...derivedSemesters]));
    if (mergedSemesters.length) {
      card.dataset.semester = mergedSemesters.join(",");
    }

    const mediaImage = card.querySelector(".content-card__media img");
    if (mediaImage && imageByType[courseType]) {
      mediaImage.src = imageByType[courseType];
    }

    const trackLink = card.querySelector(".course-track-tag a");
    if (trackLink && syllabusByType[courseType]) {
      trackLink.href = syllabusByType[courseType];
    }
    const body = card.querySelector(".content-card__body");
    const trackTag = card.querySelector(".course-track-tag");
    if (body && trackTag) {
      const topRow = document.createElement("div");
      topRow.className = "offering-card-top";
      const yearTagText = formatYearTag(card);
      if (yearTagText) {
        const yearTag = document.createElement("span");
        yearTag.className = "offering-year-tag";
        yearTag.textContent = yearTagText;
        topRow.appendChild(yearTag);
      } else {
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        topRow.appendChild(spacer);
      }

      topRow.appendChild(trackTag);
      body.insertBefore(topRow, body.firstChild);
    }

    const eyebrow = card.querySelector(".content-card__eyebrow");
    if (eyebrow) {
      const text = (eyebrow.textContent || "").trim();
      eyebrow.textContent = "";

      const wrapper = document.createElement("span");
      wrapper.className = "offering-institution";

      if (logoByInstitution[institution]) {
        const logo = document.createElement("img");
        logo.className = "offering-institution__logo";
        logo.src = logoByInstitution[institution];
        logo.alt = `${institutionLabels[institution] || text} logo`;
        logo.loading = "lazy";
        logo.decoding = "async";
        wrapper.appendChild(logo);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "offering-institution__logo-fallback";
        fallback.textContent = fallbackByInstitution[institution] || "UNI";
        fallback.setAttribute("aria-hidden", "true");
        wrapper.appendChild(fallback);
      }

      const name = document.createElement("span");
      name.className = "offering-institution__name";
      name.textContent = text;
      wrapper.appendChild(name);
      eyebrow.appendChild(wrapper);
    }

    const desc = card.querySelector(".content-card__desc");
    if (desc) {
      const cleaned = (desc.textContent || "").replace(/^\s*\d{4}(?:-\d{4})?\s*,?\s*/i, "").trim();
      if (cleaned) {
        desc.textContent = cleaned;
      } else {
        desc.remove();
      }
    }
  });

  function appendOptions(selectEl, values, toLabel) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = toLabel(value);
      selectEl.appendChild(option);
    });
  }

  const years = Array.from(new Set(cards.flatMap((card) => (card.dataset.years || "").split(",").map((y) => y.trim()).filter(Boolean))))
    .sort((a, b) => Number(b) - Number(a));
  const institutions = Array.from(new Set(cards.map((card) => card.dataset.institution || "").filter(Boolean))).sort();
  const semesters = Array.from(new Set(cards.flatMap((card) => (card.dataset.semester || "").split(",").map((value) => normalizeSemester(value)).filter(Boolean))))
    .sort((a, b) => {
      const rankDiff = (semesterSortOrder[a] ?? 999) - (semesterSortOrder[b] ?? 999);
      return rankDiff !== 0 ? rankDiff : a.localeCompare(b);
    });
  const types = Array.from(new Set(cards.map((card) => card.dataset.courseType || "").filter(Boolean))).sort();

  appendOptions(yearSelect, years, (v) => v);
  appendOptions(institutionSelect, institutions, (v) => institutionLabels[v] || labelFromSlug(v));
  appendOptions(semesterSelect, semesters, (v) => semesterLabels[v] || labelFromSlug(v));
  appendOptions(typeSelect, types, (v) => typeLabels[v] || labelFromSlug(v));

  const params = new URLSearchParams(window.location.search);
  const presetYear = (params.get("year") || "").trim();
  const presetInstitution = (params.get("institution") || "").trim();
  const presetSemester = normalizeSemester((params.get("semester") || "").trim());
  const presetType = (params.get("type") || "").trim().toLowerCase();
  if (presetYear && years.includes(presetYear)) yearSelect.value = presetYear;
  if (presetInstitution && institutions.includes(presetInstitution)) institutionSelect.value = presetInstitution;
  if (presetSemester && semesters.includes(presetSemester)) semesterSelect.value = presetSemester;
  if (presetType && types.includes(presetType)) typeSelect.value = presetType;

  function updateStatus(visibleCount) {
    status.textContent = `Showing ${visibleCount} of ${cards.length} offerings`;
  }

  function applyFilters() {
    const year = yearSelect.value;
    const institution = institutionSelect.value;
    const semester = semesterSelect.value;
    const type = typeSelect.value;
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardYears = (card.dataset.years || "").split(",").map((y) => y.trim()).filter(Boolean);
      const cardSemesters = (card.dataset.semester || "").split(",").map((value) => normalizeSemester(value)).filter(Boolean);
      const yearMatch = year === "all" || cardYears.includes(year);
      const semesterMatch = semester === "all" || cardSemesters.includes(semester);
      const institutionMatch = institution === "all" || card.dataset.institution === institution;
      const typeMatch = type === "all" || card.dataset.courseType === type;
      const visible = yearMatch && semesterMatch && institutionMatch && typeMatch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    grid.classList.toggle("past-offerings-grid--single", visibleCount === 1);
    updateStatus(visibleCount);
  }

  [yearSelect, institutionSelect, semesterSelect, typeSelect].forEach((selectEl) => {
    selectEl.addEventListener("change", applyFilters);
  });

  resetBtn.addEventListener("click", () => {
    yearSelect.value = "all";
    institutionSelect.value = "all";
    semesterSelect.value = "all";
    typeSelect.value = "all";
    applyFilters();
  });

  applyFilters();
})();
