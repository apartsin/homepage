(function () {
  var cards = Array.isArray(window.PAST_RESEARCH_TASK_CARDS)
    ? window.PAST_RESEARCH_TASK_CARDS
    : [];
  var grid = document.getElementById("past-research-tasks-grid");
  if (!grid || cards.length === 0) return;

  /* ── build cards with decade headings ── */
  var decadeLabels = {
    "2020s": "2020-2024",
    "2010s": "2010-2020",
    "2000s": "2000-2010",
    "1990s": "1990-2000"
  };
  var lastDecade = "";
  cards.forEach(function (card) {
    var decade = Math.floor(parseInt(card.year, 10) / 10) * 10 + "s";
    if (decade !== lastDecade) {
      var heading = document.createElement("h3");
      heading.className = "prt-decade-heading";
      heading.textContent = decadeLabels[decade] || decade;
      heading.dataset.decade = decade;
      grid.appendChild(heading);
      lastDecade = decade;
    }
    var article = document.createElement("article");
    article.className = "prt-card";
    article.dataset.year = card.year;
    article.dataset.org = card.organization;
    article.dataset.types = (card.dataTypes || []).join(",");

    /* year badge */
    var year = document.createElement("p");
    year.className = "prt-card__year";
    year.textContent = card.year;
    article.appendChild(year);

    /* company row: logo + name */
    var orgRow = document.createElement("div");
    orgRow.className = "prt-card__org-row";

    if (card.logo) {
      var logoWrap = document.createElement("span");
      logoWrap.className = "prt-card__logo-wrap";
      var logoImg = document.createElement("img");
      logoImg.className = "prt-card__logo";
      logoImg.src = card.logo;
      logoImg.alt = card.organization + " logo";
      logoImg.loading = "lazy";
      logoImg.decoding = "async";
      logoWrap.appendChild(logoImg);
      orgRow.appendChild(logoWrap);
    }

    var orgName = document.createElement("p");
    orgName.className = "prt-card__org";
    orgName.textContent = card.organization;
    orgRow.appendChild(orgName);

    article.appendChild(orgRow);

    /* project title */
    var title = document.createElement("h2");
    title.className = "prt-card__title";
    title.textContent = card.title || "";
    article.appendChild(title);

    /* footer: tags left, links right */
    var footer = document.createElement("div");
    footer.className = "prt-card__footer";

    if (card.dataTypes && card.dataTypes.length) {
      var tagsWrap = document.createElement("div");
      tagsWrap.className = "prt-card__tags";
      card.dataTypes.forEach(function (dt) {
        var tag = document.createElement("span");
        tag.className = "prt-card__tag";
        tag.textContent = dt;
        tagsWrap.appendChild(tag);
      });
      footer.appendChild(tagsWrap);
    }

    if (card.links && card.links.length) {
      var linksWrap = document.createElement("div");
      linksWrap.className = "prt-card__links";
      card.links.forEach(function (lnk) {
        var a = document.createElement("a");
        a.className = "prt-card__link";
        a.href = lnk.href;
        a.textContent = lnk.label || "Link";
        if (/^https?:\/\//i.test(lnk.href)) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        linksWrap.appendChild(a);
      });
      footer.appendChild(linksWrap);
    }

    article.appendChild(footer);

    grid.appendChild(article);
  });

  /* ── filter logic ── */
  var decadeSelect = document.getElementById("prt-filter-decade");
  var orgSelect = document.getElementById("prt-filter-org");
  var typeSelect = document.getElementById("prt-filter-type");
  var emptyMsg = document.getElementById("prt-filter-empty");
  var countEl = document.getElementById("prt-filter-count");
  if (!decadeSelect || !orgSelect || !typeSelect) return;

  /* populate selects from data */
  var decadeSet = {};
  var orgSet = {};
  var typeSet = {};
  var decades = [];
  var orgs = [];
  var types = [];

  cards.forEach(function (c) {
    var d = Math.floor(parseInt(c.year, 10) / 10) * 10 + "s";
    if (!decadeSet[d]) { decadeSet[d] = true; decades.push(d); }
    if (!orgSet[c.organization]) { orgSet[c.organization] = true; orgs.push(c.organization); }
    (c.dataTypes || []).forEach(function (t) {
      if (!typeSet[t]) { typeSet[t] = true; types.push(t); }
    });
  });

  decades.sort(function (a, b) { return b.localeCompare(a); });
  orgs.sort();
  types.sort();

  function addOptions(select, values) {
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  addOptions(decadeSelect, decades);
  addOptions(orgSelect, orgs);
  addOptions(typeSelect, types);

  function applyFilters() {
    var dVal = decadeSelect.value;
    var oVal = orgSelect.value;
    var tVal = typeSelect.value;
    var allEls = grid.querySelectorAll(".prt-card");
    var visible = 0;

    for (var i = 0; i < allEls.length; i++) {
      var el = allEls[i];
      var yr = parseInt(el.dataset.year, 10);
      var decade = Math.floor(yr / 10) * 10 + "s";
      var cardOrg = el.dataset.org;
      var cardTypes = el.dataset.types.split(",");

      var show = true;
      if (dVal !== "all" && decade !== dVal) show = false;
      if (oVal !== "all" && cardOrg !== oVal) show = false;
      if (tVal !== "all" && cardTypes.indexOf(tVal) < 0) show = false;

      el.hidden = !show;
      if (show) visible++;
    }

    /* Hide decade headings with no visible cards */
    var headings = grid.querySelectorAll(".prt-decade-heading");
    for (var h = 0; h < headings.length; h++) {
      var hDecade = headings[h].dataset.decade;
      var nextSibling = headings[h].nextElementSibling;
      var hasVisible = false;
      while (nextSibling && !nextSibling.classList.contains("prt-decade-heading")) {
        if (!nextSibling.hidden) { hasVisible = true; break; }
        nextSibling = nextSibling.nextElementSibling;
      }
      headings[h].hidden = !hasVisible;
    }

    if (emptyMsg) emptyMsg.hidden = visible > 0;
    if (countEl) countEl.textContent = visible + " of " + allEls.length + " projects";
  }

  decadeSelect.addEventListener("change", applyFilters);
  orgSelect.addEventListener("change", applyFilters);
  typeSelect.addEventListener("change", applyFilters);

  applyFilters();
})();
