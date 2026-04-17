(function () {
  const cards = Array.isArray(window.RESEARCH_PROJECT_CARDS)
    ? window.RESEARCH_PROJECT_CARDS
    : [];
  const grid = document.getElementById("research-projects-grid");
  if (!grid || cards.length === 0) {
    return;
  }

  const ghSvg = '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "repo-card";

    const media = document.createElement("div");
    media.className = "repo-card__media";
    const img = document.createElement("img");
    img.src = card.image;
    img.alt = card.imageAlt || card.title || "Research project visual";
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "repo-card__body";

    const title = document.createElement("h2");
    title.className = "repo-card__title";
    title.textContent = card.title || "";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "repo-card__desc";
    desc.textContent = card.description || "";
    body.appendChild(desc);

    const links = Array.isArray(card.links) ? card.links : [];
    if (links.length > 0) {
      const linksWrap = document.createElement("div");
      linksWrap.className = "repo-card__links";
      links.forEach((link) => {
        if (!link || !link.href) return;
        const anchor = document.createElement("a");
        anchor.className = "repo-card__link-badge";
        anchor.href = link.href;
        if (/^https?:\/\//i.test(link.href)) {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
        }
        if (/github/i.test(link.label || '') || /github\.com/i.test(link.href)) {
          anchor.innerHTML = ghSvg + '<span>GitHub</span>';
        } else {
          anchor.textContent = link.label || "Open";
        }
        linksWrap.appendChild(anchor);
      });
      body.appendChild(linksWrap);
    }

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
