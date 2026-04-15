import sys
from pathlib import Path

OLD = '''        <section class="more-hos-courses" aria-label="More Hands-On AI Science courses" style="margin-top: 24px;">
          <h2 class="section-quick-links__title" style="margin: 0 0 12px; padding-left: 10px;">More HoS AI Courses</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
            <a href="./language-ai.html" style="display: flex; flex-direction: column; border: 1px solid var(--site-border); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.94); text-decoration: none; color: inherit; transition: transform 180ms ease, box-shadow 180ms ease;">
              <figure style="margin: 0; aspect-ratio: 16 / 9; overflow: hidden; background: #f5f5f5;">
                <img src="../../../assets/courses/hos-series/llm-course/img-006-language-ai-gemini.png" alt="Building Language AI" style="display: block; width: 100%; height: 100%; object-fit: cover;">
              </figure>
              <div style="padding: 8px 10px 10px;">
                <p style="margin: 0; font: 800 0.78rem/1.3 'Manrope', sans-serif; color: var(--site-text, #1a1a1a);">Language AI</p>
                <p style="margin: 3px 0 0; font: 600 0.68rem/1.35 'Manrope', sans-serif; color: var(--site-muted, #64605a);">LLMs and Agents</p>
              </div>
            </a>
            <a href="./vision-ai.html" style="display: flex; flex-direction: column; border: 1px solid var(--site-border); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.94); text-decoration: none; color: inherit; transition: transform 180ms ease, box-shadow 180ms ease;">
              <figure style="margin: 0; aspect-ratio: 16 / 9; overflow: hidden; background: #f5f5f5;">
                <img src="../../../assets/courses/hos-series/embvision-course/img-008-vision-ai-gemini.png" alt="Building Vision AI" style="display: block; width: 100%; height: 100%; object-fit: cover;">
              </figure>
              <div style="padding: 8px 10px 10px;">
                <p style="margin: 0; font: 800 0.78rem/1.3 'Manrope', sans-serif; color: var(--site-text, #1a1a1a);">Vision AI</p>
                <p style="margin: 3px 0 0; font: 600 0.68rem/1.35 'Manrope', sans-serif; color: var(--site-muted, #64605a);">Foundation and Generative Models</p>
              </div>
            </a>
            <a href="./scalable-ai.html" style="display: flex; flex-direction: column; border: 1px solid var(--site-border); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.94); text-decoration: none; color: inherit; transition: transform 180ms ease, box-shadow 180ms ease;">
              <figure style="margin: 0; aspect-ratio: 16 / 9; overflow: hidden; background: #f5f5f5;">
                <img src="../../../assets/courses/hos-series/bigdata-course/img-012-scalable-ai-gemini.png" alt="Building Scalable AI" style="display: block; width: 100%; height: 100%; object-fit: cover;">
              </figure>
              <div style="padding: 8px 10px 10px;">
                <p style="margin: 0; font: 800 0.78rem/1.3 'Manrope', sans-serif; color: var(--site-text, #1a1a1a);">Scalable AI</p>
                <p style="margin: 3px 0 0; font: 600 0.68rem/1.35 'Manrope', sans-serif; color: var(--site-muted, #64605a);">Big Data and Distributed Intelligence</p>
              </div>
            </a>
            <a href="./temporal-ai.html" style="display: flex; flex-direction: column; border: 1px solid var(--site-border); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.94); text-decoration: none; color: inherit; transition: transform 180ms ease, box-shadow 180ms ease;">
              <figure style="margin: 0; aspect-ratio: 16 / 9; overflow: hidden; background: #f5f5f5;">
                <img src="../../../assets/courses/hos-series/temporalai-course/img-008-temporal-ai-gemini.png" alt="Building Temporal AI" style="display: block; width: 100%; height: 100%; object-fit: cover;">
              </figure>
              <div style="padding: 8px 10px 10px;">
                <p style="margin: 0; font: 800 0.78rem/1.3 'Manrope', sans-serif; color: var(--site-text, #1a1a1a);">Temporal AI</p>
                <p style="margin: 3px 0 0; font: 600 0.68rem/1.35 'Manrope', sans-serif; color: var(--site-muted, #64605a);">Sequential Intelligence and RL</p>
              </div>
            </a>
          </div>
        </section>'''

