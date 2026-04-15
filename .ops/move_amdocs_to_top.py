from pathlib import Path
import re

p = Path('E:/Projects/HP3/onesite/about/industry-experience.html')
s = p.read_text(encoding='utf-8')

# 1. Extract the Amdocs card block (2011-2012). Match the article block with id="industry-2011-2012".
amdocs_pattern = re.compile(
    r'(          <article class="industry-card" id="industry-2011-2012">.*?</article>\n)',
    re.DOTALL,
)
m = amdocs_pattern.search(s)
assert m, 'Amdocs card not found'
amdocs_block = m.group(1)
# Remove the Amdocs card from the middle segment.
s = s[:m.start()] + s[m.end():]

# 2. Insert the Amdocs card into the top segment, immediately after the Citi card (2013-2015).
citi_end_marker = '          <article class="industry-card" id="industry-2013-2015">'
assert citi_end_marker in s
# The Citi article ends with "</article>\n"; locate the full article block to insert after.
citi_pattern = re.compile(
    r'(          <article class="industry-card" id="industry-2013-2015">.*?</article>\n)',
    re.DOTALL,
)
m2 = citi_pattern.search(s)
assert m2, 'Citi card not found'
insert_at = m2.end()
s = s[:insert_at] + amdocs_block + s[insert_at:]

# 3. Update the heading year ranges.
# Top: 2013 - Present -> 2011 - Present
s = s.replace(
    'Data Science and AI Leadership <small>2013 - Present</small>',
    'Data Science and AI Leadership <small>2011 - Present</small>',
)
# Middle: 1999 - 2012 -> 1999 - 2011
s = s.replace(
    'Applied Research &amp; Entrepreneurship <small>1999 - 2012</small>',
    'Applied Research &amp; Entrepreneurship <small>1999 - 2011</small>',
)

p.write_text(s, encoding='utf-8', newline='')
print('Updated', p)
