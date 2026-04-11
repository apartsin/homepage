(function () {
  const projects = Array.isArray(window.UNDERGRAD_AI_PROJECTS)
    ? window.UNDERGRAD_AI_PROJECTS
    : [];
  const grid = document.getElementById("undergrad-ai-projects-grid");
  if (!grid || projects.length === 0) {
    return;
  }

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "content-card content-card--stacked";

    const media = document.createElement("div");
    media.className = "content-card__media";
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.imageAlt || project.title || "Project visual";
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "content-card__eyebrow";
    eyebrow.textContent = project.eyebrow || "";
    body.appendChild(eyebrow);

    const title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = project.title || "";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "content-card__desc";
    desc.textContent = project.description || "";
    body.appendChild(desc);

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
