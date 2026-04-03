
const subjectSelect = document.getElementById('subjectSelect');
const categorySelect = document.getElementById('categorySelect');
const quizCountEl = document.getElementById('quizCount');
const factCountEl = document.getElementById('factCount');
const recentCountEl = document.getElementById('recentCount');
const cardTitleEl = document.getElementById('cardTitle');
const cardBodyEl = document.getElementById('cardBody');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');

function shuffle(arr){
  return arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
}

function getSubjectKeys(){
  return Object.keys(POPBLOCKS_MANIFEST.subjects);
}

function getCategoryKeys(subjectKey){
  return Object.keys(POPBLOCKS_MANIFEST.subjects[subjectKey].categories);
}

function getRecentKey(subjectKey, categoryKey){
  return `popblocks_recent_${subjectKey}_${categoryKey}`;
}

function getRecent(subjectKey, categoryKey){
  try {
    return JSON.parse(localStorage.getItem(getRecentKey(subjectKey, categoryKey)) || '[]');
  } catch(e){
    return [];
  }
}

function setRecent(subjectKey, categoryKey, ids){
  localStorage.setItem(getRecentKey(subjectKey, categoryKey), JSON.stringify(ids));
}

function getQuestions(subjectKey, categoryKey){
  const info = POPBLOCKS_MANIFEST.subjects[subjectKey].categories[categoryKey];
  let out = [];
  info.quizPacks.forEach(packId => {
    const pack = POPBLOCKS_PACKS[packId];
    if(pack && pack.active && Array.isArray(pack.questions)) out = out.concat(pack.questions);
  });
  return out;
}

function getFacts(subjectKey, categoryKey){
  const info = POPBLOCKS_MANIFEST.subjects[subjectKey].categories[categoryKey];
  let out = [];
  info.factPacks.forEach(packId => {
    const pack = POPBLOCKS_PACKS[packId];
    if(pack && pack.active && Array.isArray(pack.facts)) out = out.concat(pack.facts);
  });
  return out;
}

function renderSubjects(){
  subjectSelect.innerHTML = '';
  getSubjectKeys().forEach(subjectKey => {
    const opt = document.createElement('option');
    opt.value = subjectKey;
    opt.textContent = POPBLOCKS_MANIFEST.subjects[subjectKey].label;
    subjectSelect.appendChild(opt);
  });
  renderCategories();
}

function renderCategories(){
  const subjectKey = subjectSelect.value;
  categorySelect.innerHTML = '';
  getCategoryKeys(subjectKey).forEach(categoryKey => {
    const opt = document.createElement('option');
    opt.value = categoryKey;
    opt.textContent = POPBLOCKS_MANIFEST.subjects[subjectKey].categories[categoryKey].label;
    categorySelect.appendChild(opt);
  });
  updateStats();
}

function updateStats(){
  const subjectKey = subjectSelect.value;
  const categoryKey = categorySelect.value;
  const questions = getQuestions(subjectKey, categoryKey);
  const facts = getFacts(subjectKey, categoryKey);
  const recent = getRecent(subjectKey, categoryKey);
  quizCountEl.textContent = questions.length;
  factCountEl.textContent = facts.length;
  recentCountEl.textContent = recent.length;
  feedbackEl.textContent = '';
}

function nextQuiz(){
  const subjectKey = subjectSelect.value;
  const categoryKey = categorySelect.value;
  const questions = getQuestions(subjectKey, categoryKey);
  let recent = getRecent(subjectKey, categoryKey);
  let available = questions.filter(q => !recent.includes(q.id));
  if(available.length === 0){
    recent = [];
    setRecent(subjectKey, categoryKey, recent);
    available = questions.slice();
  }
  const q = available[Math.floor(Math.random() * available.length)];
  const indexedChoices = q.choices.map((choice, idx) => ({ choice, originalIndex: idx }));
  const shuffled = shuffle(indexedChoices);
  const correctIndex = shuffled.findIndex(item => item.originalIndex === q.answerIndex);

  cardTitleEl.textContent = 'Quiz Boost';
  cardBodyEl.textContent = q.prompt;
  choicesEl.innerHTML = '';
  feedbackEl.textContent = '';

  shuffled.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = item.choice;
    btn.addEventListener('click', () => {
      Array.from(choicesEl.children).forEach((child, childIdx) => {
        child.disabled = true;
        if(childIdx === correctIndex) child.classList.add('correct');
        else if(childIdx === idx && idx !== correctIndex) child.classList.add('wrong');
      });
      feedbackEl.textContent = (idx === correctIndex ? 'Correct. ' : 'Not quite. ') + q.explanation;
      const nextRecent = recent.concat([q.id]).slice(-12);
      setRecent(subjectKey, categoryKey, nextRecent);
      updateStats();
    });
    choicesEl.appendChild(btn);
  });
}

function nextFact(){
  const subjectKey = subjectSelect.value;
  const categoryKey = categorySelect.value;
  const facts = getFacts(subjectKey, categoryKey);
  const fact = facts[Math.floor(Math.random() * facts.length)];
  cardTitleEl.textContent = 'Knowledge Pop';
  cardBodyEl.textContent = fact.text;
  choicesEl.innerHTML = '';
  feedbackEl.textContent = 'Facts pull from Pack 01 and Pack 02 for this category.';
}

document.getElementById('nextQuizBtn').addEventListener('click', nextQuiz);
document.getElementById('nextFactBtn').addEventListener('click', nextFact);
document.getElementById('clearMemoryBtn').addEventListener('click', () => {
  setRecent(subjectSelect.value, categorySelect.value, []);
  updateStats();
  feedbackEl.textContent = 'Recent question memory cleared for this category.';
});
subjectSelect.addEventListener('change', renderCategories);
categorySelect.addEventListener('change', updateStats);

renderSubjects();
