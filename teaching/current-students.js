(function () {
  var students = Array.isArray(window.CURRENT_STUDENTS)
    ? window.CURRENT_STUDENTS
    : [];
  var grid = document.getElementById("current-students-grid");
  if (!grid || students.length === 0) {
    return;
  }

  students.forEach(function (s) {
    var article = document.createElement("article");
    article.className = "hub-card student-card";
    if (s.id) {
      article.id = s.id;
    }

    var media = document.createElement("div");
    media.className = "student-card__media";
    var img = document.createElement("img");
    img.src = s.image;
    img.alt = s.imageAlt || "Project image for " + s.name;
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);
    article.appendChild(media);

    var body = document.createElement("div");
    body.className = "student-card__body";

    var project = document.createElement("h2");
    project.className = "student-card__project";
    project.textContent = s.project || "";
    body.appendChild(project);

    var name = document.createElement("p");
    name.className = "student-card__name";
    name.textContent = s.name || "";
    body.appendChild(name);

    var desc = document.createElement("p");
    desc.className = "student-card__text";
    desc.textContent = s.description || "";
    body.appendChild(desc);

    if (s.degree) {
      var tag = document.createElement("span");
      tag.className = "student-card__degree";
      tag.textContent = s.degree;
      tag.style.cssText = "display: inline-block; margin-top: auto; align-self: flex-end; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--site-border, rgba(24,32,42,0.14)); background: rgba(133, 114, 81, 0.08); color: var(--site-text, #18202a); font: 800 0.68rem/1.2 'Manrope', sans-serif; letter-spacing: 0.04em; text-transform: uppercase;";
      body.appendChild(tag);
    }

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
