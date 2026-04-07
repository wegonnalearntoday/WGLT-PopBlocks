WGLT Pop Blocks Connected Build

What was added:
- data/wglt_master_categorized.json
- js/questionEngine.js
- js/popblocks-quizbank.js

What changed:
- index.html now loads the WGLT master bank
- Black History mode now pulls from all Black History quiz categories
- Financial Literacy mode pulls from the financial literacy bank
- Civics mode pulls from the civics/constitutional bank
- Answer choices are shuffled automatically
- Built-in Pop Blocks quizzes remain as a fallback

GitHub-ready structure:
- index.html
- /js/questionEngine.js
- /js/popblocks-quizbank.js
- /data/wglt_master_categorized.json

To test:
1. Upload the whole folder to GitHub Pages
2. Open index.html
3. Fill the meter and trigger Quiz Boost
4. The quiz card should now use the master WGLT bank


Combo timer updated:
- x1-x2: 5.0s
- x3-x4: 4.0s
- x5+: 3.0s


v3 fixes:
- Bomb clears now award score and meter.
- Exact 9-block pops create a board brain icon.
- Brain icon arms x2 score for the next pop.
- Quiz selection now favors unseen questions, with a 25% repeat chance.
- Combo timer preserved at 5s, 4s, 3s tiers.
