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

    var hasLinks = Array.isArray(s.links) && s.links.length;
    if (hasLinks || s.degree) {
      var footer = document.createElement("div");
      footer.className = "student-card__footer";
      footer.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: auto; padding-top: 10px;";

      var pillBase = "display: inline-block; padding: 3px 10px; border-radius: 999px; border: 1px solid var(--site-border, rgba(24,32,42,0.14)); background: rgba(133, 114, 81, 0.08); color: var(--site-text, #18202a); font: 700 0.7rem/1.2 'Manrope', sans-serif;";

      if (hasLinks) {
        s.links.forEach(function (l) {
          var a = document.createElement("a");
          a.className = "student-card__link";
          a.href = l.href;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = l.label;
          a.style.cssText = pillBase + " text-decoration: none;";
          footer.appendChild(a);
        });
      }

      if (s.degree) {
        var tag = document.createElement("span");
        tag.className = "student-card__degree";
        tag.textContent = s.degree;
        // Degree pill: same shape, uppercase letter-spacing for distinction,
        // pushed to the far right of the footer row.
        tag.style.cssText = pillBase + " margin-left: auto; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;";
        footer.appendChild(tag);
      }

      body.appendChild(footer);
    }

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
