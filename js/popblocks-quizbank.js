
(function(global){
  "use strict";

  const MODE_CATEGORY_MAP = {
    blackHistory: [
      "arts_literature",
      "black_history_stories",
      "entertainers_film_tv",
      "hbcu_legacy",
      "inventors",
      "military_pioneers",
      "music_entertainment",
      "trailblazers_professions",
      "sports",
      "superheroes",
      "divine_nine_nphc",
      "global_icons_african_royalty",
      "comedy"
    ],
    finance: [
      "financial_literacy"
    ],
    civics: [
      "civics_constitutional_history"
    ]
  };

  const api = {
    engine: null,
    ready: null,
    async init() {
      this.engine = new global.WGLTQuestionEngine({
        bankUrl: "./data/wglt_master_categorized.json",
        shuffleRuntimeAnswers: true,
        preventRepeats: true
      });
      await this.engine.load();
      return this;
    },
    getQuizPool(modeKey, unlockedExtraCount) {
      if (!this.engine) return [];
      const categories = MODE_CATEGORY_MAP[modeKey] || [];
      const questions = this.engine.getQuestionsByCategories(categories);

      // Convert to Pop Blocks native shape
      return questions.map((q) => {
        const prepared = this.engine.prepareQuestion(q, true);
        return {
          id: prepared.id,
          q: prepared.prompt,
          choices: prepared.answers,
          a: prepared.correctIndex,
          explanation: prepared.section || prepared.categoryLabel || prepared.category || "WGLT Question Bank",
          difficulty: prepared.difficulty || "standard",
          category: prepared.category,
          categoryLabel: prepared.categoryLabel
        };
      });
    }
  };

  api.ready = api.init();
  global.WGLT_POPBLOCKS_QUIZBANK = api;
})(window);
