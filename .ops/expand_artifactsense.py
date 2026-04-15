from pathlib import Path
import json
import re

p = Path('E:/Projects/HP3/onesite/teaching/hands-on-ai-science-courses-student-projects.data.js')
raw = p.read_text(encoding='utf-8')

m = re.match(r'const STUDENT_PROJECTS = (\[.*\]);\s*$', raw.strip(), re.DOTALL)
assert m
data = json.loads(m.group(1))

found = False
for entry in data:
    if entry.get("t") == "ArtifactSense":
        entry["d"] = "Identifying image artifacts from processing-pipeline defects or sensor malfunctions (joint with Samsung)."
        found = True
        break

assert found, 'ArtifactSense not found'

out = 'const STUDENT_PROJECTS = ' + json.dumps(data, ensure_ascii=False) + ';\n'
p.write_text(out, encoding='utf-8', newline='')
print('ArtifactSense description updated')
