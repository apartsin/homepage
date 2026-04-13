/**
 * Renders former-student cards from window.FORMER_STUDENTS into #former-students-grid.
 * Groups cards by year (descending) and inserts year headings between groups.
 */
(function () {
  var data = window.FORMER_STUDENTS;
  if (!data || !data.length) return;

  var grid = document.getElementById('former-students-grid');
  if (!grid) return;

  /* Collect unique years, sort descending */
  var yearSet = {};
  data.forEach(function (d) { yearSet[d.year] = true; });
  var years = Object.keys(yearSet).sort(function (a, b) { return b - a; });

  /* Build HTML */
  var html = '';
  years.forEach(function (year) {
    var group = data.filter(function (d) { return d.year === year; });
    group.forEach(function (d) {
      html += '<article class="hub-card former-card" id="' + d.id + '" data-year="' + d.year + '" data-types="' + d.types + '">';
      html += '<a class="former-card__media" href="' + d.mediaHref + '" target="_blank" rel="noopener noreferrer">';
      html += '<img src="' + d.imgSrc + '" alt="' + escAttr(d.imgAlt) + '">';
      html += '</a>';
      html += '<div class="former-card__body">';
      html += '<h2 class="former-card__title">' + esc(d.title) + '</h2>';
      html += '<p class="former-card__meta">' + esc(d.meta) + '</p>';
      html += '<div class="former-card__tags">';
      d.tags.forEach(function (t) {
        html += '<span class="former-card__tag">' + esc(t) + '</span>';
      });
      html += '</div>';
      html += '<p class="former-card__text">' + esc(d.text) + '</p>';
      if (d.links && d.links.length) {
        html += '<div class="former-card__actions">';
        d.links.forEach(function (l) {
          html += '<a class="former-card__link" href="' + l.href + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>';
        });
        html += '</div>';
      }
      html += '</div>';
      html += '</article>';
    });
  });

  grid.innerHTML = html;

  function esc(s) {
    var el = document.createElement('span');
    el.textContent = s;
    return el.innerHTML;
  }

  function escAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
