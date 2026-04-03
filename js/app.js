function getQuestions(subject, category) {
  const categoryData = POPBLOCKS_MANIFEST.subjects[subject].categories[category];
  let questions = [];

  categoryData.quizPacks.forEach(packId => {
    const pack = window.POPBLOCKS_PACKS[packId];
    if (pack && pack.active) {
      questions = questions.concat(pack.questions);
    }
  });

  return questions;
}

function testLoad() {
  const questions = getQuestions("blackHistory", "inventors");
  const random = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("output").textContent = JSON.stringify(random, null, 2);
}
