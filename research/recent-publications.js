(function () {
  var pubs = Array.isArray(window.RECENT_PUBLICATIONS)
    ? window.RECENT_PUBLICATIONS
    : [];
  var grid = document.getElementById("publications-grid");
  if (!grid || pubs.length === 0) {
    return;
  }

  var sectionLabels = {
    Journal: "Accepted for Publication: 2025-2026",
    Submitted: "Submitted for Peer Review",
    Preprint: "Reports",
    InPreparation: "In Preparation"
  };
  var typeOrder = ["Journal", "Submitted", "InPreparation", "Preprint"];

  var grouped = {};
  typeOrder.forEach(function (t) { grouped[t] = []; });
  pubs.forEach(function (p) {
    if (grouped[p.type]) {
      grouped[p.type].push(p);
    }
  });

  typeOrder.forEach(function (type) {
    var items = grouped[type].slice().sort(function (a, b) {
      var yearDiff = (b.year || 0) - (a.year || 0);
      if (yearDiff !== 0) {
        return yearDiff;
      }
      return String(a.title || "").localeCompare(String(b.title || ""));
    });
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

      var typeLabels = { Journal: "Journal", Submitted: "Preprint", Preprint: "Report", InPreparation: "Draft" };
      // Within the Preprints (InPreparation) section, cards that link to an
      // arXiv preprint show "Preprint"; cards without an arXiv link show "Draft".
      var hasArxiv = /arxiv\.org/i.test(pub.venueHref || "");
      var badgeText;
      if (pub.type === "InPreparation") {
        badgeText = hasArxiv ? "Preprint" : "Draft";
      } else {
        badgeText = typeLabels[pub.type] || pub.type;
      }
      var typeSpan = document.createElement("span");
      typeSpan.className = "pub-card__type";
      typeSpan.textContent = badgeText;
      top.appendChild(typeSpan);

      if (pub.accepted) {
        var acceptedBadge = document.createElement("span");
        acceptedBadge.className = "pub-card__badge--accepted";
        acceptedBadge.textContent = "Accepted";
        top.appendChild(acceptedBadge);
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

      var venueLower = (pub.venue || "").toLowerCase();
      var publisher = null;
      if (venueLower.indexOf("nature") !== -1) {
        publisher = { src: "../assets/publishers/nature.svg", alt: "Nature" };
      } else if (venueLower.indexOf("mdpi") !== -1) {
        publisher = { src: "../assets/publishers/mdpi.png", alt: "MDPI" };
      } else if (venueLower.indexOf("ieee access") !== -1 || venueLower.indexOf("ieee") !== -1) {
        publisher = { src: "../assets/publishers/ieee-access.png", alt: "IEEE Access" };
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
