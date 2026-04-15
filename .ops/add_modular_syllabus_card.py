from pathlib import Path

base = Path('E:/Projects/HP3/onesite/courses/hos/series')

modular_card = (
    '          <article class="syllabus-card">\n'
    '            <h2>Modular Syllabus</h2>\n'
    '            <p>The course syllabus is tailored to specific audiences: graduate or undergraduate, with versions for engineering, digital health, and computer science.</p>\n'
    '          </article>\n'
)

# Each course has its own Tools & Platforms text, but the closing </article> + opening of the
# next article is consistent. Insert the Modular Syllabus right after the Tools & Platforms card.
patterns = {
    'vision-ai': (
        '          <article class="syllabus-card">\n'
        '            <h2>Tools &amp; Platforms</h2>\n'
        '            <p>PyTorch, OpenCV, Hugging Face Diffusers, Stable Diffusion, YOLO, SAM, CLIP, Roboflow, Weights &amp; Biases, and Google Colab.</p>\n'
        '          </article>\n'
    ),
    'scalable-ai': (
        '          <article class="syllabus-card">\n'
        '            <h2>Tools &amp; Platforms</h2>\n'
        '            <p>PySpark, Databricks, Hadoop MapReduce, Horovod, DeepSpeed, Ray, PettingZoo, Gymnasium, Stable Baselines3, and cloud compute (AWS/Azure).</p>\n'
        '          </article>\n'
    ),
    'temporal-ai': (
        '          <article class="syllabus-card">\n'
        '            <h2>Tools &amp; Platforms</h2>\n'
        '            <p>PyTorch, statsmodels, Prophet, Darts, NeuralForecast, Gymnasium, Stable Baselines3, Ray RLlib, TensorBoard, and Weights &amp; Biases.</p>\n'
        '          </article>\n'
    ),
}

for filename, tools_card in patterns.items():
    p = base / f'{filename}.html'
    s = p.read_text(encoding='utf-8')
    if tools_card not in s:
        print(f'WARN: Tools & Platforms card not matched in {filename}')
        continue
    if modular_card.strip() in s:
        print(f'SKIP: Modular Syllabus card already present in {filename}')
        continue
    s = s.replace(tools_card, tools_card + modular_card)
    p.write_text(s, encoding='utf-8', newline='')
    print(f'updated {filename}')
