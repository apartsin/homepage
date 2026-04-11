(function () {
  function register(cards) {
    window.ApartsinCards.registerPage("essays", {
      keepSections: 1,
      tailSections: 0,
      gridVariant: "text-grid",
      cardVariant: "essay",
      cards: cards
    });
  }

  function getData() {
    const store = window.ApartsinCardData || {};
    return Array.isArray(store.essays) ? store.essays : null;
  }

  const existing = getData();
  if (existing) {
    register(existing);
    return;
  }

  const script = document.createElement("script");
  const src = document.currentScript && document.currentScript.src
    ? new URL("./essays.data.js", document.currentScript.src).toString()
    : "./essays.data.js";
  script.src = src;
  script.async = false;
  script.onload = function () {
    register(getData() || []);
  };
  document.head.appendChild(script);
})();
