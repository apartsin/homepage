(function () {
  const projects = [
    {
      title: '1. Dynamic-Array Acoustic World Model for Wearable Drone Detection',
      image: '../assets/teaching/research-projects-open-for-students/img-002-522193c069.png',
      summary: 'Designs a lightweight wearable sensing pipeline for drone detection under movement, noise, and changing sensor geometry.',
      tags: 'Signals, Acoustics, World Models, Defense AI',
    },
    {
      title: '2. PIR: Prerequisite Information Retrieval',
      image: '../assets/teaching/research-projects-open-for-students/img-003-d228cc2f8e.png',
      summary: 'Automates prerequisite discovery in learning materials by linking each concept to the most relevant background resources.',
      tags: 'LLM, Education, Information Retrieval',
    },
    {
      title: '3. Execution-First AI: Building Self-Validating Code Generators',
      image: '../assets/teaching/research-projects-open-for-students/img-005-0ce03cffb0.jpg',
      summary: 'Explores statement-level code generation with runtime validation loops to reduce silent semantic errors.',
      tags: 'LLM, Code Generation, Agents',
    },
    {
      title: '4. AI-Powered Behavioral Analytics for Online Learning Using Computer Vision Models',
      image: '../assets/teaching/research-projects-open-for-students/img-006-87b85ee70f.png',
      summary: 'Transforms classroom video into structured behavioral signals such as gaze, attention, and interaction patterns.',
      tags: 'Computer Vision, Education, Gaze, Multimodal Analysis',
    },
    {
      title: '5. Robust Information Extraction from Noisy Critical Voice Communications',
      image: '../assets/teaching/research-projects-open-for-students/img-010-a5426103c2.png',
      summary: 'Extracts structured incident fields from noisy ASR radio transcripts used in mission-critical operational protocols.',
      tags: 'LLM, NLP, Voice, Mission Critical',
    },
    {
      title: '6. Synthetic Narratives: Aspect-Based Sentiment Models for User Medication Reviews',
      image: '../assets/teaching/research-projects-open-for-students/img-011-82325fc575.png',
      summary: 'Builds synthetic review pipelines for aspect-based sentiment analysis in medication narratives with limited labeled data.',
      tags: 'LLM, NLP, Healthcare, Sentiment Analysis',
    },
    {
      title: '7. Generative AI for Infrared Counter-Drone Detection',
      image: '../assets/teaching/research-projects-open-for-students/img-013-infrared-counter-drone.png',
      summary: 'Explores generative models that synthesize realistic infrared drone imagery from optical sources, addressing the scarcity of real thermal datasets, and evaluates whether the synthetic data improves the accuracy and robustness of counter-drone detection and tracking.',
      tags: 'Generative AI, Computer Vision, Infrared Imaging, Defense AI',
    },
    {
      title: '8. Generative AI for Discovery of Novel Battery Electrolytes',
      image: '../assets/teaching/research-projects-open-for-students/img-014-battery-electrolyte-discovery.png',
      summary: 'Uses diffusion-based generative models to propose novel electrolyte molecules optimized for ionic conductivity, electrochemical stability, and safety, then screens candidates with ML property predictors and physics-based validation to identify promising materials for rechargeable batteries.',
      tags: 'Generative AI, Diffusion Models, Molecular Design, Materials, Energy',
    },
    {
      title: '9. CareerLens: Evidence-Based Professional Profile Inference',
      image: '../assets/teaching/research-projects-open-for-students/img-015-careerlens.png',
      summary: 'Jointly infers implicit competencies, proficiency levels, and seniority from career evidence (job history, responsibilities, projects, skills), grounding each inference in supporting text and structured taxonomies (JobHop, ESCO, O*NET, CMap); evaluates robustness to resume wording and predictive value for career progression against direct LLM assessment.',
      tags: 'LLM, NLP, HR Tech, Taxonomies, Structured Inference',
    },
  ];

  function createCard(project) {
    const article = document.createElement('article');
    article.className = 'grad-opps-card';

    const media = document.createElement('div');
    media.className = 'grad-opps-card__media';

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.title;
    media.appendChild(image);
    article.appendChild(media);

    const body = document.createElement('div');
    body.className = 'grad-opps-card__body';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'grad-opps-card__eyebrow';
    eyebrow.textContent = 'M.Sc. Student Research Project';
    body.appendChild(eyebrow);

    const title = document.createElement('h2');
    title.className = 'grad-opps-card__title';
    title.textContent = project.title;
    body.appendChild(title);

    const summary = document.createElement('p');
    summary.className = 'grad-opps-card__summary';
    summary.textContent = project.summary;
    body.appendChild(summary);

    const tags = document.createElement('p');
    tags.className = 'grad-opps-card__tags';
    tags.innerHTML = '<span class="grad-opps-card__tags-label">Keywords:</span> '
      + project.tags;
    body.appendChild(tags);

    article.appendChild(body);
    return article;
  }

  function renderGradOpportunities() {
    const grids = document.querySelectorAll('[data-grad-opportunities-grid]');
    if (!grids.length) {
      return;
    }

    grids.forEach((grid) => {
      grid.innerHTML = '';
      projects.forEach((project) => {
        grid.appendChild(createCard(project));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGradOpportunities, { once: true });
  } else {
    renderGradOpportunities();
  }
})();
