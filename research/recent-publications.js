(function () {
  var pubs = Array.isArray(window.RECENT_PUBLICATIONS)
    ? window.RECENT_PUBLICATIONS
    : [];
  var grid = document.getElementById("publications-grid");
  if (!grid || pubs.length === 0) {
    return;
  }

  // Two sections: published journals, then all preprints with the submitted
  // ones first (they keep a status badge); the rest carry no badge.
  var sections = [
    { label: "Published: 2025-2026", types: ["Journal"] },
    { label: "Preprints: 2025-2026", types: ["Submitted", "Preprint"] }
  ];

  var grouped = { Journal: [], Submitted: [], Preprint: [] };
  pubs.forEach(function (p) {
    if (grouped[p.type]) {
      grouped[p.type].push(p);
    }
  });

  function sortByYear(a, b) {
    return (b.year || 0) - (a.year || 0) ||
      String(a.title || "").localeCompare(String(b.title || ""));
  }

  sections.forEach(function (section) {
    var items = [];
    section.types.forEach(function (t) {
      items = items.concat(grouped[t].slice().sort(sortByYear));
    });
    if (items.length === 0) {
      return;
    }

    var heading = document.createElement("li");
    heading.className = "pub-section-heading";
    heading.textContent = section.label;
    grid.appendChild(heading);

    items.forEach(function (pub) {
      var li = document.createElement("li");
      li.className = "pub-card";
      li.id = pub.id;

      // Top-right status badge only where it disambiguates: submitted papers get
      // "Submitted", an accepted-but-unpublished paper gets "Accepted". Published
      // journals and reports carry no badge (their section already says so).
      var statusText = null, statusMod = null;
      if (pub.accepted) { statusText = "Accepted"; statusMod = "accepted"; }
      else if (pub.type === "Submitted") { statusText = "Submitted"; statusMod = "submitted"; }
      if (statusText) {
        var statusEl = document.createElement("span");
        statusEl.className = "pub-card__status pub-card__status--" + statusMod;
        statusEl.textContent = statusText;
        li.appendChild(statusEl);
      }

      var top = document.createElement("div");
      top.className = "pub-card__top";

      var yearSpan = document.createElement("span");
      yearSpan.className = "pub-card__year";
      yearSpan.textContent = pub.year;
      top.appendChild(yearSpan);

      // Only journals keep a type badge. Preprints/reports show none (the section
      // heading already says "Preprints"); submitted papers are marked instead by
      // their "Submitted" status badge.
      if (pub.type === "Journal") {
        var typeSpan = document.createElement("span");
        typeSpan.className = "pub-card__type";
        typeSpan.textContent = "Journal";
        top.appendChild(typeSpan);
      }


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
      // Drop the trailing publisher tag (MDPI/Nature) from the visible link
      // text; the publisher icon below still keys off the full pub.venue.
      var displayVenue = (pub.venue || "").replace(/\s*\((?:MDPI|Nature)\)\s*$/i, "");
      if (pub.draftHref && pub.venueHref) {
        var repoA = document.createElement("a");
        repoA.href = pub.venueHref;
        repoA.target = "_blank";
        repoA.rel = "noopener noreferrer";
        repoA.textContent = "Project page";
        venue.appendChild(repoA);
        venue.appendChild(document.createTextNode(" · "));
        var draftA = document.createElement("a");
        draftA.href = pub.draftHref;
        draftA.target = "_blank";
        draftA.rel = "noopener noreferrer";
        draftA.textContent = "Draft";
        venue.appendChild(draftA);
      } else if (pub.venueHref) {
        var a = document.createElement("a");
        a.href = pub.venueHref;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = displayVenue;
        venue.appendChild(a);
      } else {
        venue.textContent = displayVenue;
      }
      li.appendChild(venue);

      if (pub.summary) {
        var summaryP = document.createElement("p");
        summaryP.className = "pub-card__summary";
        summaryP.appendChild(document.createTextNode(pub.summary));
        li.appendChild(summaryP);
      }

      var venueLower = (pub.venue || "").toLowerCase();
      var publisher = null;
      if (venueLower.indexOf("nature") !== -1) {
        publisher = { src: "../assets/publishers/springer-nature.svg", alt: "Springer Nature" };
      } else if (venueLower.indexOf("mdpi") !== -1) {
        publisher = { src: "../assets/publishers/mdpi.png", alt: "MDPI" };
      } else if (venueLower.indexOf("ieee access") !== -1 || venueLower.indexOf("ieee") !== -1) {
        publisher = { src: "../assets/publishers/ieee.svg", alt: "IEEE" };
      } else if (venueLower.indexOf("arxiv") !== -1) {
        publisher = { src: "../assets/publishers/arxiv.jpg", alt: "arXiv" };
      } else if (venueLower.indexOf("draft") !== -1) {
        publisher = { src: "../assets/publishers/github.svg", alt: "GitHub" };
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
