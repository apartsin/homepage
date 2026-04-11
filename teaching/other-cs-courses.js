(function () {
  const courses = Array.isArray(window.OTHER_CS_COURSES)
    ? window.OTHER_CS_COURSES
    : [];
  const switchRoot = document.querySelector(".other-cs-switch");
  const grid = document.getElementById("other-cs-courses-grid");
  if (!switchRoot || !grid || courses.length === 0) {
    return;
  }

  const buttons = Array.from(switchRoot.querySelectorAll(".other-cs-switch__item[data-filter]"));

  const cards = courses.map((course) => {
    const article = document.createElement("article");
    article.className = "content-card content-card--collection other-cs-card";
    article.dataset.institution = course.institution || "";

    const media = document.createElement("div");
    media.className = "content-card__media other-cs-card__media";
    const image = document.createElement("img");
    image.src = course.image;
    image.alt = course.imageAlt || `${course.eyebrow || "Institution"} logo`;
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    article.appendChild(media);

    const body = document.createElement("div");
    body.className = "content-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "content-card__eyebrow";
    eyebrow.textContent = course.eyebrow || "";
    body.appendChild(eyebrow);

    const title = document.createElement("h2");
    title.className = "content-card__title";
    title.textContent = course.title || "";
    body.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "content-card__meta";
    meta.textContent = course.meta || "";
    body.appendChild(meta);

    article.appendChild(body);
    grid.appendChild(article);
    return article;
  });

  function setActiveFilter(filter) {
    const active = (filter || "all").toLowerCase();

    buttons.forEach((button) => {
      const isActive = (button.dataset.filter || "all").toLowerCase() === active;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    cards.forEach((card) => {
      const institution = (card.dataset.institution || "").toLowerCase();
      card.hidden = active !== "all" && institution !== active;
    });
  }

  switchRoot.addEventListener("click", (event) => {
    const button = event.target.closest(".other-cs-switch__item[data-filter]");
    if (!button) {
      return;
    }
    setActiveFilter(button.dataset.filter);
  });

  setActiveFilter("all");
})();
