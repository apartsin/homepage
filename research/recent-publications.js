(function () {
  var pubs = Array.isArray(window.RECENT_PUBLICATIONS)
    ? window.RECENT_PUBLICATIONS
    : [];
  var grid = document.getElementById("publications-grid");
  if (!grid || pubs.length === 0) {
    return;
  }

  var sectionLabels = {
    Journal: "Peer Reviewed: 2025-2026",
    Submitted: "Preprints (Submitted for Peer Review)",
    Preprint: "Reports"
  };
  var typeOrder = ["Journal", "Submitted", "Preprint"];

  var grouped = {};
  typeOrder.forEach(function (t) { grouped[t] = []; });
  pubs.forEach(function (p) {
    if (grouped[p.type]) {
      grouped[p.type].push(p);
    }
  });

  typeOrder.forEach(function (type) {
    var items = grouped[type];
    if (items.length === 0) {
      return;
    }

    var heading = document.createElement("li");
    heading.className = "pub-section-heading";
    heading.textContent = sectionLabels[type] || type;
    grid.appendChild(heading);

    items.forEach(function (pub) {
      var li = document.createElement("li");
      li.className = "pub-card";
      li.id = pub.id;

      var top = document.createElement("div");
      top.className = "pub-card__top";

      var yearSpan = document.createElement("span");
      yearSpan.className = "pub-card__year";
      yearSpan.textContent = pub.year;
      top.appendChild(yearSpan);

      var typeLabels = { Journal: "Journal", Submitted: "Preprint", Preprint: "Report" };
      var typeSpan = document.createElement("span");
      typeSpan.className = "pub-card__type";
      typeSpan.textContent = typeLabels[pub.type] || pub.type;
      top.appendChild(typeSpan);

      li.appendChild(top);

      var title = document.createElement("h2");
      title.className = "pub-card__title";
      title.textContent = pub.title;
      li.appendChild(title);

      var meta = document.createElement("p");
      meta.className = "pub-card__meta";
      pub.authors.forEach(function (author, i) {
        if (i > 0) {
          meta.appendChild(document.createTextNode(", "));
        }
        if (author.self) {
          var selfSpan = document.createElement("span");
          selfSpan.className = "pub-card__author-self";
          selfSpan.textContent = author.name;
          meta.appendChild(selfSpan);
        } else {
          meta.appendChild(document.createTextNode(author.name));
        }
      });
      li.appendChild(meta);

      var venue = document.createElement("p");
      venue.className = "pub-card__venue";
      if (pub.venueHref) {
        var a = document.createElement("a");
        a.href = pub.venueHref;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = pub.venue;
        venue.appendChild(a);
      } else {
        venue.textContent = pub.venue;
      }
      li.appendChild(venue);

      var venueLower = (pub.venue || "").toLowerCase();
      var publisher = null;
      if (venueLower.indexOf("nature") !== -1) {
        publisher = { src: "../assets/publishers/nature.svg", alt: "Nature" };
      } else if (venueLower.indexOf("mdpi") !== -1) {
        publisher = { src: "../assets/publishers/mdpi.png", alt: "MDPI" };
      } else if (venueLower.indexOf("arxiv") !== -1) {
        publisher = { src: "../assets/publishers/arxiv.jpg", alt: "arXiv" };
      }
      if (publisher) {
        li.classList.add("pub-card--with-publisher");
        var badge;
        if (pub.venueHref) {
          badge = document.createElement("a");
          badge.href = pub.venueHref;
          badge.target = "_blank";
          badge.rel = "noopener noreferrer";
        } else {
          badge = document.createElement("span");
        }
        badge.className = "pub-card__publisher";
        badge.setAttribute("aria-label", publisher.alt);
        var img = document.createElement("img");
        img.src = publisher.src;
        img.alt = publisher.alt;
        img.loading = "lazy";
        img.decoding = "async";
        badge.appendChild(img);
        li.appendChild(badge);
      }

      grid.appendChild(li);
    });
  });
})();
