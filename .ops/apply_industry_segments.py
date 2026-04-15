from pathlib import Path
import re

p = Path('E:/Projects/HP3/onesite/about/industry-experience.html')
s = p.read_text(encoding='utf-8')

# 1. Remove the industry-filter section.
OLD_FILTER = '''        <section class="industry-filter" aria-label="Industry card filters">
          <select class="industry-filter__select" id="industry-filter-data" aria-label="Filter by data type">
            <option value="all">All Data Types</option>
          </select>
          <select class="industry-filter__select" id="industry-filter-industry" aria-label="Filter by industry">
            <option value="all">All Industries</option>
          </select>
          <p class="industry-filter__count" id="industry-filter-count"></p>
          <p class="industry-filter__empty" id="industry-filter-empty" hidden>No cards match this filter.</p>
        </section>

'''
assert OLD_FILTER in s, 'filter section not found'
s = s.replace(OLD_FILTER, '')

# 2. Remove the filter JS block. It is wrapped in <script>...</script> immediately after </div></div>.
script_pattern = re.compile(
    r'  <script>\s*\n\s*\(function \(\) \{\s*\n\s*var cards = Array\.from\(document\.querySelectorAll\("\#industry-timeline \.industry-card"\)\);.*?\}\)\(\);\s*\n\s*</script>\s*\n',
    re.DOTALL
)
s, n = script_pattern.subn('', s)
assert n == 1, f'expected 1 JS block removed, got {n}'

# 3. Inject segment heading CSS inside the existing <style>.
CSS_INSERT_BEFORE = '    .industry-card[hidden] { display: none !important; }'
assert CSS_INSERT_BEFORE in s
CSS_ADDITION = '''    .industry-segment {
      margin-top: 28px;
    }
    .industry-segment:first-of-type {
      margin-top: 8px;
    }
    .industry-segment__heading {
      margin: 0 0 12px;
      padding: 0 0 6px;
      border-bottom: 2px solid var(--site-accent, #9c5a2e);
      color: var(--site-text, #18202a);
      font: 800 1.05rem/1.2 "Manrope", "Segoe UI", sans-serif;
      letter-spacing: -0.01em;
    }
    .industry-segment__heading small {
      display: inline-block;
      margin-left: 8px;
      color: var(--site-muted, #586271);
      font: 600 0.82rem/1.2 "Manrope", "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
'''
s = s.replace(CSS_INSERT_BEFORE, CSS_ADDITION + CSS_INSERT_BEFORE)

# 4. Split the single industry-grid into three segments with headings.
# Replace the opening tag with the first segment wrapper.
OLD_GRID_OPEN = '        <section class="industry-grid" id="industry-timeline">\n'
assert OLD_GRID_OPEN in s
NEW_TOP_OPEN = (
    '        <div class="industry-segment">\n'
    '          <h2 class="industry-segment__heading">AI Executive Leadership <small>2013 - Present</small></h2>\n'
    '          <section class="industry-grid" id="industry-timeline-top">\n'
)
s = s.replace(OLD_GRID_OPEN, NEW_TOP_OPEN)

# Before the Amdocs card (2011-2012), close the top grid and open the middle grid.
AMDOCS_ANCHOR = '          <article class="industry-card" id="industry-2011-2012">'
assert AMDOCS_ANCHOR in s
MIDDLE_BREAK = (
    '          </section>\n'
    '        </div>\n'
    '        <div class="industry-segment">\n'
    '          <h2 class="industry-segment__heading">Applied Research, Architecture &amp; Entrepreneurship <small>1999 - 2012</small></h2>\n'
    '          <section class="industry-grid" id="industry-timeline-middle">\n'
    + AMDOCS_ANCHOR
)
s = s.replace(AMDOCS_ANCHOR, MIDDLE_BREAK)

# Before the Moldat card (1997-1999), close the middle grid and open the bottom grid.
MOLDAT_ANCHOR = '          <article class="industry-card" id="industry-1997-1999">'
assert MOLDAT_ANCHOR in s
BOTTOM_BREAK = (
    '          </section>\n'
    '        </div>\n'
    '        <div class="industry-segment">\n'
    '          <h2 class="industry-segment__heading">Algorithm &amp; Software Engineering <small>1991 - 1999</small></h2>\n'
    '          <section class="industry-grid" id="industry-timeline-bottom">\n'
    + MOLDAT_ANCHOR
)
s = s.replace(MOLDAT_ANCHOR, BOTTOM_BREAK)

# Close the bottom grid: the single remaining </section> after Solid State card is the last industry-grid's closer.
# That close tag already exists; we just need to add the segment wrapper close before the quick-links section.
OLD_GRID_CLOSE = '          </article>\n        </section>\n\n      <section class="section-quick-links">'
assert OLD_GRID_CLOSE in s
NEW_GRID_CLOSE = '          </article>\n          </section>\n        </div>\n\n      <section class="section-quick-links">'
s = s.replace(OLD_GRID_CLOSE, NEW_GRID_CLOSE)

p.write_text(s, encoding='utf-8', newline='')
print('Updated', p)
