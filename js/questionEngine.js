
(function (global) {
  "use strict";

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function normalize(value) { return value == null ? null : String(value).trim().toLowerCase(); }
  function hashString(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffleWithRng(arr, rng) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  class WGLTQuestionEngine {
    constructor(options = {}) {
      this.bankUrl = options.bankUrl || null;
      this.bankData = options.bankData || null;
      this.shuffleRuntimeAnswers = options.shuffleRuntimeAnswers ?? false;
      this.preventRepeats = options.preventRepeats ?? true;
      this.autoResetWhenExhausted = options.autoResetWhenExhausted ?? false;
      this.loaded = false;
      this.questions = [];
    }

    async load() {
      let data = this.bankData;
      if (!data && this.bankUrl) {
        const res = await fetch(this.bankUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load question bank");
        data = await res.json();
      }
      if (!data || !Array.isArray(data.questions)) throw new Error("Question bank must have a questions array");
      this.questions = data.questions.map((q, i) => ({
        id: q.id || `q_${i+1}`,
        prompt: q.prompt || "",
        answers: Array.isArray(q.answers) ? q.answers.slice() : [],
        correctIndex: Number.isInteger(q.correctIndex) ? q.correctIndex : 0,
        noRepeat: q.noRepeat !== false,
        category: q.category || null,
        categoryLabel: q.categoryLabel || q.category || null,
        difficulty: q.difficulty || null,
        section: q.section || null,
        sourceFile: q.sourceFile || null
      }));
      this.loaded = true;
      return this;
    }

    _assertLoaded() {
      if (!this.loaded) throw new Error("Call load() first");
    }

    getQuestionsByCategories(categories = []) {
      this._assertLoaded();
      const set = new Set((categories || []).map(c => normalize(c)));
      return this.questions.filter(q => set.has(normalize(q.category)));
    }

    prepareQuestion(question, shuffleRuntimeAnswers = false) {
      const q = deepClone(question);
      if (shuffleRuntimeAnswers && q.answers.length > 1) {
        const indexed = q.answers.map((text, index) => ({ text, wasCorrect: index === q.correctIndex }));
        const rng = mulberry32(hashString(`${q.id}|${q.prompt}|${q.answers.join("|")}`));
        const shuffled = shuffleWithRng(indexed, rng);
        q.answers = shuffled.map(x => x.text);
        q.correctIndex = shuffled.findIndex(x => x.wasCorrect);
      }
      return q;
    }
  }

  global.WGLTQuestionEngine = WGLTQuestionEngine;
})(window);
