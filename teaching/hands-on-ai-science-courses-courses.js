(function () {
  const cards = Array.isArray(window.HOS_COURSE_SYLLABI)
    ? window.HOS_COURSE_SYLLABI
    : [];
  const grid = document.getElementById("hos-course-syllabi-grid");
  if (!grid || cards.length === 0) {
    return;
  }

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "content-card content-card--collection";

    const media = document.createElement("div");
    media.className = "content-card__media";
    media.style.position = "relative";
    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.imageAlt || "Course visual";
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    if (card.badge) {
      const badge = document.createElement("span");
      badge.className = "content-card__badge";
      badge.textContent = card.badge;
      media.appendChild(badge);
    }
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
