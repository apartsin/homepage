(function () {
  var items = window.IFL_PRINCIPLES || [];
  var grid = document.getElementById("ifl-principles-grid");
  if (!grid || !items.length) return;

  var title = document.createElement("h2");
  title.className = "ifl-intro__title";
  title.innerHTML = '<span class="ifl-intro__title-main">עשרת הדיברות של למידה מבוססת חדשנות</span>';
  grid.appendChild(title);

  var panels = document.createElement("div");
  panels.className = "ifl-principle-panels";

  var half = Math.ceil(items.length / 2);
  [items.slice(0, half), items.slice(half)].forEach(function (group, gi) {
    var section = document.createElement("section");
    section.className = "ifl-subpanel";
    section.setAttribute("aria-label", gi === 0 ? "דיברות אחת עד חמש" : "דיברות שש עד עשר");

    var container = document.createElement("div");
    container.className = "ifl-principles";

    group.forEach(function (p) {
      var art = document.createElement("article");
      art.className = "ifl-principle";
      art.innerHTML =
        '<div class="ifl-principle__head">' +
          '<span class="ifl-principle__icon" aria-hidden="true">' + p.icon + '</span>' +
          '<h2>' + p.titleHtml + '</h2>' +
        '</div>' +
        '<p>' + p.desc + '</p>' +
        '<span class="ifl-principle__num" aria-hidden="true">' + p.num + '</span>';
      container.appendChild(art);
    });

    section.appendChild(container);
    panels.appendChild(section);
  });

  grid.appendChild(panels);
})();
