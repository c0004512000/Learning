# Learning Map V3 QA

## Static QA

Passed across all V3 HTML files:

- every relative `href` target exists
- every referenced anchor target exists
- CSS and JS asset paths exist
- no duplicate anchor IDs were found in the checked pages

## Browser QA

Executed with Python Playwright + system Chromium.

Viewports:

- Desktop: `1280 × 900`
- Mobile: `390 × 844`

Pages browser-rendered and checked at both viewports:

- `index.html`
- `milestones/01-linux-isolation-foundation.html`
- `lessons/0001-why-linux-namespaces-exist.html`
- `reference/process-and-kernel.html`

Checks passed:

- exactly one page heading renders
- milestone cards are real `<a href>` navigation targets
- M1 detail contains real Lesson / Reference anchors
- no horizontal page overflow at either viewport
- shared theme-toggle JavaScript creates the toggle and switches theme state
- no browser `pageerror`
- no console-level JavaScript errors
- `theme.js` passes `node --check`

## Environment limitation

The container's managed Chromium policy blocks direct navigation to `http://`, `https://`, and `file://` URLs with `ERR_BLOCKED_BY_ADMINISTRATOR`.

Therefore local Playwright was used for real rendering, CSS, tap targets, and interactive theme behavior by inlining the production assets into the same production markup. Cross-page URL navigation is not claimed as locally browser-verified.

Cross-page navigation is implemented with normal relative `<a href>` links and passed static target/anchor validation. After this branch is merged to `main` and GitHub Pages deploys, the deployed Pages URLs must be traversed and verified separately before final completion is claimed.
