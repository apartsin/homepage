(function () {
  const cards = Array.isArray(window.RESEARCH_PROJECT_CARDS)
    ? window.RESEARCH_PROJECT_CARDS
    : [];
  const grid = document.getElementById("research-projects-grid");
  if (!grid || cards.length === 0) {
    return;
  }

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "hub-card repo-card";

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
    links.forEach((link) => {
      if (!link || !link.href) {
        return;
      }
      const linkRow = document.createElement("p");
      linkRow.className = "repo-card__link";
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.label || "Open";
      if (/^https?:\/\//i.test(link.href)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      linkRow.appendChild(anchor);
      body.appendChild(linkRow);
    });

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
