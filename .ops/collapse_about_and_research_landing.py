from pathlib import Path
import re

ROOT = Path('E:/Projects/HP3/onesite')

# -------- Step 1: Update site-shell.js ----------
shell_js = ROOT / 'shared' / 'site-shell.js'
s = shell_js.read_text(encoding='utf-8')

# Subtitle: Scientist points to research-focus now.
s = s.replace(
    "{ label: 'Scientist', path: 'research/interests.html' },",
    "{ label: 'Scientist', path: 'research/research-focus.html' },",
)

# About primary nav: point to home (index.html) and drop the academic-profile regex matcher.
s = s.replace(
    """      link(
        'About',
        'about/academic-profile.html',
        [
          /\\/about\\/academic-profile\\.html$/i,
          /\\/about\\/education\\.html$/i,
          /\\/about\\/industry-experience\\.html$/i,
          /\\/about\\/phd-thesis\\.html$/i,
        ],""",
    """      link(
        'About',
        'index.html',
        [
          /\\/about\\/education\\.html$/i,
          /\\/about\\/industry-experience\\.html$/i,
          /\\/about\\/phd-thesis\\.html$/i,
        ],""",
)

# Research primary nav: point to research-focus and drop Research Focus secondary entry.
s = s.replace(
    """      link(
        'Research',
        'research/interests.html',
        [
          /\\/research\\/interests\\.html$/i,
          /\\/research\\/research-focus\\.html$/i,
          /\\/research\\/recent-publications\\.html$/i,
          /\\/research\\/research-projects\\.html$/i,
          /\\/research\\/grad-opportunities\\.html$/i,
          /\\/about\\/phd-thesis\\.html$/i,
          /\\/teaching\\/former-students\\.html$/i,
          /\\/teaching\\/current-students\\.html$/i,
        ],
        [
          { label: 'Research Focus', path: 'research/research-focus.html' },
          { label: 'Recent Publications', path: 'research/recent-publications.html' },
          { label: 'Current Research Projects', path: 'research/research-projects.html' },
          { label: 'Research Projects for M.Sc. Students', path: 'research/grad-opportunities.html' },
          { label: 'Former Students', path: 'teaching/former-students.html' },
          { label: 'Current Students', path: 'teaching/current-students.html' },
        ],
      ),""",
    """      link(
        'Research',
        'research/research-focus.html',
        [
          /\\/research\\/research-focus\\.html$/i,
          /\\/research\\/recent-publications\\.html$/i,
          /\\/research\\/research-projects\\.html$/i,
          /\\/research\\/grad-opportunities\\.html$/i,
          /\\/about\\/phd-thesis\\.html$/i,
          /\\/teaching\\/former-students\\.html$/i,
          /\\/teaching\\/current-students\\.html$/i,
        ],
        [
          { label: 'Recent Publications', path: 'research/recent-publications.html' },
          { label: 'Current Research Projects', path: 'research/research-projects.html' },
          { label: 'Research Projects for M.Sc. Students', path: 'research/grad-opportunities.html' },
          { label: 'Former Students', path: 'teaching/former-students.html' },
          { label: 'Current Students', path: 'teaching/current-students.html' },
        ],
      ),""",
)

shell_js.write_text(s, encoding='utf-8', newline='')
print('site-shell.js updated')

# -------- Step 2: unified-enhance.js ----------
enh_js = ROOT / 'shared' / 'unified-enhance.js'
t = enh_js.read_text(encoding='utf-8')
t = t.replace('/onesite/about/academic-profile.html', '/onesite/index.html')
t = t.replace('/onesite/research/interests.html', '/onesite/research/research-focus.html')
enh_js.write_text(t, encoding='utf-8', newline='')
print('unified-enhance.js updated')

# -------- Step 3: Update HTML references across the site ----------
html_files = list(ROOT.rglob('*.html'))

for p in html_files:
    text = p.read_text(encoding='utf-8')
    original = text

    # Replace relative paths to academic-profile.html with the matching relative path to index.html.
    # Patterns observed:
    #   ./about/academic-profile.html
    #   ../about/academic-profile.html
    #   ../../../about/academic-profile.html
    #   ./academic-profile.html (breadcrumb-style sibling reference)
    text = text.replace('./about/academic-profile.html', './index.html')
    text = text.replace('../about/academic-profile.html', '../index.html')
    text = text.replace('../../../about/academic-profile.html', '../../../index.html')
    text = text.replace('./academic-profile.html', '../index.html')  # breadcrumb sibling -> home

    # Replace research/interests.html references with research-focus.html.
    text = text.replace('./research/interests.html', './research/research-focus.html')
    text = text.replace('../research/interests.html', '../research/research-focus.html')
    text = text.replace('../../../research/interests.html', '../../../research/research-focus.html')
    text = text.replace('./interests.html', './research-focus.html')  # breadcrumb sibling

    if text != original:
        p.write_text(text, encoding='utf-8', newline='')

print('HTML cross-references updated')

# -------- Step 4: Remove the About breadcrumb step on about/*.html pages ----------
about_pages = [ROOT / 'about' / 'education.html', ROOT / 'about' / 'industry-experience.html', ROOT / 'about' / 'phd-thesis.html']

for p in about_pages:
    text = p.read_text(encoding='utf-8')
    # Pattern: Home / About / <Current>.
    # After the generic replacement above, the About breadcrumb link now reads
    #   <a href="../index.html">About</a>
    # Remove the About anchor + separator so breadcrumbs go straight to the page title.
    pattern = re.compile(
        r'(\s*)<a href="\.\./index\.html">About</a>\s*\n\s*<span aria-hidden="true">/</span>\s*\n',
    )
    new_text, n = pattern.subn('', text)
    if n > 0:
        p.write_text(new_text, encoding='utf-8', newline='')
        print(f'Removed About breadcrumb from {p.name}')
    else:
        print(f'No About breadcrumb match in {p.name}')

# -------- Step 5: Delete the removed files ----------
for victim in [ROOT / 'about' / 'academic-profile.html', ROOT / 'research' / 'interests.html']:
    if victim.exists():
        victim.unlink()
        print(f'Deleted {victim}')

print('Done.')
