/* robust-vision-ai.js
   Unified, filterable view for the "Robust Vision AI" theme. Pulls from the
   site's data files (recent publications, patents, past industry projects,
   recent projects), adds a curated set of classic/earlier papers and supervised
   thesis students, tags each item by TYPE and APPLICATION, groups into a single
   grid, keeps only Vision-modality items, and filters via Application / Type /
   Year dropdowns. No duplicates: work that already appears as a paper is not
   repeated as a student card. */
(function () {
  "use strict";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function extLink(href, label) {
    var a = el("a", null, label);
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    return a;
  }

  /* ---------- application classifier (fallback = Scientific & Industrial) ---------- */
  var AUTO = "Automotive & Mobility",
      MED = "Biomedical Imaging",
      SAFETY = "Public Safety & Defense",
      CONSUMER = "Image Enhancements",
      SCI = "Scientific & Industrial",
      PDM = "Predictive Maintenance",
      REMOTE = "Remote Sensing",
      FINANCE = "Finance and Trading",
      MODELOPT = "Model Optimization",
      STREAM = "Streaming and Media";

  var APP_RULES = [
    [AUTO, /vehicle|driver|fleet|telematics|automotive|\bDTC\b|malfunction|predictive maintenance|in-?cabin|license plate|fuel|engine|onboard|dashboard/i],
    [MED, /x-?ray|chest|radiolog|clinical|patient|\bmedic|pathology|diagnos/i],
    [SAFETY, /distress|maritime|body-?worn|forensic|covert|underground|surveillance|defense|combat|\bincident\b|rescue|emergency|dehaz|\bhaze\b|egocentric/i],
    [CONSUMER, /photo|bookmark|comic|super-?resolution|\bblur\b|segmentation|handwrit|music|everyday|stitch/i]
  ];
  function classifyApp(text) {
    text = String(text || "");
    for (var i = 0; i < APP_RULES.length; i++) if (APP_RULES[i][1].test(text)) return APP_RULES[i][0];
    return SCI;
  }

  /* ---------- data-modality classifier (Vision vs Signals; fallback = Vision) ---------- */
  var VISION = "Vision", SIGNALS = "Signals";
  var DATA_VISION_RE = /image|video|vision|visual|photo|x-?ray|chest|segmentation|super-?resolution|\bblur\b|plate|panoramic|egocentric|dashboard|dehaz|\bhaze\b|face|camera|\broot\b|stitch|comic|handwrit|ocr/i;
  var DATA_SIGNAL_RE = /audio|acoustic|seismic|sonar|telematics|sensor|time[- ]of[- ](flight|arrival)|time of arrival|\bSNR\b|\bsignal|\bping\b|\becho\b|malfunction|predictive maintenance|anomaly|\bfuel\b|in-?cabin|\bDTC\b|billing|financial|\bFX\b|\bbond\b|trader|latent|alarm|biosonar|localization|cellular/i;
  function classifyData(text) {
    text = String(text || "");
    if (DATA_VISION_RE.test(text)) return VISION;
    if (DATA_SIGNAL_RE.test(text)) return SIGNALS;
    return VISION;
  }
  function dataFromTypes(dataTypes) {
    var v = 0, s = 0;
    (dataTypes || []).forEach(function (d) {
      if (/image|video/i.test(d)) v++;
      else if (/signal|audio|voice|graph/i.test(d)) s++;
    });
    return v > s ? VISION : (s > v ? SIGNALS : VISION);
  }

  var items = [];

  /* ---------- Recent publications (vision / signal / anomaly subset) ---------- */
  var PAPER_IDS = {
    "pub-2026-license-plate-recoverability": 1, "pub-2025-chest-xray-rejection": 1,
    "pub-2026-calexnet": 1, "pub-2025-panoramic-incident-summaries": 1,
    "pub-2026-normal-latent-clustering": 1
  };
  var PUB_APP = {
    "pub-2026-license-plate-recoverability": AUTO,
    "pub-2025-chest-xray-rejection": MED,
    "pub-2026-calexnet": MODELOPT,
    "pub-2025-panoramic-incident-summaries": SAFETY,
    "pub-2026-normal-latent-clustering": PDM
  };
  var PUB_DATA = {
    "pub-2026-license-plate-recoverability": VISION,
    "pub-2025-chest-xray-rejection": VISION,
    "pub-2026-calexnet": VISION,
    "pub-2025-panoramic-incident-summaries": VISION,
    "pub-2026-normal-latent-clustering": SIGNALS
  };
  (window.RECENT_PUBLICATIONS || []).filter(function (p) { return PAPER_IDS[p.id]; }).forEach(function (p) {
    var links = [];
    if (p.venueHref) links.push({ k: /arxiv/i.test(p.venueHref) ? "arXiv" : (/github/i.test(p.venueHref) ? "Project" : "Paper"), u: p.venueHref });
    items.push({
      type: "Papers and Preprints",
      app: PUB_APP[p.id] || classifyApp(p.title + " " + (p.summary || "")),
      data: PUB_DATA[p.id] || classifyData(p.title + " " + (p.summary || "")),
      year: p.year, title: p.title,
      authorsHtml: (p.authors || []).map(function (a) { return a.self ? "<b>" + a.name + "</b>" : a.name; }).join(", "),
      venue: (p.venue || "").replace(/\s*\((?:MDPI|Nature)\)\s*$/i, ""),
      desc: p.summary || "", links: links
    });
  });

  /* ---------- Classic / earlier papers (hardcoded thematic core) ---------- */
  [
    { year: 2014, app: REMOTE, data: SIGNALS, title: "Energy-Efficient Time-of-Flight Estimation in the Presence of Outliers: A Machine Learning Approach",
      venue: "IEEE J-STARS", doi: "https://doi.org/10.1109/JSTARS.2013.2295324",
      desc: "A machine-learning approach to time-of-flight estimation that stays accurate and energy-efficient even when the range measurements are corrupted by heavy outliers." },
    { year: 2013, app: REMOTE, data: SIGNALS, title: "Time-of-flight estimation in the presence of outliers. Part II: Multiple echo processing",
      venue: "IEEE TGRS", doi: "https://doi.org/10.1109/TGRS.2013.2276919",
      desc: "Outlier-robust time-of-flight estimation extended to disentangle and process multiple overlapping echoes in noisy returns." },
    { year: 2013, app: REMOTE, data: SIGNALS, title: "Time-of-flight estimation in the presence of outliers. Part I: Single echo processing",
      venue: "IEEE TGRS", doi: "https://doi.org/10.1109/TGRS.2013.2272737",
      desc: "Outlier-robust time-of-flight estimation for the single-echo case, recovering reliable range from noise-corrupted returns." },
    { year: 2012, app: REMOTE, data: SIGNALS, title: "Semi-coherent time of arrival estimation using regression",
      venue: "J. Acoust. Soc. Am. (JASA)", doi: "https://doi.org/10.1121/1.4730885",
      desc: "A regression-based semi-coherent estimator that recovers time of arrival reliably from noisy acoustic signals." },
    { year: 2011, app: REMOTE, data: SIGNALS, title: "Biosonar-inspired source localization in low SNR",
      venue: "BIOSIGNALS", doi: "https://doi.org/10.5220/0003126803990404",
      desc: "A biosonar-inspired method that localizes sources robustly under very low signal-to-noise conditions." },
    { year: 2010, app: REMOTE, data: SIGNALS, title: "SNR-dependent filtering for Time Of Arrival estimation in high noise",
      venue: "IEEE MLSP", doi: "https://doi.org/10.1109/MLSP.2010.5588848",
      desc: "SNR-adaptive filtering that keeps time-of-arrival estimation accurate under high-noise regimes." },
    { year: 2008, app: REMOTE, data: SIGNALS, title: "A data fusion and multiple ping method for improving the resolution of low-power acoustic and seismic sensing",
      venue: "J. Acoust. Soc. Am. (JASA)", doi: "https://doi.org/10.1121/1.4783265",
      desc: "A data-fusion and multi-ping scheme that lifts the resolution of low-power acoustic and seismic sensing for covert underground detection." },
    { year: 2005, app: CONSUMER, data: VISION, title: "Multiscale Segmentation by Combining Motion and Intensity Cues",
      venue: "IEEE CVPR", doi: "https://doi.org/10.1109/CVPR.2005.111",
      desc: "Multiscale image segmentation that fuses motion and intensity cues for robust boundaries in noisy video." },
    { year: 2013, app: CONSUMER, data: VISION, title: "Accurate Blur Models vs. Image Priors in Single Image Super-Resolution",
      venue: "IEEE ICCV", doi: "https://doi.org/10.1109/ICCV.2013.320",
      desc: "Shows that accurate blur modeling matters more than strong image priors for reliable single-image super-resolution." },
    { year: 2018, app: SAFETY, data: VISION, title: "Robust Motion Compensation for Forensic Analysis of Egocentric Video using Joint Stabilization and Tracking",
      venue: "IEEE ICSEE", doi: "https://doi.org/10.1109/ICSEE.2018.8646265",
      desc: "Joint stabilization and tracking that robustly compensates motion in shaky egocentric video for forensic analysis." }
  ].forEach(function (c) {
    items.push({
      type: "Papers and Preprints", app: c.app, data: c.data, year: c.year, title: c.title,
      authorsHtml: "A. Apartsin et al.", venue: c.venue,
      desc: c.desc, links: [{ k: "Paper", u: c.doi }]
    });
  });

  /* ---------- Patents (excludes the two language patents) ---------- */
  var PATENT_EXCLUDE = {
    "https://patents.google.com/patent/US10825450B2/en": 1,
    "https://patents.google.com/patent/US20090070321A1/en": 1
  };
  var PATENT_APP = {
    "https://patents.google.com/patent/IL308506A/en": AUTO,
    "https://patents.google.com/patent/US20240338980A1/en": PDM,
    "https://patents.google.com/patent/US20220382939A1/en": PDM,
    "https://patents.google.com/patent/US11868899B2/en": MODELOPT,
    "https://patents.google.com/patent/US20240013095A1/en": PDM,
    "https://patents.google.com/patent/EP4270251A1/en": PDM,
    "https://patents.google.com/patent/EP4099623A1/en": MODELOPT,
    "https://patents.google.com/patent/US8175412B2/en": CONSUMER
  };
  var PATENT_DATA = {
    "https://patents.google.com/patent/US8175412B2/en": VISION
  };
  (window.PATENT_CARDS || []).filter(function (c) { return !PATENT_EXCLUDE[c.idHref]; }).forEach(function (c) {
    items.push({
      type: "Patent", app: PATENT_APP[c.idHref] || SCI,
      data: PATENT_DATA[c.idHref] || SIGNALS,
      year: parseInt(c.year, 10) || null,
      title: c.title, authorsHtml: c.inventors, venue: c.companyName,
      desc: c.summary || "", links: [{ k: c.idLabel || "Patent", u: c.idHref }]
    });
  });

  /* ---------- Industry projects (Signals / Images / Video / Audio subset) ---------- */
  var INDUSTRY_APP = {
    "Questar Automotive": AUTO, "Motorola Solutions": SAFETY, "Smartlight": MED,
    "Citi": FINANCE, "Amdocs": SCI, "Tegrity": SCI, "MPCode": SCI,
    "Moldat Wireless": SCI, "Solid State Institute": SCI
  };
  var INDUSTRY_APP_TITLE = {
    "Generative-Based Evaluation Framework for Anomaly Detection Models": PDM,
    "Anomaly Detection for Automotive Predictive Maintenance via Telematics": PDM,
    "Usage-Based Component Models for Vehicle Predictive Maintenance": PDM,
    "Pattern Mining for Vehicle Malfunction Sequences in Predictive Maintenance": PDM,
    "Vehicle Malfunction Classification via In-Cabin Audio": PDM,
    "Pipeline Distillation into a Single Onboard Model for Resource-Constrained Vehicle Computers": PDM,
    "Sensory Data Acquisition and Analysis for Physical Experiments": REMOTE,
    "A Synchronized Pen-Based Annotation Framework for Multimedia Presentations": STREAM,
    "Background Modeling and Object Detection/Tracking for Projector-Camera Systems": STREAM,
    "Efficient Encoding and Streaming of Object-Based Video": STREAM,
    "Image Bundling for Low-Bandwidth Delivery": STREAM
  };
  var INDUSTRY_DESC = {
    "Generative-Based Evaluation Framework for Anomaly Detection Models": "A generative framework that stress-tests automotive anomaly-detection models by synthesizing realistic fault signals across rare operating conditions. Covering the failure modes real fleets seldom record exposes weak spots before a model ever meets genuine outliers in the field.",
    "Anomaly Detection for Automotive Predictive Maintenance via Telematics": "Detects incipient vehicle faults from streaming fleet telematics before they escalate into breakdowns. Separating early fault signatures from ordinary driving noise lets maintenance act on genuine anomalies instead of chasing false alarms.",
    "Usage-Based Component Models for Vehicle Predictive Maintenance": "Models component wear from how each vehicle is actually driven to forecast upcoming maintenance needs. Grounding the forecast in real usage signals keeps predictions accurate despite noisy sensors and widely varying operating conditions.",
    "Driver Behavior, Passenger Comfort, and Dangerous Event Monitoring": "Scores driver behavior, passenger comfort, and dangerous events from onboard motion and telematics signals. Robust event detection distinguishes genuinely risky maneuvers from road noise and benign bumps so the alerts stay trustworthy.",
    "Pipeline Distillation into a Single Onboard Model for Resource-Constrained Vehicle Computers": "Distills a multi-stage signal-processing pipeline into one compact model that runs on limited in-vehicle hardware. The distilled model preserves anomaly-detection accuracy while tolerating the noisy, resource-constrained conditions of real onboard computers.",
    "Fuel Efficiency Modeling": "Models fuel efficiency from vehicle telematics to guide more economical operation. Filtering the estimate against noisy sensor streams and outlier trips keeps the guidance stable across different drivers and routes.",
    "Pattern Mining for Vehicle Malfunction Sequences in Predictive Maintenance": "Mines recurring malfunction sequences in vehicle signal histories to anticipate failures before they occur. Recognizing the tell-tale patterns amid noisy event logs turns scattered anomalies into reliable early warnings.",
    "Vehicle Malfunction Classification via In-Cabin Audio": "Classifies vehicle malfunctions from in-cabin audio captured during normal driving. Robust acoustic modeling separates fault sounds from engine, road, and cabin noise so the diagnoses hold up in real conditions.",
    "Dehazing for Object Recognition": "Removes atmospheric haze from imagery so downstream object recognition stays reliable in poor visibility. Restoring the contrast lost to fog and scatter keeps detection accurate under the degraded conditions cameras face outdoors.",
    "Face Re-Identification with Super-Resolution": "Recovers identity from low-resolution surveillance faces by super-resolving them before matching. Reconstructing fine facial detail from degraded, noisy frames keeps re-identification dependable where the raw footage would fail.",
    "Direction-of-Interest Estimation for 360° Cameras": "Estimates the direction of interest in 360° camera video to focus situational awareness. Robust cue aggregation holds the estimate steady despite the distortion and motion noise inherent to panoramic capture.",
    "Time-to-Impact Estimation on Mobile": "Estimates time-to-impact from monocular mobile video to drive collision warnings. Robust motion analysis keeps the estimate reliable against camera shake, lighting changes, and the visual noise of handheld capture.",
    "Bond Price Prediction for Auctions": "Predicts bond auction prices from noisy financial market signals. Modeling the signal beneath volatile, outlier-heavy market moves keeps the forecasts usable even when conditions turn erratic.",
    "Causality Analysis in FX Financial Flows": "Recovers causal structure from noisy foreign-exchange flow data. Distinguishing genuine drivers from spurious correlations makes the inferred relationships robust to the market's heavy noise and outliers.",
    "Anomaly Detection for Trader Compliance Auditing": "Flags anomalous trading patterns in financial activity for compliance auditing. Separating true irregularities from ordinary market noise keeps investigators focused on real outliers instead of false positives.",
    "FX Trader Informativeness Classification": "Classifies how informative individual FX traders are from their trading signal footprint. Robust modeling extracts the persistent signal from noisy, bursty activity so the ranking reflects genuine skill.",
    "Matching Exchange Trades with Wire Transfers via Correlation and Constraint Optimization": "Matches exchange trades to their corresponding wire transfers using correlation and constraint optimization. The method resolves the pairing reliably even when records are incomplete, misaligned, or corrupted by noise.",
    "Distributed Billing System Load Modeling": "Models load on a large distributed billing system from operational signals to guide capacity planning. Robust estimation absorbs traffic spikes and outlier events so the plan holds under real, bursty demand.",
    "A Synchronized Pen-Based Annotation Framework for Multimedia Presentations": "Synchronizes pen-based annotations with recorded multimedia presentations so ink aligns with the underlying content. Robust timing alignment keeps the overlay accurate despite capture jitter and irregular presenter pacing.",
    "Background Modeling and Object Detection/Tracking for Projector-Camera Systems": "Models the background and tracks objects in projector-camera video where projected light constantly rewrites the scene. Robust background estimation separates real motion from projection artifacts and lighting noise.",
    "Efficient Encoding and Streaming of Object-Based Video": "Encodes and streams object-based video under tight bandwidth constraints. Prioritizing the salient objects preserves perceptual quality even as network conditions degrade and available bandwidth fluctuates.",
    "Image Bundling for Low-Bandwidth Delivery": "Bundles images for efficient delivery over low-bandwidth links. Adapting the payload to constrained, unreliable channels keeps the images usable where naive transmission would stall or drop detail.",
    "Network Management and Optimization for Indoor Cellular Communications": "Optimizes indoor cellular performance from radio signal measurements taken across the coverage area. Robust estimation copes with multipath, interference, and measurement noise to keep the network tuned under real conditions.",
    "X-Ray Image Detection in Live Video": "Detects and isolates X-ray images embedded within live video streams. Reliable separation of the X-ray content from surrounding video noise keeps the extracted frames clean for downstream inspection.",
    "Sensory Data Acquisition and Analysis for Physical Experiments": "Acquires and analyzes sensor data from physical laboratory experiments. Careful noise handling and outlier rejection turn raw, imperfect measurements into trustworthy experimental results."
  };
  var INDUSTRY_EXCLUDE = { "Network Management and Optimization for Indoor Cellular Communications": 1 };
  (window.PAST_RESEARCH_TASK_CARDS || []).filter(function (c) {
    var dt = (c.dataTypes || []).join(" ");
    return !/Text|Voice/.test(dt) && !INDUSTRY_EXCLUDE[c.title];
  }).forEach(function (c) {
    items.push({
      type: "Industry Project", app: INDUSTRY_APP_TITLE[c.title] || INDUSTRY_APP[c.organization] || classifyApp(c.title),
      data: dataFromTypes(c.dataTypes),
      year: parseInt(c.year, 10) || null, title: c.title, authorsHtml: c.organization, venue: "",
      desc: INDUSTRY_DESC[c.title] || "",
      links: (c.links || []).map(function (l) { return { k: l.label, u: l.href }; })
    });
  });

  /* ---------- Recent projects (vision / signal subset) ---------- */
  var PROJ_APP = {};
  var PROJ_DESC = {};
  (window.RECENT_PROJECT_CARDS || []).filter(function (c) { return PROJ_APP[c.title]; }).forEach(function (c) {
    items.push({
      type: "Research Project", app: PROJ_APP[c.title], data: VISION,
      year: null, title: c.title, authorsHtml: "", venue: c.eyebrow || "",
      desc: PROJ_DESC[c.title] || c.description || "", links: (c.links || []).map(function (l) { return { k: l.label, u: l.href }; })
    });
  });

  /* ---------- Supervised thesis students (curated; excludes any with a paper) ---------- */
  [
    { name: "Matan Chazanovitz", degree: "M.Sc.", app: SAFETY, title: "Degradation-Aware Selective Super-Resolution",
      desc: "Selective super-resolution that concentrates enhancement on genuinely degraded image regions while leaving already-clean areas untouched. Adapting to where degradation actually occurs avoids the artifacts that uniform upscaling introduces on noisy inputs." },
    { name: "Adir Cohen", degree: "B.Sc.", app: STREAM, year: 2025, title: "Photo Tagging via Graph Knowledge Propagation",
      desc: "Propagates labels across an image-similarity graph to tag large photo collections consistently. Borrowing evidence from neighboring photos keeps tagging reliable when any single image is too noisy or ambiguous to classify on its own." },
    { name: "Yuri Liziakin", degree: "M.Sc.", app: SAFETY, year: 2025, title: "Active Vision for Aerial Imaging",
      desc: "An active-vision pipeline that first scans an aerial scene coarsely, then revisits high-value regions at full resolution. Spending detail only where it matters saves bandwidth while keeping the important targets sharp despite noisy wide-area capture." },
    { name: "Rom Hirsch & Yarom Swisa", degree: "B.Sc.", app: SAFETY, year: 2024, title: "Classification of Dark Images",
      desc: "A low-light image classifier that applies illumination-aware preprocessing before recognition. Compensating for darkness and sensor noise keeps classification accurate on the dim, low-contrast scenes where standard models fail." },
    { name: "Ben Kedarya & Yael Rikka", degree: "B.Sc.", app: SAFETY, year: 2024, data: SIGNALS, title: "Audio Alarm Detection",
      desc: "Detects critical sounds such as fire alarms and doorbells in real time and drives visual or haptic alerts for hearing-impaired users. Robust acoustic modeling picks the target sounds out of everyday background noise so alerts fire only when they should." },
    { name: "Eyal Reis", degree: "B.Sc.", app: AUTO, year: 2023, title: "Recognition of Control Elements in Vehicle Dashboards",
      desc: "A vision system that detects and classifies the controls and indicators on a vehicle dashboard for assistive and testing workflows. Robust recognition holds up across varied dashboard layouts, reflections, and uneven in-cabin lighting." },
    { name: "Aharon Sahalulu", degree: "B.Sc.", app: SAFETY, year: 2023, title: "Haze-Aware Object Detection",
      desc: "A haze-aware object detector that compensates for the visibility lost to fog and atmospheric scatter. Modeling the degradation explicitly keeps detection consistent in the adverse-weather scenes that defeat detectors trained on clear imagery." },
    { name: "Yael Galifat", degree: "M.Sc.", app: MODELOPT, year: 2020, title: "Deep Model Optimization via Selective Inferencing",
      desc: "Routes only the uncertain samples to heavier models while easy inputs exit early through a lightweight path. Concentrating compute on the genuinely hard, ambiguous cases cuts average cost while preserving accuracy." },
    { name: "Barak Katz", degree: "B.Sc.", app: SAFETY, year: 2020, title: "Detection of Human Interactions in Egocentric Video",
      desc: "A first-person video model that recognizes human interactions from egocentric footage using temporal and viewpoint-aware cues. Robust modeling absorbs the heavy motion and unstable framing typical of head-mounted cameras." },
    { name: "Dan Basson", degree: "M.Sc.", app: MODELOPT, year: 2019, title: "Curriculum Learning for Image Classification",
      desc: "Orders training samples from easy to hard so an image classifier learns on a structured curriculum. The schedule stabilizes training under limited budgets and reduces sensitivity to noisy or mislabeled examples." },
    { name: "Ran Mishael", degree: "B.Sc.", app: CONSUMER, year: 2018, title: "Joint Segmentation and Super-Resolution",
      desc: "A single-pass model that performs segmentation and super-resolution jointly, sharing features between the two tasks. Solving them together recovers reliable detail and boundaries on low-resolution, noisy images that either task alone would miss." },
    { name: "Ozi Marom", degree: "B.Sc.", app: MED, year: 2013, title: "3D Vision for Vegetation Root Monitoring",
      desc: "A stereo 3D imaging setup that reconstructs plant-root structures for non-destructive monitoring of morphology and growth. Careful handling of occlusion and imaging noise keeps the reconstructions accurate enough to track change over time." }
  ].forEach(function (s) {
    items.push({
      type: "Student Supervision", app: s.app, data: s.data || VISION, year: s.year || null, title: s.title,
      authorsHtml: s.name + " &middot; " + s.degree, venue: "Supervised thesis (" + s.degree + ")",
      desc: s.desc, links: s.links || []
    });
  });

  /* ---------- keep only the Vision modality (this is the vision page) ---------- */
  items = items.filter(function (it) { return it.data === "Vision"; });

  /* ---------- card builder (type + year badge; no application badge) ---------- */
  var TYPE_CLASS = {
    "Papers and Preprints": "t-paper", "Patent": "t-patent",
    "Student Supervision": "t-supervised", "Industry Project": "t-industry", "Research Project": "t-project"
  };
  var TYPE_ORDER = { "Papers and Preprints": 1, "Patent": 3, "Student Supervision": 4, "Industry Project": 5, "Research Project": 6 };
  var APP_CLASS = {};
  APP_CLASS[AUTO] = "a-auto"; APP_CLASS[MED] = "a-med"; APP_CLASS[SAFETY] = "a-safety";
  APP_CLASS[CONSUMER] = "a-consumer"; APP_CLASS[SCI] = "a-sci";
  APP_CLASS[PDM] = "a-pdm"; APP_CLASS[REMOTE] = "a-remote"; APP_CLASS[FINANCE] = "a-finance";
  APP_CLASS[MODELOPT] = "a-modelopt"; APP_CLASS[STREAM] = "a-stream";

  function buildCard(it) {
    var li = el("li", "isp-card");
    li.setAttribute("data-type", it.type);
    li.setAttribute("data-app", it.app);
    li.setAttribute("data-year", it.year || "");
    var tags = el("div", "isp-card__tags");
    tags.appendChild(el("span", "isp-tag " + (TYPE_CLASS[it.type] || ""), it.type));
    tags.appendChild(el("span", "isp-tag isp-tag--app " + (APP_CLASS[it.app] || "a-sci"), it.app));
    if (it.year) tags.appendChild(el("span", "isp-tag isp-tag--year", String(it.year)));
    li.appendChild(tags);
    li.appendChild(el("h3", "isp-card__title", it.title));
    if (it.authorsHtml) { var m = el("p", "isp-card__meta"); m.innerHTML = it.authorsHtml; li.appendChild(m); }
    if (it.venue) li.appendChild(el("p", "isp-card__venue", it.venue));
    if (it.desc) li.appendChild(el("p", "isp-card__desc", it.desc));
    if (it.links && it.links.length) {
      var lk = el("p", "isp-card__links");
      it.links.forEach(function (l, i) {
        if (i > 0) lk.appendChild(document.createTextNode(" · "));
        lk.appendChild(extLink(l.u, l.k));
      });
      li.appendChild(lk);
    }
    return li;
  }

  /* ---------- render into a single grid, sorted by year (newest first) ---------- */
  var container = document.getElementById("isp-sections");
  if (!container) return;
  var grid = el("ol", "isp-grid");
  container.appendChild(grid);
  items.slice().sort(function (a, b) {
    return (b.year || 0) - (a.year || 0) ||
      (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9) ||
      String(a.title || "").localeCompare(String(b.title || ""));
  }).forEach(function (it) { grid.appendChild(buildCard(it)); });

  /* ---------- Application / Type / Year dropdown filters ---------- */
  var activeType = "all", activeApp = "all", activeYear = "all";
  function apply() {
    var cards = grid.querySelectorAll(".isp-card");
    for (var i = 0; i < cards.length; i++) {
      var okT = activeType === "all" || cards[i].getAttribute("data-type") === activeType;
      var okA = activeApp === "all" || cards[i].getAttribute("data-app") === activeApp;
      var okY = activeYear === "all" || cards[i].getAttribute("data-year") === activeYear;
      cards[i].style.display = (okT && okA && okY) ? "" : "none";
    }
  }
  function fillSelect(id, values, onChange) {
    var sel = document.getElementById(id);
    if (!sel) return;
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.value; o.textContent = v.label;
      sel.appendChild(o);
    });
    sel.selectedIndex = 0;
    sel.addEventListener("change", function () { onChange(sel.value); apply(); });
  }
  function optionList(key, order) {
    var c = {};
    items.forEach(function (it) { var v = it[key]; if (v != null && v !== "") c[v] = (c[v] || 0) + 1; });
    var keys = Object.keys(c).sort(function (a, b) {
      if (order) return (order[a] || 99) - (order[b] || 99);
      return Number(b) - Number(a);
    });
    var out = [{ value: "all", label: (key === "year" ? "All years" : "All") + " (" + items.length + ")" }];
    keys.forEach(function (k) { out.push({ value: k, label: k + " (" + c[k] + ")" }); });
    return out;
  }
  fillSelect("isp-sel-app", optionList("app"), function (v) { activeApp = v; });
  fillSelect("isp-sel-type", optionList("type", TYPE_ORDER), function (v) { activeType = v; });
  fillSelect("isp-sel-year", optionList("year"), function (v) { activeYear = v; });
})();
