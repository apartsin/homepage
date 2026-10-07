import json, sys, time, concurrent.futures, io
from pathlib import Path
from google import genai
from google.genai import types
from PIL import Image

cfg = json.loads(Path.home().joinpath(".gemini-imagegen.json").read_text())
client = genai.Client(api_key=cfg["api_key"])
OUT = Path(__file__).parent
STYLE = ("Style: clean, witty editorial cartoon in the spirit of a New Yorker / xkcd hybrid, "
         "hand-drawn ink lines with a warm limited palette (cream background, charcoal ink, burnt-orange accent, a touch of blue). "
         "Expressive simple characters, generous white space, no photorealism. Any text in the image must be short, "
         "in clean hand-lettered English, spelled exactly as given, and nothing else written. ")

P = {
 "hero": ("16:9", "A university lecture hall. On the left, a stern professor points at a towering blackboard full of math equations, "
   "big-O notation and a pyramid diagram, saying in a speech bubble: 'First, three years of foundations.' "
   "In the front row, a cheerful first-year student holds up a laptop showing a live app with a rocket and a little chart going up, "
   "with a friendly robot AI assistant sitting on their shoulder giving a thumbs up. "
   "The student's speech bubble: 'I already shipped it.' Humorous contrast."),
 "pyramid": ("4:3", "Cartoon of a giant Egyptian-style stone pyramid made of labeled blocks. Bottom row blocks labeled 'MATH', 'ALGORITHMS', "
   "'DATA STRUCTURES'. Middle row: 'OS', 'NETWORKS', 'DATABASES'. Tiny block at the very top labeled 'BUILD STUFF'. "
   "A small exhausted student with a backpack climbs the steps, sweating, while at the summit a little flag says 'Year 4'. "
   "Funny and informative."),
 "ladder": ("16:9", "A tall ladder climbing out of a deep pit of complexity. The rungs are labeled from bottom to top: "
   "'ASSEMBLY', 'C', 'LIBRARIES', 'FRAMEWORKS', 'CLOUD', 'AI'. At the bottom, an old programmer in the dark wrestles with tangled wires; "
   "at the top, a relaxed young developer sits on a cloud talking to a friendly robot, saying 'Make me an app.' Witty visual of rising abstraction."),
 "interview": ("16:9", "A job interview office. A nervous graduate in a suit holds a huge framed diploma and a stack of textbooks titled "
   "'DISCRETE MATH' and 'OPERATING SYSTEMS'. Across the desk, a casual interviewer in a hoodie with a laptop with stickers asks in a speech bubble: "
   "'Cool. Can you build something?' Comic awkward pause, a single sweat drop on the graduate."),
 "bugs": ("16:9", "A four-panel comic strip in a row, same student character in each. "
   "Panel 1: student watches a loading spinner on their app, cobwebs growing; caption 'Slow app'. "
   "Panel 2: a crowd of hundreds of tiny users stampedes into a small server box that is on fire; caption 'Too many users'. "
   "Panel 3: a shiny robot model wins a trophy on stage, then trips over a banana labeled 'NEW DATA'; caption 'Fails on new data'. "
   "Panel 4: a friendly AI hands the student polished code, with a tiny bug peeking out from behind it; caption 'Hidden bug'. "
   "In every panel the student has a lightbulb moment and a textbook appears. Funny, informative."),
 "loop": ("16:9", "A playful circular diagram drawn as a cartoon racetrack spiral going upward like a staircase spiral. "
   "Four stations around the loop, each with a small sign: 'BUILD', 'HIT A LIMIT', 'LEARN WHY', 'BUILD HARDER'. "
   "A student rides a skateboard around the spiral, getting a bit taller and more confident each lap, carrying more books each time. "
   "At the top the spiral continues upward. Joyful, energetic."),
}

def gen(name):
    ar, prompt = P[name]
    out = OUT / f"{name}.jpg"
    if out.exists(): return name, "skip"
    for model in ["gemini-3-pro-image-preview", "gemini-3.1-flash-image"]:
        for attempt in range(3):
            try:
                r = client.models.generate_content(model=model, contents=STYLE + prompt,
                    config=types.GenerateContentConfig(response_modalities=["IMAGE"],
                        image_config=types.ImageConfig(aspect_ratio=ar, image_size="1K")))
                for part in r.parts or []:
                    if part.inline_data:
                        im = Image.open(io.BytesIO(part.inline_data.data)).convert("RGB")
                        im.thumbnail((1400, 1400)); im.save(out, quality=82)
                        return name, f"ok {model} {im.size}"
                raise RuntimeError("no image in response")
            except Exception as e:
                print(name, model, attempt, e, flush=True); time.sleep(5 * 2**attempt)
    return name, "FAILED"

names = sys.argv[1:] or list(P)
with concurrent.futures.ThreadPoolExecutor(3) as ex:
    for n, s in ex.map(gen, names): print(n, s, flush=True)
