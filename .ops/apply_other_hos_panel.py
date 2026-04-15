from pathlib import Path
import re

courses = {
    'language-ai.html': './language-ai.html',
    'vision-ai.html': './vision-ai.html',
    'scalable-ai.html': './scalable-ai.html',
    'temporal-ai.html': './temporal-ai.html',
}

base = Path('E:/Projects/HP3/onesite/courses/hos/series')

for filename, current_href in courses.items():
    p = base / filename
    s = p.read_text(encoding='utf-8')

    # 1. Rename heading.
    old_heading = '<h2 class="section-quick-links__title" style="margin: 0 0 10px;">More HoS AI Courses</h2>'
    new_heading = '<h2 class="section-quick-links__title" style="margin: 0 0 10px;">Other HoS AI Courses</h2>'
    assert old_heading in s, f'heading not found in {filename}'
    s = s.replace(old_heading, new_heading)

    # Also update the aria-label on the section.
    s = s.replace(
        '<section class="more-hos-courses" aria-label="More Hands-On AI Science courses"',
        '<section class="more-hos-courses" aria-label="Other Hands-On AI Science courses"',
    )

    # 2. Remove the current-course card from the panel. Match the whole <a> ... </a>
    # block whose href matches current_href. It spans: the opening anchor tag line
    # through the closing </a>.
    pattern = re.compile(
        r'            <a href="' + re.escape(current_href) + r'"[^>]*>\n'
        r'(?:.*?\n){0,10}?'
        r'            </a>\n',
    )
    m = pattern.search(s)
    assert m, f'current-course card not found in {filename} for href {current_href}'
    s = s[:m.start()] + s[m.end():]

    p.write_text(s, encoding='utf-8', newline='')
    print(f'updated {p}')
