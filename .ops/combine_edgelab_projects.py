from pathlib import Path
import json
import re

p = Path('E:/Projects/HP3/onesite/teaching/hands-on-ai-science-courses-student-projects.data.js')
raw = p.read_text(encoding='utf-8')

# Extract the JSON array from `const STUDENT_PROJECTS = [...]`.
m = re.match(r'const STUDENT_PROJECTS = (\[.*\]);\s*$', raw.strip(), re.DOTALL)
assert m, 'Could not find STUDENT_PROJECTS array'
data = json.loads(m.group(1))

targets = {"WeatherLight EdgeLab", "RoadHazard EdgeLab", "HumanSafe EdgeLab"}
combined_title = "ADAS EdgeLab"
combined_entry = {
    "t": combined_title,
    "c": "Workshop: GenAI Applications - HIT CS 2025/26",
    "a": "Shalev Cohen, Noam Hadad, Tomer Atia, Sagi Akshikar",
    "d": "Generating edge-case scenarios with generative models for automotive (ADAS) applications, covering adverse weather, road hazards, and vulnerable road users.",
    "i": "../assets/courses/workshops/genai-workshophit-cs-2025-26/img-003-8f9f53099d.png",
    "l": [
        {"k": "Course Page", "u": "../courses/workshops/genai-workshophit-cs-2025-26.html"},
        {"k": "GitHub", "u": "https://github.com/HITProjects/SyntheticImageData/tree/tomer-synthetic-data-lab"}
    ]
}

new_data = []
inserted = False
for entry in data:
    if entry.get("t") in targets:
        if not inserted:
            new_data.append(combined_entry)
            inserted = True
        continue
    new_data.append(entry)

assert inserted, 'No target entries found'

out = 'const STUDENT_PROJECTS = ' + json.dumps(new_data, ensure_ascii=False) + ';\n'
p.write_text(out, encoding='utf-8', newline='')
print(f'Combined {len(targets)} entries into one; remaining: {len(new_data)}')
