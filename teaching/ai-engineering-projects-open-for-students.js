(function () {
  var projects = Array.isArray(window.AI_ENGINEERING_PROJECTS)
    ? window.AI_ENGINEERING_PROJECTS
    : [];
  var grid = document.getElementById("ai-projects-grid");
  if (!grid || projects.length === 0) {
    return;
  }

  projects.forEach(function (project) {
    var article = document.createElement("article");
    article.className = "content-card content-card--stacked";

    var media = document.createElement("div");
    media.className = "content-card__media";
    var img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title || "Project visual";
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    article.appendChild(media);

    var body = document.createElement("div");
    body.className = "content-card__body";

    var title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = project.title || "";
    body.appendChild(title);

    var desc = document.createElement("p");
    desc.className = "content-card__desc";
    desc.textContent = project.description || "";
    body.appendChild(desc);

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
