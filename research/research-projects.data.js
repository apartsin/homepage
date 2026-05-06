window.RESEARCH_PROJECT_CARDS = [
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/EMR-ACH/master/paper/figures/hero_emr_ach.png",
    imageAlt: "EMR-ACH evidence matrix diagram showing articles decomposed across competing hypotheses",
    title: "EMR-ACH",
    description: "LLM geopolitical forecasting reframed as a structured matrix problem using Heuer's Analysis of Competing Hypotheses. Decomposes each forecast into indicator generation, evidence scoring, and diagnostic weighting across competing hypotheses. Includes a multi-agent adversarial variant and a leakage-clean benchmark across three tracks: public forecasting markets, GDELT geopolitical events, and S&P 500 earnings.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/EMR-ACH" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/DGLD4Energetic/master/figures/readme_hero.png",
    imageAlt: "Domain-gated latent diffusion: from a Gaussian latent cloud to the converged headline lead 3,4,5-trinitro-1,2-isoxazole",
    title: "DGLD4Energetic",
    description: "Domain-gated latent diffusion for discovering novel energetic materials. Produced 12 DFT-confirmed CHNO leads, with headline compound L1 (3,4,5-trinitro-1,2-isoxazole) at density 2.09 g/cm³ and detonation velocity 8.25 km/s, with max-Tanimoto similarity of 0.27 to all 65,980 training molecules. Fully reproducible end-to-end on commodity hardware; large checkpoints hosted on Zenodo.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/DGLD4Energetic" },
      { label: "Zenodo", href: "https://doi.org/10.5281/zenodo.19821953" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/CalexNet/master/paper/figures/hero.png",
    imageAlt: "CalexNet cascade: a CNN backbone with three early-exit branches; easy samples exit at branch 1, harder samples flow deeper",
    title: "CalexNet",
    description: "Training-recipe modification for CNN early-exit cascades that closes three train-inference mismatches: cascade-aligned importance weighting, cascade-aware CPM calibration, and a distilled classification target against the backbone's full softmax. Matches or improves the accuracy-FLOPs Pareto frontier over PTEEnet, ZTW, and BoostNet baselines on ResNet18/50 across CIFAR-100 and CINIC-10.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CalexNet" }
    ]
  },
  {
    image: "../assets/research/research-projects/coreason-readme-hero.png",
    imageAlt: "CoReason README hero visual",
    title: "CoReason",
    description: "AI-native learning platform where students practice reasoning with LLMs through iterative critique-and-improvement loops. Supports structured assessment, multilingual content, and course-integrated reporting.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CoReason" }
    ]
  },
  {
    image: "../assets/research/research-projects/coeval-banner.jpg",
    imageAlt: "CoEval project visual",
    title: "CoEval",
    description: "Ensemble-based LLM evaluation framework where models rotate through teacher, student, and judge roles to build synthetic benchmarks. Generates interactive analysis reports with multi-provider support.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CoEval" }
    ]
  },
  {
    image: "../assets/research/research-projects/stablesteering-banner.png",
    imageAlt: "StableSteering project visual",
    title: "StableSteering",
    description: "Interactive diffusion steering system that moves from a text prompt into preference-guided image refinement loops. Ships with a FastAPI runtime, session tracing, and GPU-backed Diffusers integration.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/StableSteering" }
    ]
  },
  {
    image: "../assets/research/vigor-hero.png",
    imageAlt: "VIGOR speculative code generation visual",
    title: "VIGOR",
    description: "Incremental code generation under a forward-only commit protocol with structured gating. Each step commits one line to an immutable prefix and records machine-readable traces for process-level analysis.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/SpeculativeCodeGeneration" }
    ]
  }
];
