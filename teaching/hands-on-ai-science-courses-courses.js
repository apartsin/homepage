(function () {
  const cards = Array.isArray(window.HOS_COURSE_SYLLABI)
    ? window.HOS_COURSE_SYLLABI
    : [];
  const grid = document.getElementById("hos-course-syllabi-grid");
  if (!grid || cards.length === 0) {
    return;
  }

  var typeColors = [
    { bg1: "#1d3557", bg2: "#457b9d", accent: "#a8dadc" },
    { bg1: "#2d6a4f", bg2: "#52b788", accent: "#d8f3dc" },
    { bg1: "#7a3f16", bg2: "#c2844a", accent: "#fde8d0" },
    { bg1: "#5a189a", bg2: "#9d4edd", accent: "#e0aaff" }
  ];

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

  cards.forEach((card, idx) => {
    const article = document.createElement("article");
    article.className = "content-card content-card--collection";

    var tc = typeColors[idx % typeColors.length];
    var courseName = esc(card.imageAlt || "Course");
    var lines = wrapText(courseName, 22);
    var totalH = lines.length * 34;
    var startY = (270 - totalH) / 2 + 24;
    var titleSvg = "";
    for (var i = 0; i < lines.length; i++) {
      titleSvg += '<text x="240" y="' + (startY + i * 34) + '" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="26" fill="#fff">' + lines[i] + '</text>';
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

    const media = document.createElement("div");
    media.className = "content-card__media";
    const image = document.createElement("img");
    image.src = svgSrc;
    image.alt = card.imageAlt || "Course visual";
    media.appendChild(image);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    const title = document.createElement("h2");
    title.className = "content-card__title hos-course-title";
    title.innerHTML = card.titleHtml || "";
    body.appendChild(title);

    const links = document.createElement("div");
    links.className = "content-card__links";
    (Array.isArray(card.links) ? card.links : []).forEach((link) => {
      if (!link || !link.href) {
        return;
      }
      const anchor = document.createElement("a");
      anchor.className = "content-card__link";
      anchor.href = link.href;
      anchor.textContent = link.label || "Open";
      links.appendChild(anchor);
    });
    body.appendChild(links);

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