CARD_STYLE = "display: flex; align-items: center; gap: 10px; padding: 7px 10px; border: 1px solid var(--site-border); border-radius: 12px; background: rgba(255,255,255,0.96); text-decoration: none; color: inherit; transition: transform 180ms ease, box-shadow 180ms ease;"
FIG_STYLE = "margin: 0; flex: 0 0 52px; width: 52px; height: 52px; border-radius: 8px; overflow: hidden; background: #f5f5f5;"
IMG_STYLE = "display: block; width: 100%; height: 100%; object-fit: cover;"
BODY_STYLE = "min-width: 0; display: flex; flex-direction: column; gap: 1px;"
TITLE_STYLE = "margin: 0; font: 800 0.82rem/1.25 'Manrope', sans-serif; color: var(--site-text, #1a1a1a); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
SUB_STYLE = "margin: 0; font: 600 0.7rem/1.3 'Manrope', sans-serif; color: var(--site-muted, #64605a); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"

courses = [
    ("./language-ai.html", "../../../assets/courses/hos-series/llm-course/img-006-language-ai-gemini.png", "Building Language AI", "Language AI", "LLMs and Agents"),
    ("./vision-ai.html", "../../../assets/courses/hos-series/embvision-course/img-008-vision-ai-gemini.png", "Building Vision AI", "Vision AI", "Foundation and Generative Models"),
    ("./scalable-ai.html", "../../../assets/courses/hos-series/bigdata-course/img-012-scalable-ai-gemini.png", "Building Scalable AI", "Scalable AI", "Big Data and Distributed Intelligence"),
    ("./temporal-ai.html", "../../../assets/courses/hos-series/temporalai-course/img-008-temporal-ai-gemini.png", "Building Temporal AI", "Temporal AI", "Sequential Intelligence and RL"),
]

card_lines = []
for href, img, alt, title, sub in courses:
    card_lines.append(f'            <a href="{href}" style="{CARD_STYLE}">')
    card_lines.append(f'              <figure style="{FIG_STYLE}">')
    card_lines.append(f'                <img src="{img}" alt="{alt}" style="{IMG_STYLE}">')
    card_lines.append(f'              </figure>')
    card_lines.append(f'              <div style="{BODY_STYLE}">')
    card_lines.append(f'                <p style="{TITLE_STYLE}">{title}</p>')
    card_lines.append(f'                <p style="{SUB_STYLE}">{sub}</p>')
    card_lines.append(f'              </div>')
    card_lines.append(f'            </a>')

NEW = (
    '        <section class="more-hos-courses" aria-label="More Hands-On AI Science courses" style="margin-top: 24px; padding: 14px 16px 16px; border: 1px solid var(--site-border); border-radius: 18px; background: rgba(255,255,255,0.88);">\n'
    '          <h2 class="section-quick-links__title" style="margin: 0 0 10px;">More HoS AI Courses</h2>\n'
    '          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px;">\n'
    + "\n".join(card_lines) + "\n"
    '          </div>\n'
    '        </section>'
)

paths = [
    Path('E:/Projects/HP3/onesite/courses/hos/series/language-ai.html'),
    Path('E:/Projects/HP3/onesite/courses/hos/series/vision-ai.html'),
    Path('E:/Projects/HP3/onesite/courses/hos/series/scalable-ai.html'),
    Path('E:/Projects/HP3/onesite/courses/hos/series/temporal-ai.html'),
]

for p in paths:
    s = p.read_text(encoding='utf-8')
    if OLD not in s:
        print(f"SKIP (old block not found): {p}")
        continue
    p.write_text(s.replace(OLD, NEW), encoding='utf-8', newline='')
    print(f"Updated {p}")
