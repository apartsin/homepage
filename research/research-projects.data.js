window.RESEARCH_PROJECT_CARDS = [
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/EMR-ACH/master/paper/figures/hero_emr_ach.png",
    imageAlt: "EMR-ACH evidence matrix diagram showing articles decomposed across competing hypotheses",
    theme: "Robust Language",
    title: "EMR-ACH",
    description: "LLM geopolitical forecasting reframed as a structured evidence matrix using Heuer's Analysis of Competing Hypotheses. Covers contrastive indicator generation, diagnostic weighting, and a multi-agent adversarial variant, benchmarked on leakage-clean forecasting, GDELT, and earnings tracks.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/EMR-ACH" }
    ]
  },
  {
    image: "../assets/research/research-projects/implicit-entities-hero.png",
    imageAlt: "Contextual text fragments connected by glowing lines converging on a hidden entity silhouette",
    theme: "Robust Language",
    title: "ImplicitEntities",
    description: "IRC-Bench: a benchmark for recognizing named entities from contextual cues alone in first-person reminiscence narratives, without explicit mentions. Covers 25K samples across 12K Wikidata-linked entities, with baselines spanning embedding retrieval, LLM prompting, DPR fine-tuning, and QLoRA adaptation.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/ImplicitEntities" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/ZKDroneSwarm/master/docs/hero.png",
    imageAlt: "ZK drone swarm engaging distributed targets",
    theme: "Sparse Multi-Agent AI",
    title: "ZKDroneSwarm",
    description: "Decentralized drone task allocation under zero-knowledge constraints: no communication, no priors, no shared state. Each drone independently runs a matrix-factorization policy updated from a public interaction broadcast, recovering emergent coordination from interaction outcomes alone.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/ZKDroneSwarm" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/DGLD4Energetic/master/figures/readme_hero.png",
    imageAlt: "Domain-gated latent diffusion: from a Gaussian latent cloud to the converged headline lead 3,4,5-trinitro-1,2-isoxazole",
    theme: "Spec-Driven GenAI",
    title: "DGLD4Energetic",
    description: "Domain-gated latent diffusion for novel energetic material discovery, yielding 12 DFT-confirmed CHNO leads. Headline compound reaches density 2.09 g/cm³ and detonation velocity 8.25 km/s with max-Tanimoto 0.27 to all training molecules; reproducible end-to-end on commodity hardware.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/DGLD4Energetic" },
      { label: "Zenodo", href: "https://doi.org/10.5281/zenodo.19821953" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/AutoAD/main/assets/hero.png",
    imageAlt: "Leave-cluster-out validation on a normal-data manifold: clusters held out as pseudo-anomalies to rank anomaly detectors without labels",
    theme: "Robust Signals",
    title: "AutoAD",
    description: "Unsupervised model selection for anomaly detection when no anomaly labels exist. Introduces Leave-Cluster-Out (LCO) validation: hold out a normal-data cluster as a pseudo-anomaly and rank detectors by how well they separate it. Combined with structured synthetic perturbations and prediction-residual consistency via an anomaly-type-aware rank-fusion combiner, targeting sub-0.05 VUS-PR regret on the TSB-AD benchmark.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/AutoAD" },
      { label: "Paper blueprint", href: "https://apartsinprojects.github.io/AutoAD/" }
    ]
  },
  {
    image: "https://raw.githubusercontent.com/ApartsinProjects/CalexNet/master/paper/figures/hero.png",
    imageAlt: "CalexNet cascade: a CNN backbone with three early-exit branches; easy samples exit at branch 1, harder samples flow deeper",
    theme: "Robust Vision",
    title: "CalexNet",
    description: "Training-recipe modification for CNN early-exit cascades that closes three train-inference mismatches via cascade-aligned importance weighting, CPM calibration, and knowledge distillation. Matches or improves the accuracy-FLOPs Pareto frontier over PTEEnet, ZTW, and BoostNet on ResNet18/50 across CIFAR-100 and CINIC-10.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CalexNet" }
    ]
  },
  {
    image: "../assets/research/research-projects/coreason-readme-hero.png",
    imageAlt: "CoReason README hero visual",
    theme: "Sparse Multi-Agent AI",
    title: "CoReason",
    description: "AI-native learning platform where students practice reasoning with LLMs through iterative critique-and-improvement loops. Supports structured assessment, multilingual content, and course-integrated reporting.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CoReason" }
    ]
  },
  {
    image: "../assets/research/research-projects/coeval-banner.jpg",
    imageAlt: "CoEval project visual",
    theme: "Sparse Multi-Agent AI",
    title: "CoEval",
    description: "Ensemble-based LLM evaluation framework where models rotate through teacher, student, and judge roles to build synthetic benchmarks. Generates interactive analysis reports with multi-provider support.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/CoEval" }
    ]
  },
  {
    image: "../assets/research/research-projects/stablesteering-banner.png",
    imageAlt: "StableSteering project visual",
    theme: "Spec-Driven GenAI",
    title: "StableSteering",
    description: "Interactive diffusion steering system that moves from a text prompt into preference-guided image refinement loops. Ships with a FastAPI runtime, session tracing, and GPU-backed Diffusers integration.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/StableSteering" }
    ]
  },
  {
    image: "../assets/research/vigor-hero.png",
    imageAlt: "VIGOR speculative code generation visual",
    theme: "Spec-Driven GenAI",
    title: "VIGOR",
    description: "Incremental code generation under a forward-only commit protocol with structured gating. Each step commits one line to an immutable prefix and records machine-readable traces for process-level analysis.",
    links: [
      { label: "GitHub", href: "https://github.com/ApartsinProjects/SpeculativeCodeGeneration" }
    ]
  }
];
