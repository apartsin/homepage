from pathlib import Path
import re

base = Path('E:/Projects/HP3/onesite/courses/hos/series')
courses = ['language-ai', 'vision-ai', 'scalable-ai', 'temporal-ai']

# Pattern: linked title <h2><a href="...innovation-first-learning.html" style="...">TITLE</a></h2>
title_pattern = re.compile(
    r'<h2><a href="\.\./\.\./\.\./work/innovation-first-learning\.html" style="color: inherit; text-decoration: none; border-bottom: 1px dashed currentColor;">([^<]+)</a></h2>'
)

# A footer link to drop in after the card body, before </article>.
footer_link = (
    '            <p class="syllabus-card__footer" style="margin: 8px 0 0; text-align: right;">'
    '<a href="../../../work/innovation-first-learning.html" style="color: var(--site-accent, #9c5a2e); font: 700 0.78rem/1.2 \'Manrope\', sans-serif; text-decoration: none; border-bottom: 1px dashed currentColor;">Innovation-First Learning &rarr;</a>'
    '</p>\n'
)

for name in courses:
    p = base / f'{name}.html'
    s = p.read_text(encoding='utf-8')

    # Find each linked-title card and: (a) plain-text the title, (b) inject footer link before </article>.
    titles_found = []

    def replace_title(m):
        titles_found.append(m.group(1))
        return f'<h2>{m.group(1)}</h2>'

    new_s = title_pattern.sub(replace_title, s)

    if not titles_found:
        print(f'No linked titles found in {name}')
        continue

    # For each title we just defaced, find its enclosing article and append the footer link
    # right before its </article>. We do this card-by-card to avoid touching unrelated cards.
    for title in titles_found:
        marker = f'<h2>{title}</h2>'
        idx = new_s.find(marker)
        while idx != -1:
            close_idx = new_s.find('</article>', idx)
            if close_idx == -1:
                break
            # Skip if footer link is already there for this card.
            if 'syllabus-card__footer' in new_s[idx:close_idx]:
                idx = new_s.find(marker, close_idx)
                continue
            # Insert the footer link right before the article close (with proper indentation).
            new_s = new_s[:close_idx] + footer_link + '          ' + new_s[close_idx:]
            break

    p.write_text(new_s, encoding='utf-8', newline='')
    print(f'updated {name}: defaced {len(titles_found)} title link(s) and added footer link(s)')
