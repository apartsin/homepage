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

    /* SVG image with course name */
    var tc = instColors[course.institution] || instColors["hit"];
    var title = esc(course.title || "Course");
    var lines = wrapText(title, 20);
    var totalH = lines.length * 38;
    var startY = (270 - totalH) / 2 + 28;
    var titleSvg = "";
    for (var i = 0; i < lines.length; i++) {
      titleSvg += '<text x="240" y="' + (startY + i * 38) + '" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="30" fill="#fff">' + lines[i] + '</text>';
    }
    var svgSrc = "data:image/svg+xml," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + tc.bg1 + '"/>' +
      '<stop offset="100%" stop-color="' + tc.bg2 + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="480" height="270" fill="url(#g)"/>' +
      '<circle cx="420" cy="40" r="100" fill="' + tc.accent + '" opacity="0.1"/>' +
      '<circle cx="40" cy="240" r="80" fill="' + tc.accent + '" opacity="0.07"/>' +
      titleSvg +
      '</svg>'
    );

    var media = document.createElement("div");
    media.className = "content-card__media other-cs-card__media";
    var image = document.createElement("img");
    image.src = svgSrc;
    image.alt = course.title || "Course";
    media.appendChild(image);
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
