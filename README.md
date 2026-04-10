# OneSite (GitHub Pages Ready)

This repository is structured so the website can be served directly from the repository root (GitHub Pages root deployment).

## Live Site Content (publishable)

- `index.html`, `404.html`, `CNAME`
- `about/`, `research/`, `teaching/`, `work/`, `writing/`, `courses/`
- `assets/`, `shared/`, `shared-media/`

## Operational Files (non-site)

- `.ops/reports/` for validation/link reports
- `.ops/runtime/` for temporary runtime output/logs
- `.ops/tools/` for local maintenance scripts/tools
- `.ops/notes/` for local planning notes

Keep user-facing pages and media in the publishable paths above so deploy behavior stays predictable.
