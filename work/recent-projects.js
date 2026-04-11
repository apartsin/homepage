(function () {
  const cards = Array.isArray(window.RECENT_PROJECT_CARDS)
    ? window.RECENT_PROJECT_CARDS
    : [];
  const grid = document.getElementById("recent-projects-grid");
  if (!grid || cards.length === 0) {
    return;
  }

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "content-card content-card--stacked";

    const media = document.createElement("div");
    media.className = "content-card__media";
    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.imageAlt || card.title || "Project visual";
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    if (card.eyebrow) {
      const eyebrow = document.createElement("p");
      eyebrow.className = "content-card__eyebrow";
      eyebrow.textContent = card.eyebrow;
      body.appendChild(eyebrow);
    }

    const title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = card.title || "";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "content-card__desc";
    desc.textContent = card.description || "";
    body.appendChild(desc);

    const linksWrap = document.createElement("div");
    linksWrap.className = "content-card__links";
    (Array.isArray(card.links) ? card.links : []).forEach((link) => {
      if (!link || !link.href) {
        return;
      }
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

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
