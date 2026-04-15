from pathlib import Path

# Map each syllabus page to its student-projects filter slug and the noun phrase
# at the end of the Innovation Through Tools Mastery prose.
courses = {
    'language-ai': ('language models',                 'language-ai'),
    'vision-ai':   ('vision models',                   'vision-ai'),
    'scalable-ai': ('scalable AI systems',             'scalable-ai'),
    'temporal-ai': ('temporal and sequential models',  'temporal-ai'),
}

base = Path('E:/Projects/HP3/onesite/courses/hos/series')

IFL_LINK_STYLE = 'color: inherit; text-decoration: none; border-bottom: 1px dashed currentColor;'

def two_cards(model_phrase, type_slug):
    return (
        '          <article class="syllabus-card">\n'
        f'            <h2><a href="../../../work/innovation-first-learning.html" style="{IFL_LINK_STYLE}">Innovation Through Tools Mastery</a></h2>\n'
        f'            <p>As standard tasks are increasingly handled by AI and existing mature libraries, expectations of professional developers shift toward innovation and rapid integration. Accordingly, a key requirement for <a href="../../../teaching/hands-on-ai-science-courses-student-projects.html?type={type_slug}">student course projects</a> is to tackle new use cases by generating unique data and training or fine-tuning task-specific {model_phrase}.</p>\n'
        '          </article>\n'
        '          <article class="syllabus-card">\n'
        f'            <h2><a href="../../../work/innovation-first-learning.html" style="{IFL_LINK_STYLE}">Guided Student Projects</a></h2>\n'
        f'            <p>The course syllabus is designed to enable students to begin <a href="../../../teaching/hands-on-ai-science-courses-student-projects.html?type={type_slug}">their projects</a> while learning the material. As the course continues, they will enrich their projects with the concepts they acquire. Each team will give several in-class presentations for discussion and feedback.</p>\n'
        '          </article>\n'
    )

for filename, (model_phrase, type_slug) in courses.items():
    p = base / f'{filename}.html'
    s = p.read_text(encoding='utf-8')
    new_block = two_cards(model_phrase, type_slug)

    if filename == 'language-ai':
        # The two cards already exist (without IFL link on titles). Replace them in place.
        existing = (
            '          <article class="syllabus-card">\n'
            '            <h2>Innovation Through Tools Mastery</h2>\n'
            f'            <p>As standard tasks are increasingly handled by AI and existing mature libraries, expectations of professional developers shift toward innovation and rapid integration. Accordingly, a key requirement for <a href="../../../teaching/hands-on-ai-science-courses-student-projects.html?type={type_slug}">student course projects</a> is to tackle new use cases by generating unique data and training or fine-tuning task-specific {model_phrase}.</p>\n'
            '          </article>\n'
            '          <article class="syllabus-card">\n'
            '            <h2>Guided Student Projects</h2>\n'
            f'            <p>The course syllabus is designed to enable students to begin <a href="../../../teaching/hands-on-ai-science-courses-student-projects.html?type={type_slug}">their projects</a> while learning the material. As the course continues, they will enrich their projects with the concepts they acquire. Each team will give several in-class presentations for discussion and feedback.</p>\n'
            '          </article>\n'
        )
        if existing in s:
            s = s.replace(existing, new_block)
            p.write_text(s, encoding='utf-8', newline='')
            print(f'updated {filename} (added IFL links to the two cards)')
        else:
            print(f'WARN: existing two-card pattern not found in {filename}; nothing changed')
        continue

    # vision-ai had a working-projects link; scalable/temporal did not.
    if filename == 'vision-ai':
        old_ifl = (
            '          <article class="syllabus-card">\n'
            '            <h2><a href="../../../work/innovation-first-learning.html" style="color: inherit; text-decoration: none; border-bottom: 1px dashed currentColor;">Innovation-First Learning</a></h2>\n'
            '            <p>Code-first methodology with state-of-the-art tools: students build <a href="../../../teaching/hands-on-ai-science-courses-student-projects.html?type=vision-ai">working projects</a> from week one, guided by iterative feedback and learning by doing.</p>\n'
            '          </article>\n'
        )
    else:
        old_ifl = (
            '          <article class="syllabus-card">\n'
            '            <h2><a href="../../../work/innovation-first-learning.html" style="color: inherit; text-decoration: none; border-bottom: 1px dashed currentColor;">Innovation-First Learning</a></h2>\n'
            '            <p>Code-first methodology with state-of-the-art tools: students build working projects from week one, guided by iterative feedback and learning by doing.</p>\n'
            '          </article>\n'
        )

    if old_ifl not in s:
        print(f'WARN: IFL card pattern not found in {filename}; nothing changed')
        continue

    s = s.replace(old_ifl, new_block)
    p.write_text(s, encoding='utf-8', newline='')
    print(f'updated {filename} (dropped IFL, added two cards with IFL links)')
