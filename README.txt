# Pop Blocks Integrated Pack System

This folder contains the real Pop Blocks game, not a test page.

## Start file
- `index.html`

## What is included
- Your original game engine, still playable
- External content pack system wired into the real game
- 3 live sample category packs with 15 questions and 15 facts each:
  - Black History → Inventors
  - Financial Literacy → Savings
  - Civics → Executive

## How it works
The game now checks for external category packs first.
If a pack exists for the matched category, it uses those questions/facts.
If no external pack exists yet, it falls back to the original built-in questions.

## Current live content files
- `js/config/pack-manifest.js`
- `js/content/blackHistory/inventors/quiz-pack-01.js`
- `js/content/blackHistory/inventors/fact-pack-01.js`
- `js/content/finance/savings/quiz-pack-01.js`
- `js/content/finance/savings/fact-pack-01.js`
- `js/content/civics/executive/quiz-pack-01.js`
- `js/content/civics/executive/fact-pack-01.js`

## To add another category
1. Copy a template from `/templates`
2. Create a new folder under the correct subject/category
3. Add your new pack file
4. Register that pack in `js/config/pack-manifest.js`

## Good next move
Build pack 01 for every category with 15 questions each.
After that, add pack 02, pack 03, and so on until each category hits 100.
