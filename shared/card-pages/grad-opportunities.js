(function () {
  const projects = [
    {
      title: '1. Learning the Schema: Experience-Driven Text-to-SQL with Execution Feedback',
      image: '../shared-media/www-apartsin-com/assets/research-projects-open-for-students/img-001-d57b13d349-e3b313ed28.png',
      summary: 'Builds a text-to-SQL system that learns schema-specific patterns from execution feedback and reuses that experience in future queries.',
      tags: 'LLM, Text2SQL, Agents',
    },
    {
      title: '2. Dynamic-Array Acoustic World Model for Wearable Drone Detection',
      image: '../assets/teaching/research-projects-open-for-students/img-002-522193c069.png',
      summary: 'Designs a lightweight wearable sensing pipeline for drone detection under movement, noise, and changing sensor geometry.',
      tags: 'Signals, Acoustics, World Models, Defense AI',
    },
    {
      title: '3. PIR: Prerequisite Information Retrieval',
      image: '../assets/teaching/research-projects-open-for-students/img-003-d228cc2f8e.png',
      summary: 'Automates prerequisite discovery in learning materials by linking each concept to the most relevant background resources.',
      tags: 'LLM, Education, Information Retrieval',
    },
    {
      title: '4. Generative Latent Framework for Cyber-Physical Anomaly Detection',
      image: '../assets/teaching/research-projects-open-for-students/img-004-3ea095c411.png',
      summary: 'Uses latent-space generative modeling to stress-test anomaly detectors across operating regimes in cyber-physical systems.',
      tags: 'Anomaly Detection, Time Series, VAE, Predictive Maintenance',
    },
    {
      title: '5. Execution-First AI: Building Self-Validating Code Generators',
      image: '../assets/teaching/research-projects-open-for-students/img-005-0ce03cffb0.jpg',
      summary: 'Explores statement-level code generation with runtime validation loops to reduce silent semantic errors.',
      tags: 'LLM, Code Generation, Agents',
    },
    {
      title: '6. AI-Powered Behavioral Analytics for Online Learning Using Computer Vision Models',
      image: '../assets/teaching/research-projects-open-for-students/img-006-87b85ee70f.png',
      summary: 'Transforms classroom video into structured behavioral signals such as gaze, attention, and interaction patterns.',
      tags: 'Computer Vision, Education, Gaze, Multimodal Analysis',
    },
    {
      title: '7. Query-Conditioned Person Search in Crowded Scenes via Synthetic Identity Injection',
      image: '../assets/teaching/research-projects-open-for-students/img-007-5c1be209f7.png',
      summary: 'Generates synthetic identity-injected crowd data to improve query-based person search in occluded real-world scenes.',
      tags: 'Computer Vision, Object Detection, Multimedia Search, Defense AI',
    },
    {
      title: '8. Parkinsonian Movement Severity Scoring Under Real-World Home-Camera Conditions',
      image: '../assets/teaching/research-projects-open-for-students/img-008-1a097f6987.png',
      summary: 'Develops robust Parkinsonian severity estimation from realistic home videos with occlusion, blur, and viewpoint variation.',
      tags: 'Healthcare, Computer Vision, Video Analysis, Generative AI',
    },
    {
      title: '9. Seeing Growth at Home: Synthetic Video Learning for Child Motor Development Assessment',
      image: '../assets/teaching/research-projects-open-for-students/img-009-d3ffc1422e.png',
      summary: 'Studies child motor milestone assessment from privacy-preserving synthetic home videos generated from motion trajectories.',
      tags: 'Healthcare, Computer Vision, Video Analysis, Generative AI',
    },
    {
      title: '10. Robust Information Extraction from Noisy Critical Voice Communications',
      image: '../assets/teaching/research-projects-open-for-students/img-010-a5426103c2.png',
      summary: 'Extracts structured incident fields from noisy ASR radio transcripts used in mission-critical operational protocols.',
      tags: 'LLM, NLP, Voice, Mission Critical',
    },
    {
      title: '11. Synthetic Narratives: Aspect-Based Sentiment Models for User Medication Reviews',
      image: '../assets/teaching/research-projects-open-for-students/img-011-82325fc575.png',
      summary: 'Builds synthetic review pipelines for aspect-based sentiment analysis in medication narratives with limited labeled data.',
      tags: 'LLM, NLP, Healthcare, Sentiment Analysis',
    },
    {
      title: '12. LLM That Learns Clinical Experience',
      image: '../assets/teaching/research-projects-open-for-students/img-012-2cc36273a2.png',
      summary: 'Constructs an incremental clinical reasoning system that turns observed patterns into executable and auditable rules.',
      tags: 'LLM, Healthcare, Chain of Code, RAG',
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
