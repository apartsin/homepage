/* patents.js — renders window.PATENT_CARDS into #patent-cards-container */
(function () {
  "use strict";

  var container = document.getElementById("patent-cards-container");
  if (!container || !window.PATENT_CARDS) return;

  var cards = window.PATENT_CARDS;
  var html = [];

  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    html.push(
      '<li class="patent-card">',
        '<div class="patent-card__top">',
          '<span class="patent-card__year">' + c.year + '</span>',
        '</div>',
        '<h3 class="patent-card__title">' + c.title + '</h3>',
        '<p class="patent-card__meta">Inventors: ' + c.inventors + '</p>',
        '<div class="patent-card__company">',
          '<img class="patent-card__company-logo" src="' + c.companyLogo + '" alt="' + c.companyLogoAlt + '">',
          '<span class="patent-card__company-name">' + c.companyName + '</span>',
        '</div>',
        '<p class="patent-card__id"><a class="external-indicator" href="' + c.idHref + '" target="_blank" rel="noopener noreferrer">' + c.idLabel + '</a></p>',
      '</li>'
    );
  }

  container.innerHTML = html.join("\n");
})();
