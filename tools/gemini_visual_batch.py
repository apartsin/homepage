#!/usr/bin/env python3
"""
Gemini Batch image pipeline for onesite.

Workflow:
1) Audit HTML pages for text-heavy / low-visual opportunities
2) Build JSONL batch requests for illustrations/icons
3) Submit via Gemini Batch API (no non-batch fallback)
4) Optionally poll and download results, extracting image files
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from google import genai
from google.genai import types


DEFAULT_MODEL = "gemini-3-pro-image-preview"
COMPLETED_STATES = {
    "JOB_STATE_SUCCEEDED",
    "JOB_STATE_FAILED",
    "JOB_STATE_CANCELLED",
    "JOB_STATE_EXPIRED",
}


@dataclass
class PageAudit:
    rel_path: str
    title: str
    headings: int
    paragraphs: int
    list_items: int
    images: int
    score: float


def load_env_file(env_file: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not env_file.exists():
        return out
    for raw in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def resolve_api_key(env_file: Path) -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if key:
        return key
    loaded = load_env_file(env_file)
    key = loaded.get("GEMINI_API_KEY", "").strip()
    if not key:
        raise RuntimeError(f"GEMINI_API_KEY not found in env or {env_file}")
    os.environ["GEMINI_API_KEY"] = key
    return key


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:80] if s else "item"


def clean_ws(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def extract_title(html: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.I | re.S)
    if not m:
        return "Untitled Page"
    return clean_ws(m.group(1))


def count_matches(html: str, pattern: str) -> int:
    return len(re.findall(pattern, html, flags=re.I))


def audit_pages(site_root: Path) -> list[PageAudit]:
    pages: list[PageAudit] = []
    for html_file in sorted(site_root.rglob("*.html")):
        rel = html_file.relative_to(site_root).as_posix()
        if rel.startswith("shared/"):
            continue
        html = html_file.read_text(encoding="utf-8", errors="ignore")
        headings = count_matches(html, r"<h[1-3]\b")
        paragraphs = count_matches(html, r"<p\b")
        list_items = count_matches(html, r"<li\b")
        images = count_matches(html, r"<img\b")
        text_weight = paragraphs + (0.5 * list_items) + (1.2 * headings)
        visual_penalty = images * 2.2
        score = round(text_weight - visual_penalty, 2)
        pages.append(
            PageAudit(
                rel_path=rel,
                title=extract_title(html),
                headings=headings,
                paragraphs=paragraphs,
                list_items=list_items,
                images=images,
                score=score,
            )
        )
    pages.sort(key=lambda p: p.score, reverse=True)
    return pages


def visual_style_clause() -> str:
    return (
        "Style: professional editorial illustration, clean composition, "
        "subtle depth, warm-neutral palette (#f6f3ec, #9c5a2e, #2f6f9c), "
        "high clarity, no logos, no watermark, no readable text."
    )


def build_page_prompt(page: PageAudit) -> str:
    section = page.rel_path.split("/")[0]
    section_hint = {
        "research": "research methods, publications, and experimentation",
        "teaching": "learning, mentoring, and project-based education",
        "courses": "course progression, practical AI exercises, and student teamwork",
        "work": "product building, systems design, and practical delivery",
        "writing": "ideas, reflection, and structured long-form thinking",
        "about": "professional journey, context, and cross-domain experience",
    }.get(section, "professional knowledge work and innovation")
    return (
        f"Create a hero illustration for the webpage '{page.title}' ({page.rel_path}). "
        f"Concept: {section_hint}. "
        "Composition: widescreen banner aspect, calm but modern, suitable as page header visual. "
        f"{visual_style_clause()}"
    )


def build_icon_prompt(theme: str) -> str:
    return (
        f"Create a single flat icon for the website theme '{theme}'. "
        "Composition: centered icon on transparent or plain light background, no text. "
        "Icon should be simple, geometric, and legible at 24px and 48px. "
        f"{visual_style_clause()}"
    )


def build_requests(audit: list[PageAudit], max_requests: int) -> list[dict[str, Any]]:
    # Prioritize content-heavy pages first.
    page_candidates = [
        p for p in audit if p.score >= 10 and p.paragraphs >= 5 and not p.rel_path.startswith("courses/")
    ]
    selected_pages = page_candidates[: max(0, max_requests - 7)]

    requests: list[dict[str, Any]] = []
    for p in selected_pages:
        key = f"hero-{slugify(p.rel_path.replace('/', '-').replace('.html', ''))}"
        requests.append(
            {
                "key": key,
                "meta": {
                    "type": "hero-illustration",
                    "page": p.rel_path,
                    "title": p.title,
                },
                "request": {
                    "contents": [{"parts": [{"text": build_page_prompt(p)}]}],
                    "generation_config": {"responseModalities": ["TEXT", "IMAGE"]},
                },
            }
        )

    # Global icon set for top-level themes.
    for theme in ["About", "Research", "Teaching", "Building", "Innovating", "Writings"]:
        requests.append(
            {
                "key": f"icon-{slugify(theme)}",
                "meta": {
                    "type": "theme-icon",
                    "theme": theme,
                    "page": "global-nav",
                },
                "request": {
                    "contents": [{"parts": [{"text": build_icon_prompt(theme)}]}],
                    "generation_config": {"responseModalities": ["TEXT", "IMAGE"]},
                },
            }
        )

    # One reusable abstract section divider background.
    requests.append(
        {
            "key": "bg-section-divider-01",
            "meta": {
                "type": "background",
                "page": "shared",
                "theme": "site-section-divider",
            },
            "request": {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": (
                                    "Create a subtle abstract horizontal background illustration "
                                    "for section separators in a professional personal website. "
                                    "No text, soft gradients, non-distracting, modern."
                                )
                            }
                        ]
                    }
                ],
                "generation_config": {"responseModalities": ["TEXT", "IMAGE"]},
            },
        }
    )

    return requests[:max_requests]


def write_jsonl(path: Path, requests: list[dict[str, Any]]) -> None:
    lines = []
    for r in requests:
        lines.append(json.dumps({"key": r["key"], "request": r["request"]}, ensure_ascii=False))
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_audit_report(path: Path, audit: list[PageAudit], selected: list[dict[str, Any]]) -> None:
    out = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "top_opportunities": [
            {
                "page": p.rel_path,
                "title": p.title,
                "headings": p.headings,
                "paragraphs": p.paragraphs,
                "list_items": p.list_items,
                "images": p.images,
                "score": p.score,
            }
            for p in audit[:30]
        ],
        "selected_requests": [
            {
                "key": r["key"],
                "meta": r["meta"],
            }
            for r in selected
        ],
    }
    path.write_text(json.dumps(out, indent=2), encoding="utf-8")


def poll_job(client: genai.Client, job_name: str, interval_sec: int, max_wait_sec: int):
    start = time.time()
    batch_job = client.batches.get(name=job_name)
    while batch_job.state.name not in COMPLETED_STATES:
        elapsed = time.time() - start
        if elapsed > max_wait_sec:
            return batch_job, False
        print(f"[poll] state={batch_job.state.name} elapsed={int(elapsed)}s")
        time.sleep(interval_sec)
        batch_job = client.batches.get(name=job_name)
    return batch_job, True


def extract_outputs(
    client: genai.Client,
    batch_job: Any,
    request_meta: dict[str, dict[str, Any]],
    out_dir: Path,
) -> dict[str, Any]:
    manifest: dict[str, Any] = {
        "job_name": getattr(batch_job, "name", None),
        "state": getattr(getattr(batch_job, "state", None), "name", None),
        "result_file": None,
        "items": [],
    }
    if not getattr(batch_job, "dest", None) or not getattr(batch_job.dest, "file_name", None):
        return manifest
    result_file = batch_job.dest.file_name
    manifest["result_file"] = result_file

    data = client.files.download(file=result_file).decode("utf-8")
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    raw_jsonl = out_dir / "result.jsonl"
    raw_jsonl.write_text(data, encoding="utf-8")

    for line in data.splitlines():
        if not line.strip():
            continue
        row = json.loads(line)
        key = row.get("key", "unknown")
        item: dict[str, Any] = {"key": key, "meta": request_meta.get(key, {}), "images": [], "texts": []}
        if row.get("error"):
            item["error"] = row["error"]
            manifest["items"].append(item)
            continue
        resp = row.get("response") or {}
        candidates = resp.get("candidates") or []
        parts = []
        if candidates:
            parts = ((candidates[0].get("content") or {}).get("parts") or [])
        for idx, part in enumerate(parts):
            if part.get("text"):
                item["texts"].append(part["text"])
            if part.get("inlineData"):
                mime = part["inlineData"].get("mimeType", "image/png")
                b64 = part["inlineData"].get("data", "")
                ext = "png" if "png" in mime else "jpg"
                file_name = f"{slugify(key)}-{idx:02d}.{ext}"
                file_path = images_dir / file_name
                file_path.write_bytes(base64.b64decode(b64))
                item["images"].append({"mime_type": mime, "file": str(file_path)})
        manifest["items"].append(item)

    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit site and run Gemini Batch image generation.")
    parser.add_argument("--site-root", default=r"E:/Projects/HP3/onesite")
    parser.add_argument("--env-file", default=r"E:/Projects/.env.all")
    parser.add_argument("--out-dir", default=r"E:/Projects/HP3/onesite/output/gemini-visual-batch")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--max-requests", type=int, default=18)
    parser.add_argument("--wait", action="store_true", help="Poll until complete (or max wait).")
    parser.add_argument("--max-wait-seconds", type=int, default=600)
    parser.add_argument("--poll-seconds", type=int, default=10)
    args = parser.parse_args()

    site_root = Path(args.site_root).resolve()
    env_file = Path(args.env_file).resolve()
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    _ = resolve_api_key(env_file)
    audit = audit_pages(site_root)
    requests = build_requests(audit, max_requests=max(1, args.max_requests))

    jsonl_path = out_dir / "requests.jsonl"
    audit_path = out_dir / "audit-report.json"
    write_jsonl(jsonl_path, requests)
    write_audit_report(audit_path, audit, requests)
    print(f"[audit] pages={len(audit)} selected_requests={len(requests)}")
    print(f"[files] audit_report={audit_path}")
    print(f"[files] requests_jsonl={jsonl_path}")

    client = genai.Client()

    uploaded = client.files.upload(
        file=str(jsonl_path),
        config=types.UploadFileConfig(display_name="onesite-visual-requests", mime_type="jsonl"),
    )
    print(f"[upload] file={uploaded.name}")

    batch = client.batches.create(
        model=args.model,
        src=uploaded.name,
        config={"display_name": f"onesite-visuals-{int(time.time())}"},
    )
    print(f"[batch] name={batch.name}")
    print(f"[batch] state={batch.state.name}")

    state_path = out_dir / "batch-state.json"
    state_payload = {
        "batch_name": batch.name,
        "initial_state": batch.state.name,
        "model": args.model,
        "input_file": uploaded.name,
        "created_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    state_path.write_text(json.dumps(state_payload, indent=2), encoding="utf-8")
    print(f"[files] batch_state={state_path}")

    if not args.wait:
        return

    batch_job, done = poll_job(
        client=client,
        job_name=batch.name,
        interval_sec=max(5, args.poll_seconds),
        max_wait_sec=max(30, args.max_wait_seconds),
    )
    print(f"[batch] final_state={batch_job.state.name}")
    if not done:
        print("[batch] polling timed out before completion")
        return

    request_meta = {r["key"]: r["meta"] for r in requests}
    manifest = extract_outputs(client, batch_job, request_meta, out_dir)
    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"[files] manifest={manifest_path}")
    image_count = sum(len(it.get("images", [])) for it in manifest.get("items", []))
    print(f"[result] image_files={image_count}")


if __name__ == "__main__":
    main()
