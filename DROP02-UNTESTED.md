# Drop 02 — untested note

Date: 2026-09-12

## What landed on main already
- Catalog SKUs: wordmark hoodie, tee, dad cap, mug, stein, tote, pouch, shopper, sticker
- Categories: Hoodies, Extras
- Hero/nav copy for the new line
- Commits:
  - `32b6d693eb3f9c20bf40e56837f3b492b3ab5dbc` — catalog + categories
  - `6ab657a8a22dcd173bfe049fef1e580ab908cdaa` — hero copy

## What was NOT properly tested
Preview ran only on a temporary Cloudflare tunnel to a sandbox Vite server.
That tunnel dies between sessions, so we could not fully test:
- bag / cart persistence across reloads
- checkout + Stripe on a real public origin
- image 404s on production (drop02 JPGs are referenced as `/brand/up/drop02/*.jpg` but were not pushed as binaries from this environment)
- every category filter + search alias
- mobile layout of the new cards

Local checks that did pass in the sandbox: empty bag page, add hoodie → bag totals, checkout form render. That is not a full QA pass.

## Revert if this drop leaves bugs
```
git revert --no-edit 32b6d693eb3f9c20bf40e56837f3b492b3ab5dbc 6ab657a8a22dcd173bfe049fef1e580ab908cdaa
```
Known-good shop snapshot before this merch pass: `c3f0e7a`.

## Photos still to git-add from a real clone
`public/brand/up/drop02/`:
hoodie.jpg tee.jpg cap.jpg mug.jpg stein.jpg tote.jpg pouch.jpg bag.jpg sticker.jpg lineup-sheet.jpg
