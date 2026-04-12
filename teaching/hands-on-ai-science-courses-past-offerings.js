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

    var typeColors = {
      "language-ai": { bg1: "#1d3557", bg2: "#457b9d", accent: "#a8dadc" },
      "vision-ai":   { bg1: "#2d6a4f", bg2: "#52b788", accent: "#d8f3dc" },
      "scalable-ai": { bg1: "#7a3f16", bg2: "#c2844a", accent: "#fde8d0" },
      "temporal-ai": { bg1: "#5a189a", bg2: "#9d4edd", accent: "#e0aaff" }
    };
    var tc = typeColors[item.type] || typeColors["language-ai"];
    var rawTitle = (item.title || "Course");
    var courseSubtitles = {
      "Language AI": "A HoS AI Course: Building Language AI with LLMs and Agents",
      "Vision AI": "A HoS AI Course: Building Vision AI with Foundation and Generative Models",
      "Scalable AI": "A HoS AI Course: Building Scalable AI with Big Data",
      "Temporal AI": "A HoS AI Course: Building Temporal AI with RL and World Models"
    };
    var svgSubtitle = courseSubtitles[item.trackLabel] || item.trackLabel || "";
    /* Word-wrap title */
    var words = rawTitle.split(" ");
    var lines = [];
    var cur = "";
    for (var w = 0; w < words.length; w++) {
      if (cur && (cur + " " + words[w]).length > 24) {
        lines.push(cur);
        cur = words[w];
      } else {
        cur = cur ? cur + " " + words[w] : words[w];
      }
    }
    if (cur) lines.push(cur);

    /* Build inline SVG element */
    var ns = "http://www.w3.org/2000/svg";
    var cardId = "og" + Math.random().toString(36).slice(2, 8);
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 480 200");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", rawTitle);
    svg.style.cssText = "width:100%;height:100%;display:block;";

    var defs = document.createElementNS(ns, "defs");
    var grad = document.createElementNS(ns, "linearGradient");
    grad.id = cardId;
    grad.setAttribute("x1", "0"); grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "1"); grad.setAttribute("y2", "1");
    var s1 = document.createElementNS(ns, "stop");
    s1.setAttribute("offset", "0%"); s1.setAttribute("stop-color", tc.bg1);
    var s2 = document.createElementNS(ns, "stop");
    s2.setAttribute("offset", "100%"); s2.setAttribute("stop-color", tc.bg2);
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    var bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", "480"); bg.setAttribute("height", "200");
    bg.setAttribute("fill", "url(#" + cardId + ")");
    svg.appendChild(bg);

    var c1 = document.createElementNS(ns, "circle");
    c1.setAttribute("cx", "420"); c1.setAttribute("cy", "30"); c1.setAttribute("r", "90");
    c1.setAttribute("fill", tc.accent); c1.setAttribute("opacity", "0.1");
    svg.appendChild(c1);

    var c2 = document.createElementNS(ns, "circle");
    c2.setAttribute("cx", "50"); c2.setAttribute("cy", "180"); c2.setAttribute("r", "70");
    c2.setAttribute("fill", tc.accent); c2.setAttribute("opacity", "0.07");
    svg.appendChild(c2);

    var titleY = lines.length === 1 ? 95 : lines.length === 2 ? 80 : 70;
    for (var li = 0; li < lines.length; li++) {
      var txt = document.createElementNS(ns, "text");
      txt.setAttribute("x", "240"); txt.setAttribute("y", String(titleY + li * 30));
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-family", "sans-serif");
      txt.setAttribute("font-weight", "800");
      txt.setAttribute("font-size", "24");
      txt.setAttribute("fill", "#fff");
      txt.textContent = lines[li];
      svg.appendChild(txt);
    }

    /* Institution logo top-left */
    var instSlug = item.institution || "";
    var logoUrl = {
      "academic-college-of-tel-aviv-yafo": "../assets/teaching/other-cs-courses/logos/mta.jpg",
      "bar-ilan-university": "../assets/teaching/other-cs-courses/logos/biu.png",
      "holon-institute-of-technology": "../assets/teaching/other-cs-courses/logos/hit.png",
      "tel-aviv-university": "../assets/teaching/other-cs-courses/logos/tau.png"
    }[instSlug];
    if (logoUrl) {
      var logoBg = document.createElementNS(ns, "rect");
      logoBg.setAttribute("x", "8"); logoBg.setAttribute("y", "8");
      logoBg.setAttribute("width", "64"); logoBg.setAttribute("height", "64");
      logoBg.setAttribute("rx", "12");
      logoBg.setAttribute("fill", "#fff");
      svg.appendChild(logoBg);
      var logoImg = document.createElementNS(ns, "image");
      logoImg.setAttribute("x", "14"); logoImg.setAttribute("y", "14");
      logoImg.setAttribute("width", "52"); logoImg.setAttribute("height", "52");
      logoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", logoUrl);
      svg.appendChild(logoImg);
    }

    /* Program name below course title */
    var programName = item.meta || "";
    if (programName) {
      var progTxt = document.createElementNS(ns, "text");
      var progY = titleY + lines.length * 30 + 6;
      progTxt.setAttribute("x", "240"); progTxt.setAttribute("y", String(progY));
      progTxt.setAttribute("text-anchor", "middle");
      progTxt.setAttribute("font-family", "sans-serif");
      progTxt.setAttribute("font-weight", "500");
      progTxt.setAttribute("font-size", "15");
      progTxt.setAttribute("fill", "#fbbf24");
      progTxt.textContent = programName;
      svg.appendChild(progTxt);
    }

    /* Year+semester badge top-right */
    var yearText = (item.desc || "").trim() || item.years || "";
    var badgeWidth = Math.max(80, yearText.length * 8 + 20);
    var yrBg = document.createElementNS(ns, "rect");
    yrBg.setAttribute("x", String(470 - badgeWidth)); yrBg.setAttribute("y", "10");
    yrBg.setAttribute("width", String(badgeWidth)); yrBg.setAttribute("height", "24");
    yrBg.setAttribute("rx", "12");
    yrBg.setAttribute("fill", "rgba(0,0,0,0.35)");
    svg.appendChild(yrBg);
    var yrTxt = document.createElementNS(ns, "text");
    yrTxt.setAttribute("x", String(470 - badgeWidth / 2)); yrTxt.setAttribute("y", "27");
    yrTxt.setAttribute("text-anchor", "middle");
    yrTxt.setAttribute("font-family", "sans-serif");
    yrTxt.setAttribute("font-weight", "800");
    yrTxt.setAttribute("font-size", "14");
    yrTxt.setAttribute("fill", "#fff");
    yrTxt.textContent = yearText;
    svg.appendChild(yrTxt);

    /* Background bar for subtitle */
    var bar = document.createElementNS(ns, "rect");
    bar.setAttribute("x", "0"); bar.setAttribute("y", "170");
    bar.setAttribute("width", "480"); bar.setAttribute("height", "30");
    bar.setAttribute("fill", "rgba(0,0,0,0.3)");
    svg.appendChild(bar);

    /* Subtitle: "A HoS AI Course:" in accent color, then course name with colored focus */
    var courseNames = {
      "Language AI": { prefix: "Building ", focus: "Language AI", suffix: " with LLMs and Agents", color: "#60a5fa" },
      "Vision AI": { prefix: "Building ", focus: "Vision AI", suffix: " with Foundation and Generative Models", color: "#4ade80" },
      "Scalable AI": { prefix: "Building ", focus: "Scalable AI", suffix: " with Big Data", color: "#fb923c" },
      "Temporal AI": { prefix: "Building ", focus: "Temporal AI", suffix: " with RL and World Models", color: "#c084fc" }
    };
    var cn = courseNames[item.trackLabel] || { prefix: "", focus: item.trackLabel || "", suffix: "", color: "#fff" };

    var sub = document.createElementNS(ns, "text");
    sub.setAttribute("x", "240"); sub.setAttribute("y", "190");
    sub.setAttribute("text-anchor", "middle");
    sub.setAttribute("font-family", "sans-serif");
    sub.setAttribute("font-size", "12");

    var span1 = document.createElementNS(ns, "tspan");
    span1.setAttribute("font-weight", "800");
    span1.setAttribute("fill", "#fbbf24");
    span1.textContent = "A HoS AI Course: ";
    sub.appendChild(span1);

    var span2 = document.createElementNS(ns, "tspan");
    span2.setAttribute("font-weight", "600");
    span2.setAttribute("fill", "#fff");
    span2.textContent = cn.prefix;
    sub.appendChild(span2);

    var span3 = document.createElementNS(ns, "tspan");
    span3.setAttribute("font-weight", "800");
    span3.setAttribute("fill", cn.color);
    span3.textContent = cn.focus;
    sub.appendChild(span3);

    var span4 = document.createElementNS(ns, "tspan");
    span4.setAttribute("font-weight", "600");
    span4.setAttribute("fill", "rgba(255,255,255,0.6)");
    span4.textContent = cn.suffix;
    sub.appendChild(span4);

    svg.appendChild(sub);

    var media = document.createElement("div");
    media.className = "content-card__media";
    media.appendChild(svg);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    var allLinks = Array.isArray(item.links) ? item.links.slice() : [];
    if (item.trackHref) {
      allLinks.push({ label: "HoS AI Course", href: item.trackHref });
    }
    const links = allLinks;
    if (links.length > 0) {
      const linksWrap = document.createElement("div");
      linksWrap.className = "content-card__links";
      links.forEach((link) => {
        if (!link || !link.href) return;
        const anchor = document.createElement("a");
        anchor.className = "content-card__link";
        anchor.href = link.href;
        var lbl = link.label || "Open";
        if (/moodle/i.test(lbl)) {
          var mIcon = document.createElement("img");
          mIcon.src = "../assets/icons/moodle.svg";
          mIcon.alt = "Moodle";
          mIcon.style.cssText = "width:14px;height:14px;vertical-align:-2px;margin-right:3px;";
          anchor.appendChild(mIcon);
          anchor.appendChild(document.createTextNode(lbl));
        } else {
          anchor.textContent = lbl;
        }
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
