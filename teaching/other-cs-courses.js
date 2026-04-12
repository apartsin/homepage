(function () {
  var courses = Array.isArray(window.OTHER_CS_COURSES)
    ? window.OTHER_CS_COURSES
    : [];
  var grid = document.getElementById("other-cs-courses-grid");
  if (!grid || courses.length === 0) {
    return;
  }

  courses.forEach(function (course) {
    var article = document.createElement("article");
    article.className = "content-card content-card--collection other-cs-card";
    article.dataset.institution = course.institution || "";

    var media = document.createElement("div");
    media.className = "content-card__media other-cs-card__media";
    var image = document.createElement("img");
    image.src = course.image;
    image.alt = course.imageAlt || (course.eyebrow || "Institution") + " logo";
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    article.appendChild(media);

    var body = document.createElement("div");
    body.className = "content-card__body";

    var eyebrow = document.createElement("p");
    eyebrow.className = "content-card__eyebrow";
    eyebrow.textContent = course.eyebrow || "";
    body.appendChild(eyebrow);

    var title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = course.title || "";
    body.appendChild(title);

    var meta = document.createElement("p");
    meta.className = "content-card__meta";
    meta.textContent = course.meta || "";
    body.appendChild(meta);

    article.appendChild(body);
    grid.appendChild(article);
  });
})();
