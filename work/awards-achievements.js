(function () {
  var cards = window.ACHIEVEMENT_CARDS || [];
  var grid = document.getElementById("achievements-grid");
  if (!grid || !cards.length) return;

  var docSvg = '<svg style="width:14px;height:14px;vertical-align:-2px;margin-right:4px" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>';
  var videoSvg = '<svg style="width:14px;height:14px;vertical-align:-2px;margin-right:4px" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3L10 15z"/></svg>';

  cards.forEach(function (c) {
    var art = document.createElement("article");
    art.className = "achievement-card";
    art.id = c.id;

    var fig = '<figure class="achievement-card__media"><img src="' + c.image.src + '" alt="' + c.image.alt + '"></figure>';
    var title = '<h2 class="achievement-card__title">' + c.title + '</h2>';
    var text = '<p class="achievement-card__text">' + c.text + '</p>';

    var footerParts = '<span class="achievement-card__badge">' + c.badge + '</span>';
    (c.links || []).forEach(function (lnk) {
      var icon = lnk.icon === "video" ? videoSvg : docSvg;
      footerParts += '<a class="achievement-card__link" href="' + lnk.href + '" target="_blank" rel="noopener noreferrer">' + icon + lnk.label + '</a>';
    });
    footerParts += '<img src="' + c.logo.src + '" alt="' + c.logo.alt + '" style="width:28px;height:28px;object-fit:contain;border-radius:6px;border:1px solid var(--site-border);background:#fff;padding:2px;margin-left:auto;">';

    art.innerHTML = fig + title + text + '<div class="achievement-card__footer">' + footerParts + '</div>';
    grid.appendChild(art);
  });
})();
