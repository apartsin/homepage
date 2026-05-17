"""Generate sitemap.xml from the HTML files in the onesite/ tree.

Lastmod for each URL uses the file's most recent git commit date.
Run from the onesite/ directory: `python .ops/build_sitemap.py`.
"""
from __future__ import annotations

import datetime as dt
import pathlib
import subprocess
import sys
import xml.sax.saxutils as xml_utils

SITE_ROOT = "https://www.apartsin.com"
EXCLUDE_NAMES = {"404.html"}


def git_lastmod(path: pathlib.Path) -> str:
    """ISO date of the most recent commit touching this file, or today's date as fallback."""
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", str(path)],
            stderr=subprocess.DEVNULL,
            text=True,
        ).strip()
        if out:
            # Keep just the date part for stability in diffs.
            return out.split("T", 1)[0]
    except subprocess.CalledProcessError:
        pass
    return dt.date.today().isoformat()


def file_to_loc(rel: pathlib.PurePosixPath) -> str:
    parts = list(rel.parts)
    if parts == ["index.html"]:
        return f"{SITE_ROOT}/"
    if parts[-1] == "index.html":
        # /teaching/index.html -> /teaching/
        return f"{SITE_ROOT}/" + "/".join(parts[:-1]) + "/"
    return f"{SITE_ROOT}/" + "/".join(parts)


def main() -> int:
    root = pathlib.Path(".").resolve()
    html_files = sorted(
        p for p in root.rglob("*.html")
        if p.name not in EXCLUDE_NAMES
        and "node_modules" not in p.parts
        and ".ops" not in p.parts
    )

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for path in html_files:
        rel = pathlib.PurePosixPath(path.relative_to(root).as_posix())
        loc = xml_utils.escape(file_to_loc(rel))
        lastmod = git_lastmod(path.relative_to(root))
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    lines.append("")  # trailing newline

    out_path = root / "sitemap.xml"
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out_path} with {len(html_files)} URLs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
