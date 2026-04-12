(function () {
  var courses = Array.isArray(window.OTHER_CS_COURSES)
    ? window.OTHER_CS_COURSES
    : [];
  var grid = document.getElementById("other-cs-courses-grid");
  if (!grid || courses.length === 0) {
    return;
  }

  var instColors = {
    "hit":  { bg1: "#1d3557", bg2: "#457b9d", accent: "#a8dadc" },
    "mta":  { bg1: "#7a3f16", bg2: "#c2844a", accent: "#fde8d0" },
    "tau":  { bg1: "#2d6a4f", bg2: "#52b788", accent: "#d8f3dc" }
  };

  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function wrapText(text, maxLen) {
    var words = text.split(" ");
    var lines = [];
    var cur = "";
    for (var w = 0; w < words.length; w++) {
      if (cur && (cur + " " + words[w]).length > maxLen) {
        lines.push(cur);
        cur = words[w];
      } else {
        cur = cur ? cur + " " + words[w] : words[w];
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  courses.forEach(function (course) {
    var article = document.createElement("article");
    article.className = "content-card content-card--collection other-cs-card";
    article.dataset.institution = course.institution || "";

    /* Inline SVG with course name */
    var tc = instColors[course.institution] || instColors["hit"];
    var title = course.title || "Course";
    var lines = wrapText(title, 20);
    var totalH = lines.length * 38;
    var startY = (270 - totalH) / 2 + 28;

    var ns = "http://www.w3.org/2000/svg";
    var cardId = "cg" + Math.random().toString(36).slice(2, 8);
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 480 270");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", title);
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
    defs.appendChild(grad); svg.appendChild(defs);

    var bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", "480"); bg.setAttribute("height", "270");
    bg.setAttribute("fill", "url(#" + cardId + ")");
    svg.appendChild(bg);

    var c1 = document.createElementNS(ns, "circle");
    c1.setAttribute("cx", "420"); c1.setAttribute("cy", "40"); c1.setAttribute("r", "100");
    c1.setAttribute("fill", tc.accent); c1.setAttribute("opacity", "0.1");
    svg.appendChild(c1);
    var c2 = document.createElementNS(ns, "circle");
    c2.setAttribute("cx", "40"); c2.setAttribute("cy", "240"); c2.setAttribute("r", "80");
    c2.setAttribute("fill", tc.accent); c2.setAttribute("opacity", "0.07");
    svg.appendChild(c2);

    for (var i = 0; i < lines.length; i++) {
      var txt = document.createElementNS(ns, "text");
      txt.setAttribute("x", "240"); txt.setAttribute("y", String(startY + i * 38));
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-family", "sans-serif");
      txt.setAttribute("font-weight", "800");
      txt.setAttribute("font-size", "30");
      txt.setAttribute("fill", "#fff");
      txt.textContent = lines[i];
      svg.appendChild(txt);
    }

    var media = document.createElement("div");
    media.className = "content-card__media other-cs-card__media";
    media.appendChild(svg);
    article.appendChild(media);

    var body = document.createElement("div");
    body.className = "content-card__body";

    var instRow = document.createElement("div");
    instRow.style.cssText = "display: flex; align-items: center; gap: 6px;";
    var logo = document.createElement("img");
    logo.src = course.image;
    logo.alt = (course.eyebrow || "") + " logo";
    logo.style.cssText = "width: 22px; height: 22px; object-fit: contain; border-radius: 4px; border: 1px solid var(--site-border, rgba(24,32,42,0.14));";
    logo.loading = "lazy";
    instRow.appendChild(logo);
    var eyebrow = document.createElement("p");
    eyebrow.className = "content-card__eyebrow";
    eyebrow.textContent = course.eyebrow || "";
    eyebrow.style.margin = "0";
    instRow.appendChild(eyebrow);
    body.appendChild(instRow);

    var titleEl = document.createElement("h2");
    titleEl.className = "content-card__title";
    titleEl.textContent = course.title || "";
    body.appendChild(titleEl);

    var meta = document.createElement("p");
    meta.className = "content-card__meta";
    meta.textContent = course.meta || "";
    body.appendChild(meta);

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
