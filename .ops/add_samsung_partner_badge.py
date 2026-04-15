from pathlib import Path
import json
import re

p = Path('E:/Projects/HP3/onesite/teaching/hands-on-ai-science-courses-student-projects.data.js')
raw = p.read_text(encoding='utf-8')

m = re.match(r'const STUDENT_PROJECTS = (\[.*\]);\s*$', raw.strip(), re.DOTALL)
assert m
data = json.loads(m.group(1))

partner_path = '../assets/partners/samsung-rd.jpg'
new_artifactsense_github = 'https://github.com/Snafuzila/Samsung-Artifact-Detection/tree/main'

artifactsense_done = False
sensorcheck_done = False

for entry in data:
    title = entry.get('t', '')
    if title == 'ArtifactSense':
        entry['p'] = partner_path
        # Replace existing GitHub link with the new URL.
        for link in entry.get('l', []):
            if link.get('k') == 'GitHub':
                link['u'] = new_artifactsense_github
                break
        else:
            entry.setdefault('l', []).append({'k': 'GitHub', 'u': new_artifactsense_github})
        artifactsense_done = True
    elif title == 'InterpQual SensorCheck':
        entry['p'] = partner_path
        sensorcheck_done = True

assert artifactsense_done and sensorcheck_done

out = 'const STUDENT_PROJECTS = ' + json.dumps(data, ensure_ascii=False) + ';\n'
p.write_text(out, encoding='utf-8', newline='')
print('Updated ArtifactSense (partner + new GitHub) and InterpQual SensorCheck (partner).')
