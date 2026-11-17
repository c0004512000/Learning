/* Shared @lfd retrieval practice; interaction works only after a learner selects an answer. */
document.addEventListener("DOMContentLoaded", () => {
  for (const quiz of document.querySelectorAll("[data-quiz]")) {
    const button = quiz.querySelector("[data-check]");
    const output = quiz.querySelector("[data-feedback]");
    if (!button || !output) continue;
    button.addEventListener("click", () => {
      const selected = quiz.querySelector('input[type="radio"]:checked');
      if (!selected) { output.textContent = "請先選擇一個答案，再確認。"; return; }
      const correct = selected.value === quiz.dataset.correct;
      output.textContent = (correct ? "答對了。" : "還沒答對。") + " " + (correct ? quiz.dataset.explanation : quiz.dataset.hint || "請回到前文，想一想資訊是在哪個步驟缺少的。");
      output.style.color = correct ? "var(--success)" : "var(--danger)";
      quiz.dataset.attempted = "true";
      if (!correct) return;
      button.textContent = "已完成本題練習";
      button.disabled = true;
    });
  }
});