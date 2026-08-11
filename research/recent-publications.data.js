window.RECENT_PUBLICATIONS = [
  {
    id: "pub-2026-irc-bench",
    year: 2026,
    type: "Journal",
    title: "IRC-Bench: Recognizing Entities from Contextual Cues in First-Person Reminiscences",
    focus: "sparse",
    summary: "IRC-Bench evaluates whether models can identify people, places, and objects that first-person reminiscences reference only through indirect contextual cues rather than explicit mention. It probes reasoning that resolves references from scattered context alone, without a named target or shared state.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "E Moran", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Machine Learning and Knowledge Extraction (MAKE) (MDPI)",
    venueHref: "https://www.mdpi.com/2504-4990/8/7/186"
  },
  {
    id: "pub-2026-license-plate-recoverability",
    year: 2026,
    type: "Journal",
    title: "Mapping License Plate Recoverability Under Extreme Viewing Angles for Opportunistic Urban Sensing",
    focus: "robust",
    summary: "This work maps how reliably license plates can be read from steep, oblique viewing angles, quantifying recoverability across opportunistic urban sensing scenarios. It characterizes perception reliability as geometry becomes extreme, defining where field deployment stays dependable rather than assuming clean frontal captures.",
    authors: [
      { name: "I Adamenko", self: false },
      { name: "O Ben Aharon", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "AI (MDPI)",
    venueHref: "https://www.mdpi.com/2673-2688/7/7/237"
  },
  {
    id: "pub-2026-spine-benchmark",
    year: 2026,
    type: "Submitted",
    title: "SPINE: A Benchmark for Measuring the Epistemic Backbone of Large Language Models",
    focus: "sparse",
    summary: "SPINE is a benchmark that measures the epistemic backbone of large language models: whether they hold consistent factual commitments under pressure rather than capitulating to misleading follow-ups. It evaluates model reliability without a trusted external oracle, probing internal consistency where ground-truth supervision is unavailable.",
    authors: [
      { name: "G Shapira", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Harvard Dataverse (doi:10.7910/DVN/CG9X6D)",
    venueHref: "https://doi.org/10.7910/DVN/CG9X6D"
  },
  {
    id: "pub-2026-diagnostic-questioning",
    year: 2026,
    type: "Journal",
    title: "A benchmark for evaluating diagnostic questioning efficiency of LLMs in patient conversations",
    focus: "sparse",
    summary: "This benchmark measures how efficiently large language models ask diagnostic questions during patient conversations, rewarding models that reach correct conclusions with fewer, better-targeted queries. It evaluates reasoning under uncertainty where the model must gather evidence itself rather than rely on complete, pre-supplied state.",
    authors: [
      { name: "M Werthaim", self: false },
      { name: "M Kimhi", self: false },
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "Scientific Reports (Nature)",
    venueHref: "https://www.nature.com/articles/s41598-026-37022-y"
  },
  {
    id: "pub-2025-semantic-text-relations",
    year: 2025,
    type: "Journal",
    title: "Explainable Semantic Text Relations: A Question-Answering Framework for Comparing Document Content",
    focus: "sparse",
    summary: "This framework compares the content of two documents by generating and answering questions, producing an explainable account of where they agree, differ, or omit information. It assesses semantic relationships without a labeled similarity target, deriving judgments from structured reasoning rather than supervised ground truth.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "A Gottlib", self: false },
      { name: "G Benita", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Information (MDPI)",
    venueHref: "https://www.mdpi.com/2078-2489/16/12/1090"
  },
  {
    id: "pub-2025-teaching-practice-platform",
    year: 2025,
    type: "Journal",
    title: "Generative AI-Based Platform for Deliberate Teaching Practice: A Review and a Suggested Framework",
    focus: "spec",
    summary: "This work reviews generative AI systems for deliberate teaching practice and proposes a framework in which simulated classroom interactions serve as targeted rehearsal for specific pedagogical skills. Generation is bound to explicit instructional specifications, producing practice scenarios that satisfy defined teaching objectives rather than free-form dialogue.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "Y Cohen", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Education Sciences (MDPI)",
    venueHref: "https://www.mdpi.com/2227-7102/15/4/405"
  },
  {
    id: "pub-2026-sea-alert",
    year: 2026,
    type: "Journal",
    title: "SeaAlert: Critical Information Extraction From Maritime Distress Communications with Large Language Models",
    focus: "robust",
    summary: "SeaAlert extracts critical, actionable fields from maritime distress communications using large language models, converting terse and garbled emergency messages into structured situational information. It targets reliable extraction when language arrives noisy, fragmented, and time-critical, precisely the field conditions where standard parsing fails.",
    authors: [
      { name: "T Atia", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "IEEE Access",
    venueHref: "https://ieeexplore.ieee.org/document/11592329"
  },
  {
    id: "pub-2026-headline-rewriting",
    year: 2026,
    type: "Submitted",
    title: "LLM-guided headline rewriting for clickability enhancement without clickbait",
    focus: "spec",
    summary: "This method uses large language models to rewrite headlines for higher click appeal while enforcing a strict no-clickbait constraint on the rewritten text. Generation is governed by a hard specification: the output must raise clickability yet provably avoid sensationalism, satisfying a contract rather than a soft preference.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "L Halifa", self: false },
      { name: "S Bar", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2603.22459)",
    venueHref: "https://arxiv.org/abs/2603.22459"
  },
  {
    id: "pub-2025-chest-xray-rejection",
    year: 2026,
    type: "Journal",
    title: "Multi-pathology Chest X-ray Classification with Rejection Mechanisms",
    focus: "robust",
    summary: "This work adds rejection mechanisms to multi-pathology chest X-ray classification, letting the model abstain on cases it cannot classify confidently instead of forcing an unreliable label. It prioritizes operational reliability under ambiguous or degraded scans, trading coverage for trustworthy decisions in clinical deployment.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "A Tzahar", self: false },
      { name: "A Gottlib", self: false },
      { name: "T Verber", self: false },
      { name: "R Shagan Damti", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Scientific Reports (Nature)",
    venueHref: "https://arxiv.org/abs/2509.10348"
  },
  {
    id: "pub-2026-calexnet",
    year: 2026,
    type: "Journal",
    title: "CalexNet: Soft Cascade-Aligned Training and Calibration for Lightweight Early-Exit Branches",
    focus: "robust",
    summary: "CalexNet trains lightweight early-exit branches with soft cascade-aligned supervision and calibration so intermediate classifiers produce well-calibrated, trustworthy confidence estimates. It keeps inference dependable under tight compute budgets, ensuring early exits stay reliable rather than overconfident when resources are constrained.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Electronics (MDPI)",
    venueHref: "https://www.mdpi.com/2079-9292/15/10/2149"
  },
  {
    id: "pub-2025-panoramic-incident-summaries",
    year: 2025,
    type: "Preprint",
    title: "Stitching the Story: Creating Panoramic Incident Summaries from Body-Worn Footage",
    focus: "robust",
    summary: "This work stitches fragmented body-worn camera footage into coherent panoramic incident summaries that reconstruct an event from shaky, partial, first-person views. It builds reliable scene understanding from degraded, unstable video, the conditions field recordings actually present rather than curated benchmark clips.",
    authors: [
      { name: "D Cohen", self: false },
      { name: "I Efrosman", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2509.04370)",
    venueHref: "https://arxiv.org/abs/2509.04370"
  },
  {
    id: "pub-2026-clinical-comm-synthetic-survey",
    year: 2026,
    type: "Submitted",
    title: "Clinical Communication Processing with Models Trained on LLM-Generated Synthetic Data: A Structured Survey and Novel Application Case Studies",
    focus: "spec",
    summary: "This structured survey, with new case studies, examines training clinical communication models on LLM-generated synthetic data when real records are scarce or restricted. Synthetic generation is steered to a specification: the produced data must match clinical task requirements closely enough to train models that transfer to real deployment.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2608.05993)",
    venueHref: "https://arxiv.org/abs/2608.05993"
  },
  {
    id: "pub-2026-healthcare-it-computable-care",
    year: 2026,
    type: "Submitted",
    title: "Three Generations of Healthcare IT: From the Digital Record to the Computable Care Process",
    focus: "spec",
    summary: "This work organizes healthcare IT by the unit of information that systems can compute, adding an intent layer whose atomic object, the Actionable Clinical Record, recovers clinical intent from natural communication. It frames care delivery as acting on an explicit specification, separating prescribed, observed, and intended processes so that intent becomes computable rather than lost.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2608.08806)",
    venueHref: "https://arxiv.org/abs/2608.08806"
  },
  {
    id: "pub-2025-interjection-classification",
    year: 2025,
    type: "Preprint",
    title: "Beyond Words: Interjection Classification for Improved Human-Computer Interaction",
    focus: "robust",
    summary: "This work classifies interjections such as sighs and filler sounds to enrich human-computer interaction beyond literal word content. It targets robust understanding of the noisy, non-lexical vocal signals that pervade real speech, recovering meaning that transcript-only pipelines routinely discard.",
    authors: [
      { name: "Y Goren", self: false },
      { name: "Y Cohen", self: false },
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2509.03181)",
    venueHref: "https://arxiv.org/abs/2509.03181"
  },
  {
    id: "pub-2025-review-recommendation",
    year: 2025,
    type: "Preprint",
    title: "Code Review Without Borders: Evaluating Synthetic vs. Real Data for Review Recommendation",
    focus: "spec",
    summary: "Code Review Without Borders evaluates whether synthetic training data can substitute for scarce real data when recommending appropriate code reviewers. It probes generation against a functional specification: the synthetic data must reproduce the predictive signal of real data closely enough to sustain reviewer recommendation quality.",
    authors: [
      { name: "Y Cohen", self: false },
      { name: "D Ohayon", self: false },
      { name: "R Somkin", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2509.04810)",
    venueHref: "https://arxiv.org/abs/2509.04810"
  },
  {
    id: "pub-2025-resume-seniority",
    year: 2025,
    type: "Preprint",
    title: "Reading Between the Lines: Classifying Resume Seniority with Large Language Models",
    focus: "robust",
    summary: "This work classifies the seniority level implied by a resume using large language models, inferring experience from indirect cues rather than explicit statements. It targets reliable inference when the signal is diffuse and understated, reading between the lines of noisy, self-authored professional text.",
    authors: [
      { name: "M Cohen", self: false },
      { name: "S Shani", self: false },
      { name: "E Menahem", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2509.09229)",
    venueHref: "https://arxiv.org/abs/2509.09229"
  },
  {
    id: "pub-2025-health-crises-medication",
    year: 2025,
    type: "Preprint",
    title: "When Curiosity Signals Danger: Predicting Health Crises Through Online Medication Inquiries",
    focus: "robust",
    summary: "This work predicts impending health crises from patterns in online medication inquiries, treating everyday search behavior as an early-warning signal. It extracts a reliable risk indication from noisy, unstructured public queries, surfacing danger where the input never states it directly.",
    authors: [
      { name: "D Goncharok", self: false },
      { name: "A Shifman", self: false },
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2509.11802)",
    venueHref: "https://arxiv.org/abs/2509.11802"
  },
  {
    id: "pub-2025-fuzzy-speech-medical",
    year: 2025,
    type: "Preprint",
    title: "From Fuzzy Speech to Medical Insight: Benchmarking LLMs on Noisy Patient Narratives",
    focus: "robust",
    summary: "This benchmark evaluates large language models on noisy patient narratives, testing whether they extract accurate medical insight from vague, disfluent, and imprecise descriptions. It measures perception reliability when clinical language arrives fuzzy and unstructured, the ambiguous input real patients actually provide.",
    authors: [
      { name: "E Mama", self: false },
      { name: "L Sheri", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2509.11803)",
    venueHref: "https://arxiv.org/abs/2509.11803"
  },
  {
    id: "pub-2025-emotion-pop-lyrics",
    year: 2025,
    type: "Preprint",
    title: "From Joy to Fear: A Benchmark of Emotion Estimation in Pop Song Lyrics",
    focus: "robust",
    summary: "This benchmark measures how well models estimate the emotional content of pop song lyrics across a spectrum from joy to fear. It tests reliable affective inference over figurative, ambiguous, and stylized language, where meaning resists the literal reading that standard sentiment tools assume.",
    authors: [
      { name: "S Dahary", self: false },
      { name: "A Edana", self: false },
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2509.05617)",
    venueHref: "https://arxiv.org/abs/2509.05617"
  },
  {
    id: "pub-2025-llm-intent-service",
    year: 2025,
    type: "Preprint",
    title: "Do Large Language Models Need Intent? Revisiting Response Generation Strategies for Service Assistant",
    focus: "sparse",
    summary: "This work revisits whether service-assistant responses genuinely need an explicit intent-classification stage, comparing intent-conditioned generation against direct response strategies. It examines coordination between reasoning components under minimal structure, testing how much shared internal state a capable assistant actually requires.",
    authors: [
      { name: "I Bolshinsky", self: false },
      { name: "S Kupiec", self: false },
      { name: "A Sasson", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2509.05006)",
    venueHref: "https://arxiv.org/abs/2509.05006"
  },
  {
    id: "pub-2026-promptforge",
    year: 2026,
    type: "InPreparation",
    title: "SynSmith: Adversarial Multi-Critic Prompt Debugging for Synthetic Data Generation",
    focus: "spec",
    summary: "SynSmith debugs synthetic-data prompts through an adversarial panel of critics that iteratively expose and correct failures in generated examples. Generation is held to a hard specification, with multiple critics enforcing that each synthetic sample meets its stated quality and coverage requirements before release.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "Draft",
    venueHref: "https://apartsinprojects.github.io/SynSmith/"
  },
  {
    id: "pub-2026-coeval",
    year: 2026,
    type: "Submitted",
    title: "CoEval: Ranking Language Models for Custom Tasks Without Labeled Data or Trustworthy Benchmarks",
    focus: "sparse",
    summary: "CoEval ranks language models for a custom task without labeled data or a trusted benchmark, deriving a reliable ordering from the models' mutual agreement and cross-evaluation. It evaluates capability with no ground-truth supervision, extracting a trustworthy verdict from consensus rather than labels.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2606.03650)",
    venueHref: "https://arxiv.org/abs/2606.03650"
  },
  {
    id: "pub-2026-coreason",
    year: 2026,
    type: "Submitted",
    title: "Framing, Judging, Steering: An Assessable Competency Model for Teaching Students to Reason With Generative AI",
    focus: "sparse",
    summary: "This work defines an assessable competency model, framing, judging, and steering, for teaching students to reason effectively with generative AI. It formalizes how a person evaluates and directs a model's reasoning without full visibility into its internal state, coordinating with an opaque collaborator.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2606.05983)",
    venueHref: "https://arxiv.org/abs/2606.05983"
  },
  {
    id: "pub-inprep-absa-courses",
    year: 2026,
    type: "Submitted",
    title: "A Controlled Synthetic Benchmark for Educational Aspect-Based Sentiment Analysis",
    focus: "spec",
    summary: "This work builds a controlled synthetic benchmark for educational aspect-based sentiment analysis, generating course-feedback examples with known aspect and sentiment labels. Generation follows an explicit specification so each synthetic instance carries the precise, controllable annotations the benchmark requires, guaranteeing ground truth by construction.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2605.25502)",
    venueHref: "https://arxiv.org/abs/2605.25502"
  },
  {
    id: "pub-inprep-medfollow",
    year: 2026,
    type: "Submitted",
    title: "Reliable Extraction of Clinical Follow-Up Instructions: A Hybrid Neural-Symbolic Pipeline",
    focus: "spec",
    summary: "This hybrid neural-symbolic pipeline extracts clinical follow-up instructions reliably, pairing neural language understanding with symbolic rules that enforce structural validity. Extraction is bound to a specification: outputs must satisfy explicit correctness constraints, so the pipeline delivers instructions that meet their contract rather than plausible-looking guesses.",
    authors: [
      { name: "M Laufer", self: false },
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2605.26560)",
    venueHref: "https://arxiv.org/abs/2605.26560"
  },
  {
    id: "pub-inprep-emr-ach",
    year: 2026,
    type: "InPreparation",
    title: "Evidence Matrix Reasoning: Structured Hypothesis Selection via Analysis of Competing Hypotheses",
    focus: "sparse",
    summary: "Evidence Matrix Reasoning selects among competing hypotheses using a structured Analysis of Competing Hypotheses matrix that scores each hypothesis against each piece of evidence. It formalizes reasoning toward a defensible conclusion without a labeled answer key, ranking hypotheses from the evidence structure alone.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "B Remez", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "Draft",
    venueHref: "https://apartsinprojects.github.io/EMR-ACH/paper/index.html"
  },
  {
    id: "pub-inprep-zkdroneswarm",
    year: 2026,
    type: "Submitted",
    title: "Acting on the Unseen: Communication-Free Collaborative Filtering for Decentralized Multi-Robot Task Allocation",
    focus: "sparse",
    summary: "This work allocates tasks across decentralized multi-robot teams through communication-free collaborative filtering, letting each robot infer others' choices from observed behavior alone. Agents coordinate without any message passing or shared state, acting on the unseen to avoid conflicts and cover the task set.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Meshulam", self: false },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2605.25584)",
    venueHref: "https://arxiv.org/abs/2605.25584"
  },
  {
    id: "pub-inprep-dgld4energetic",
    year: 2026,
    type: "Submitted",
    title: "DGLD: Domain-Gated Latent Diffusion for the Discovery of Novel Energetic Materials",
    focus: "spec",
    summary: "DGLD applies domain-gated latent diffusion to generate candidate energetic materials, gating the latent space so samples stay within chemically valid, target-relevant regions. Generation is constrained to a hard specification, producing molecules that meet energetic-property targets rather than merely plausible chemical structures.",
    authors: [
      { name: "Y Aperstein", self: false },
      { name: "A Apartsin", self: true }
    ],
    venue: "arXiv preprint (arXiv:2605.26540)",
    venueHref: "https://arxiv.org/abs/2605.26540"
  },
  {
    id: "pub-inprep-imperfect-student",
    year: 2026,
    type: "Submitted",
    title: "Toward a Benchmark for Controllable Simulation of Imperfect Students with Large Language Models",
    focus: "spec",
    summary: "This work develops a benchmark for controllably simulating imperfect students with large language models, generating learner behavior at specified levels of misconception and skill. Generation obeys an explicit control specification, so each simulated student exhibits the precise, targeted deficiencies the scenario requires rather than generic errors.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "O Sason", self: false },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2605.25601)",
    venueHref: "https://arxiv.org/abs/2605.25601"
  },
  {
    id: "pub-2026-normal-latent-clustering",
    year: 2026,
    type: "Submitted",
    title: "Modeling Normal Is All You Need: Joint Latent Clustering for Anomaly Detection in Multimodal Cyber-Physical Systems",
    focus: "robust",
    summary: "This method detects anomalies in multimodal cyber-physical systems by jointly clustering the latent representations of normal operation, flagging deviations without needing labeled faults. It sustains reliable monitoring of noisy real-world sensor and control streams, identifying failures against a learned model of normality alone.",
    authors: [
      { name: "A Apartsin", self: true },
      { name: "Y Aperstein", self: false }
    ],
    venue: "arXiv preprint (arXiv:2607.06094)",
    venueHref: "https://arxiv.org/abs/2607.06094"
  }
];
