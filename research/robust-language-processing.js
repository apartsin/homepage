/* robust-language-processing.js
   Unified, filterable view for the "Robust Language Processing" theme.
   Pulls from the site's data files (publications, patents, recent projects,
   past-project industry work) plus a curated set of supervised thesis students,
   tags each item by TYPE and APPLICATION, groups into application sections, and
   filters via Type / Application / Year dropdowns. No duplicates: work that
   already appears as a paper/preprint is not repeated as a student card. */
(function () {
  "use strict";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function extLink(href, label) {
    var a = el("a", null, label);
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    return a;
  }

  /* ---------- application classifier (fallback = Media & Consumer) ---------- */
  var APP_RULES = [
    ["Healthcare", /clinical|patient|\bmedic|medication|health|diagnos|\bEMS\b|oncolog|\bPTSD\b|infection|\bSBAR\b|casualt|discharge|radiolog|\bADR\b|\bPMOS\b|c-sec|nurse|pharma|\bcare\b|trauma|symptom/i],
    ["Public Safety", /maritime|distress|public safety|body-?worn|body ?cam|weapon|firearm|\bincident\b|emergency|tactical|battlefield|combat|rescue|hazard|surveillance|311/i],
    ["Talent Management", /resume|r[eé]sum|seniorit|\btalent\b|\bhiring\b|candidate|\bcv\b|recruit|career|\bskill/i],
    ["Education", /student|teaching|educat|\bcourse\b|grading|grade|learner|rubric|classroom|pedagog|deliberate practice|tutor|lecture/i],
    ["IT & Software", /\bcode\b|\bapi\b|\blog\b|software|regulat|\bbank|support ticket|\brag\b|injection|devops|datasheet|\bsql\b|dashboard|document|search|handwriting|ocr|customer support|service assistant|intent|ticket|prompt|synthetic data|pipeline|analytics|automation|query|schema/i],
    ["Media & Consumer", /headline|clickbait|lyric|emotion|toxic|sentiment|social media|twitter|instagram|whatsapp|\bbias\b|\bnli\b|\bnews\b|\bmood\b|catering|flight|comic|advertis|reminiscen|bookmark/i]
  ];
  function classifyApp(text) {
    text = String(text || "");
    for (var i = 0; i < APP_RULES.length; i++) if (APP_RULES[i][1].test(text)) return APP_RULES[i][0];
    return "Media & Consumer";
  }

  var items = [];

  /* ---------- Publications (language subset) ---------- */
  var PAPER_IDS = {
    "pub-2026-spine-benchmark": 1, "pub-2026-coeval": 1, "pub-2026-diagnostic-questioning": 1,
    "pub-2025-llm-intent-service": 1, "pub-2026-sea-alert": 1, "pub-2025-fuzzy-speech-medical": 1,
    "pub-2025-interjection-classification": 1, "pub-2025-resume-seniority": 1,
    "pub-2025-health-crises-medication": 1, "pub-2025-emotion-pop-lyrics": 1, "pub-2026-irc-bench": 1,
    "pub-2025-semantic-text-relations": 1, "pub-inprep-medfollow": 1, "pub-2026-headline-rewriting": 1,
    "pub-2025-clickbait-detection": 1, "pub-2026-clinical-comm-synthetic-survey": 1,
    "pub-2026-healthcare-it-computable-care": 1, "pub-2026-promptforge": 1, "pub-inprep-absa-courses": 1,
    "pub-inprep-imperfect-student": 1, "pub-2025-review-recommendation": 1,
    "pub-2025-teaching-practice-platform": 1, "pub-2026-coreason": 1
  };
  var APP_OVERRIDE = {
    "pub-2026-irc-bench": "Healthcare",
    "pub-2025-teaching-practice-platform": "Education",
    "pub-inprep-imperfect-student": "Education"
  };
  var TYPE_OVERRIDE = { "pub-2026-promptforge": "Research Project" };
  (window.RECENT_PUBLICATIONS || []).filter(function (p) { return PAPER_IDS[p.id]; }).forEach(function (p) {
    var links = [];
    if (p.venueHref) links.push({ k: /arxiv/i.test(p.venueHref) ? "arXiv" : (/github/i.test(p.venueHref) ? "Project" : "Paper"), u: p.venueHref });
    items.push({
      type: TYPE_OVERRIDE[p.id] || (p.type === "Journal" ? "Paper" : "Preprint"),
      app: APP_OVERRIDE[p.id] || classifyApp(p.title + " " + (p.summary || "")),
      year: p.year, title: p.title,
      authorsHtml: (p.authors || []).map(function (a) { return a.self ? "<b>" + a.name + "</b>" : a.name; }).join(", "),
      venue: (p.venue || "").replace(/\s*\((?:MDPI|Nature)\)\s*$/i, ""),
      desc: p.summary || "", links: links
    });
  });

  /* ---------- Patents (language subset) ---------- */
  var PATENT_HREFS = {
    "https://patents.google.com/patent/US10825450B2/en": "Public Safety",
    "https://patents.google.com/patent/US20090070321A1/en": "IT & Software"
  };
  (window.PATENT_CARDS || []).filter(function (c) { return PATENT_HREFS[c.idHref]; }).forEach(function (c) {
    items.push({
      type: "Patent", app: PATENT_HREFS[c.idHref], year: parseInt(c.year, 10) || null,
      title: c.title, authorsHtml: c.inventors, venue: c.companyName,
      desc: c.summary || "", links: [{ k: c.idLabel || "Patent", u: c.idHref }]
    });
  });

  /* ---------- Industry projects (language / voice subset of Past Projects) ---------- */
  var INDUSTRY_APP = {
    "Motorola Solutions": "Public Safety", "Harmon.AI": "IT & Software", "CloudTuner": "IT & Software",
    "SearchNG": "IT & Software", "Product Computers": "IT & Software", "Tegrity": "Education"
  };
  var INDUSTRY_BLOCK = /compression|content injection|content delivery|bundling|personalized web content/i;
  var INDUSTRY_DESC = {
    "Group Recommendation for Email Classification with Office Graph Embeddings": "Classifies and routes enterprise email by learning group patterns from an organization's Office collaboration graph.",
    "311 Call Request Classification": "Automatically categorizes citizen 311 service requests from free-text call descriptions to speed municipal routing.",
    "Coded Speech Restoration and ASR Error Correction": "Restores degraded coded speech and corrects automatic-speech-recognition errors in public-safety radio traffic.",
    "Key Term Extraction and Result Fusion/Reranking": "Extracts key query terms and fuses and reranks results from multiple sources to sharpen search relevance.",
    "Multipoint Voice Conferencing with AGC, VAD, and Audio Mixing": "Real-time multipoint voice conferencing with automatic gain control, voice-activity detection, and audio mixing for online lectures.",
    "Segmentation, Search, and Indexing of Educational Content": "Segments, indexes, and makes recorded lectures searchable across speech, audio, and on-screen text.",
    "Automatic Extraction of Query Interfaces and Result Schemas from Observed Search Interactions": "Learns how third-party search sites accept queries and structure results by observing real search interactions.",
    "Rank-Based Query Routing and Result Fusion": "Routes each query to the most promising engines and fuses their ranked results into one unified list.",
    "Handwritten Digit Detection and Filtering for Scanned Document OCR": "Detects and isolates handwritten digits in scanned documents to improve downstream OCR accuracy.",
    "Online Cursive Trace Segmentation for Handwriting Recognition": "Segments continuous cursive pen strokes into recognizable units for online handwriting recognition.",
    "Feature Space Design for Online Handwriting Recognition": "Designs the feature representation that makes online handwriting recognition robust across writing styles."
  };
  (window.PAST_RESEARCH_TASK_CARDS || []).filter(function (c) {
    var dt = (c.dataTypes || []).join(" ");
    return /Text|Voice/.test(dt) && !INDUSTRY_BLOCK.test(c.title || "");
  }).forEach(function (c) {
    items.push({
      type: "Industry Project", app: INDUSTRY_APP[c.organization] || classifyApp(c.title),
      year: parseInt(c.year, 10) || null, title: c.title, authorsHtml: c.organization, venue: c.organization,
      desc: INDUSTRY_DESC[c.title] || "",
      links: (c.links || []).map(function (l) { return { k: l.label, u: l.href }; })
    });
  });

  /* ---------- Recent GitHub projects (language subset) ---------- */
  var PROJ_TITLES = { "EdgeLang": 1, "AutoAnalytics": 1, "ModelMesh": 1, "Web2Comics Chrome Extension and Bot": 1, "PromptArt": 1 };
  (window.RECENT_PROJECT_CARDS || []).filter(function (c) { return PROJ_TITLES[c.title]; }).forEach(function (c) {
    items.push({
      type: "Research Project", app: classifyApp(c.title + " " + (c.description || "")),
      year: null, title: c.title, authorsHtml: "", venue: c.eyebrow || "",
      desc: c.description || "", links: (c.links || []).map(function (l) { return { k: l.label, u: l.href }; })
    });
  });

  /* ---------- Supervised thesis students (curated; excludes any that appear as a paper) ---------- */
  [
    { name: "Ofek Gayero", degree: "B.Sc.", title: "LLM-Driven Autonomous Analytics Dashboard Generation", app: "IT & Software",
      desc: "Autonomous generation of analytics dashboards from natural-language queries, using LLMs, schema inference, and visualization planning." },
    { name: "Ameen Assadi", degree: "B.Sc.", title: "Interactive Career Analytics and Resume Intelligence System", app: "Talent Management",
      desc: "Turns static resumes into structured, queryable career profiles with grounded question answering and skill-based analytics." },
    { name: "Alex Gusin", degree: "B.Sc.", title: "Automatic Tagging of Browser Bookmarks", app: "Media & Consumer", year: 2013,
      desc: "Analyzes page text and metadata to assign bookmark tags automatically for better organization and retrieval." }
  ].forEach(function (s) {
    items.push({
      type: "Supervised", app: s.app, year: s.year || null, title: s.title,
      authorsHtml: s.name + " &middot; " + s.degree, venue: "Supervised thesis (" + s.degree + ")",
      desc: s.desc, links: s.links || []
    });
  });

  /* ---------- card builder (type + year badge; no application badge) ---------- */
  var TYPE_CLASS = {
    "Paper": "t-paper", "Preprint": "t-preprint", "Patent": "t-patent",
    "Supervised": "t-supervised", "Industry Project": "t-industry", "Research Project": "t-project"
  };
  var TYPE_ORDER = { "Paper": 1, "Preprint": 2, "Patent": 3, "Supervised": 4, "Industry Project": 5, "Research Project": 6 };

  function buildCard(it) {
    var li = el("li", "rlp-card");
    li.setAttribute("data-type", it.type);
    li.setAttribute("data-app", it.app);
    li.setAttribute("data-year", it.year || "");
    var tags = el("div", "rlp-card__tags");
    tags.appendChild(el("span", "rlp-tag " + (TYPE_CLASS[it.type] || ""), it.type));
    if (it.year) tags.appendChild(el("span", "rlp-tag rlp-tag--year", String(it.year)));
    li.appendChild(tags);
    li.appendChild(el("h3", "rlp-card__title", it.title));
    if (it.authorsHtml) { var m = el("p", "rlp-card__meta"); m.innerHTML = it.authorsHtml; li.appendChild(m); }
    if (it.venue) li.appendChild(el("p", "rlp-card__venue", it.venue));
    if (it.desc) li.appendChild(el("p", "rlp-card__desc", it.desc));
    if (it.links && it.links.length) {
      var lk = el("p", "rlp-card__links");
      it.links.forEach(function (l, i) {
        if (i > 0) lk.appendChild(document.createTextNode(" · "));
        lk.appendChild(extLink(l.u, l.k));
      });
      li.appendChild(lk);
    }
    return li;
  }

  /* ---------- render into 4 application sections ---------- */
  function sectionOf(app) {
    if (app === "Healthcare") return "Healthcare";
    if (app === "Public Safety") return "Public Safety";
    if (app === "Education") return "Education";
    return "Other";
  }
  var SECTION_ORDER = ["Healthcare", "Public Safety", "Education", "Other"];
  var SECTION_LABEL = { "Healthcare": "Healthcare", "Public Safety": "Public Safety", "Education": "Education", "Other": "Other Applications" };

  var container = document.getElementById("rlp-sections");
  if (!container) return;
  SECTION_ORDER.forEach(function (sec) {
    var secItems = items.filter(function (it) { return sectionOf(it.app) === sec; });
    if (!secItems.length) return;
    secItems.sort(function (a, b) {
      return (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9) ||
        (b.year || 0) - (a.year || 0) || String(a.title || "").localeCompare(String(b.title || ""));
    });
    var section = el("section", "rlp-section");
    section.setAttribute("data-section", sec);
    var h = el("h2", "rlp-section__head");
    h.appendChild(document.createTextNode(SECTION_LABEL[sec] + " "));
    h.appendChild(el("span", "rlp-section__count", "(" + secItems.length + ")"));
    section.appendChild(h);
    var g = el("ol", "rlp-grid");
    secItems.forEach(function (it) { g.appendChild(buildCard(it)); });
    section.appendChild(g);
    container.appendChild(section);
  });

  /* ---------- Type / Application / Year dropdown filters ---------- */
  var activeType = "all", activeApp = "all", activeYear = "all";
  function apply() {
    var secs = container.querySelectorAll(".rlp-section");
    for (var s = 0; s < secs.length; s++) {
      var cards = secs[s].querySelectorAll(".rlp-card"), vis = 0;
      for (var i = 0; i < cards.length; i++) {
        var okT = activeType === "all" || cards[i].getAttribute("data-type") === activeType;
        var okA = activeApp === "all" || cards[i].getAttribute("data-app") === activeApp;
        var okY = activeYear === "all" || cards[i].getAttribute("data-year") === activeYear;
        var show = okT && okA && okY;
        cards[i].style.display = show ? "" : "none";
        if (show) vis++;
      }
      secs[s].style.display = vis ? "" : "none";
    }
  }
  function fillSelect(id, values, onChange) {
    var sel = document.getElementById(id);
    if (!sel) return;
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.value; o.textContent = v.label;
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () { onChange(sel.value); apply(); });
  }
  function optionList(key, order) {
    var c = {};
    items.forEach(function (it) { var v = it[key]; if (v != null && v !== "") c[v] = (c[v] || 0) + 1; });
    var keys = Object.keys(c).sort(function (a, b) {
      if (order) return (order[a] || 99) - (order[b] || 99);
      return Number(b) - Number(a);
    });
    var out = [{ value: "all", label: (key === "year" ? "All years" : "All") + " (" + items.length + ")" }];
    keys.forEach(function (k) { out.push({ value: k, label: k + " (" + c[k] + ")" }); });
    return out;
  }
  fillSelect("rlp-sel-type", optionList("type", TYPE_ORDER), function (v) { activeType = v; });
  fillSelect("rlp-sel-app", optionList("app"), function (v) { activeApp = v; });
  fillSelect("rlp-sel-year", optionList("year"), function (v) { activeYear = v; });
})();
