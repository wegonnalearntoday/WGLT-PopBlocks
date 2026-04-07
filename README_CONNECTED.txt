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
