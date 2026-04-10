# TODO (Recovered From Recent Conversation)

Last updated: 2026-04-09

## P0 — Navigation Consistency / UX

- [ ] Make navigation identical on all pages (especially `Building` pages that still render differently).
- [ ] Fix broken shared asset paths in nested pages so `site-shell.js`/shared CSS always load.
- [ ] Implement hover submenus on top-level nav items (for example, hover `Research` to see suboptions).
- [ ] Keep mobile behavior usable for submenus (tap/expand fallback).
- [ ] Remove top-nav `Home` text item and use logo image as the home link.
- [ ] Eliminate remaining top-bar flicker on page load/navigation.
- [ ] Fix menu/tagline/content overlap cases.

## P0 — Header / Hero Cleanup

- [ ] Make per-page header smaller and less gray/heavy.
- [ ] Add stronger intro text in page headers (informative, non-promotional tone).
- [ ] Add real header illustrations (Gemini Batch API, no non-batch fallback).
- [ ] Replace homepage visual placeholders with generated/real visuals.

## P1 — Homepage Content Cleanup

- [ ] Remove `Start with Research` button.
- [ ] Remove `Explore Teaching` button.
- [ ] Keep homepage cards fully clickable (already done) and verify keyboard/focus behavior.

## P1 — Links / Content Integrity

- [ ] Resolve broken links reported in `onesite/_link_check_report.json`.
- [ ] Fix `../courses/...`, `../shared/...`, `../shared-media/...` relative-link depth errors on nested pages.
- [ ] Decide what to do with missing `google_drive` PDF links:
  - [ ] Import files locally, or
  - [ ] Replace with available equivalents, or
  - [ ] Remove links and keep descriptive text only.
- [ ] Re-run full link validation after fixes.

## P2 — De-Google / Legacy Cleanup

- [ ] Continue de-Google cleanup on remaining pages with mixed raw exported markup.
- [ ] Remove/replace remaining Google embed shell artifacts (`atari-embeds` blocks) where still visible.
- [ ] Confirm no legacy duplicated nav/content blocks remain after shell enhancement.

## P2 — QA Passes

- [ ] Run responsive visual pass (mobile/tablet/desktop) after nav/header changes.
- [ ] Do targeted visual checks for pages previously flagged for regressions.
- [ ] Run strict page-by-page content diff against `origin` for high-risk pages to ensure no text loss.

