"""
Generate hero illustration images for all site pages using Gemini Imagen API.
Each image is a stylized abstract/geometric illustration (no text, no faces)
suitable as a small decorative element beside a page header.
Style: minimal, warm-toned, academic, geometric shapes with subtle gradients.
"""

import os
import sys
import time
import base64
import json
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Installing google-genai...")
    os.system(f"{sys.executable} -m pip install google-genai")
    from google import genai
    from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    # Try loading from config file
    cfg_path = Path.home() / ".gemini-imagegen.json"
    if cfg_path.exists():
        with open(cfg_path) as f:
            cfg = json.load(f)
            API_KEY = cfg.get("api_key", "")
if not API_KEY:
    print("ERROR: Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
OUT_DIR = Path(r"E:\Projects\HP3\onesite\assets\heroes")
OUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_PREFIX = (
    "Minimal abstract geometric illustration, warm earth tones with navy blue accents, "
    "soft gradients, no text, no faces, no hands, academic and professional feel, "
    "clean composition on white background, suitable as a small decorative icon. "
)

PAGES = [
    # About section
    ("about-education", "Stack of academic books with a graduation cap, geometric shapes suggesting knowledge layers"),
    ("about-industry-experience", "Abstract timeline of connected nodes spanning three decades, circuit-like paths linking geometric shapes"),
    ("about-phd-thesis", "Radar waves penetrating underground layers, abstract signal processing visualization with waveforms"),

    # Research section
    ("research-interests", "Interconnected research domains: language, vision, and signal icons linked by flowing lines"),
    ("research-projects", "Code brackets surrounding a laboratory flask, abstract experiment visualization"),
    ("research-publications", "Abstract open journal pages with citation network nodes floating above"),
    ("research-grad-opportunities", "Mentor and student silhouettes as abstract geometric figures collaborating over data"),

    # Teaching section
    ("teaching-overview", "Abstract classroom with floating code snippets and data visualizations"),
    ("teaching-hos-courses", "Four interlocking puzzle pieces in different colors representing four AI course tracks"),
    ("teaching-hos-offerings", "Calendar grid with colored blocks representing course offerings across institutions"),
    ("teaching-hos-student-projects", "Collection of small project cards fanning out like a portfolio showcase"),
    ("teaching-curriculum", "Blueprint-style course structure diagram with connected modules"),
    ("teaching-innovation-first", "Rocket launching from a notebook, innovation meets education concept"),
    ("teaching-cs-courses", "Binary tree and algorithm flowchart in geometric style"),
    ("teaching-current-students", "Active research pathways branching from a central node"),
    ("teaching-former-students", "Graduated paths diverging outward from a central academic hub"),
    ("teaching-undergrad-projects", "Lightbulb connected to circuit board, ideas meeting engineering"),
    ("teaching-course-bots", "AI chat bubble with gear icon, automated teaching assistant concept"),

    # Work/Building section
    ("work-overview", "Layered technology stack blocks from 1990s to present, ascending timeline"),
    ("work-recent-projects", "Modern browser window with AI agent icons and tool connections"),
    ("work-past-projects", "Vintage to modern technology evolution: from circuit board to neural network"),
    ("work-tech-stack", "Ascending technology layers: hardware, networking, ML, LLMs as stacked geometric planes"),
    ("work-consulting", "Bridge connecting business strategy icon to AI technology icon"),
    ("work-patents", "Patent document with lightbulb seal, abstract intellectual property concept"),
    ("work-awards", "Trophy with geometric rays, achievement and recognition motif"),
    ("work-entrepreneurship", "Startup rocket with product boxes, venture creation visualization"),
    ("work-innovation-overview", "Venn diagram of research, building, and teaching overlapping at innovation"),
    ("work-innovation-first-learning", "Hands building with blocks while a theory book opens beside them"),

    # Writing section
    ("writing-overview", "Open notebook with flowing ink that transforms into digital text"),
    ("writing-blog-posts", "Medium-style article cards cascading with theme tags"),
    ("writing-books", "Two open book manuscripts side by side with connecting concept threads"),

    # Industry application domain illustrations (for past-projects, industry-experience cards)
    ("domain-finance", "Abstract stock chart with ML prediction overlay, financial data analytics visualization"),
    ("domain-media", "Video streaming frames with content analysis overlays, multimedia processing concept"),
    ("domain-public-safety", "Surveillance camera view with object detection bounding boxes, urban monitoring"),
    ("domain-automotive", "Connected car dashboard with sensor fusion data streams and predictive analytics"),
    ("domain-healthcare", "Medical imaging scan with AI-highlighted regions, diagnostic assistance concept"),
    ("domain-telecom", "Network topology with data flowing through nodes, communication infrastructure"),
    ("domain-education", "Digital classroom with interactive learning tools and AI tutoring elements"),
    ("domain-enterprise", "Corporate knowledge graph connecting documents, people, and insights"),
]

def generate_image(name, description):
    out_path = OUT_DIR / f"{name}.png"
    if out_path.exists():
        print(f"  SKIP {name} (already exists)")
        return True

    prompt = STYLE_PREFIX + description
    print(f"  Generating {name}...")

    try:
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                output_mime_type="image/png",
            ),
        )

        if response.generated_images and len(response.generated_images) > 0:
            img_bytes = response.generated_images[0].image.image_bytes
            with open(out_path, "wb") as f:
                f.write(img_bytes)
            print(f"  OK {name} ({len(img_bytes)} bytes)")
            return True
        else:
            print(f"  FAIL {name}: no images returned")
            return False

    except Exception as e:
        print(f"  ERROR {name}: {e}")
        return False


def main():
    print(f"Generating {len(PAGES)} hero images to {OUT_DIR}")
    print()

    success = 0
    fail = 0

    for name, desc in PAGES:
        ok = generate_image(name, desc)
        if ok:
            success += 1
        else:
            fail += 1
        # Rate limit: ~10 requests per minute for Imagen
        time.sleep(7)

    print()
    print(f"Done: {success} generated, {fail} failed")


if __name__ == "__main__":
    main()
