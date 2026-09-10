/* Frontend OTel Learning Workspace — shared quiz widget
   Choices are shuffled at render time so answer position does not become a cue. */
(function () {
  function shuffleChoices(quizEl) {
    const container = quizEl.querySelector('.choices');
    if (!container || quizEl.hasAttribute('data-no-shuffle')) return;

    const buttons = Array.from(container.querySelectorAll('button.choice'));
    for (let i = buttons.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }
    buttons.forEach((button) => container.appendChild(button));
  }

  function initQuiz(quizEl) {
    shuffleChoices(quizEl);

    const buttons = quizEl.querySelectorAll('button.choice');
    const feedback = quizEl.querySelector('.feedback');
    let answered = false;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        const correct = btn.getAttribute('data-correct') === 'true';
        buttons.forEach((b) => {
          if (b.getAttribute('data-correct') === 'true') {
            b.classList.add('correct');
          } else if (b === btn) {
            b.classList.add('incorrect');
          }
          b.disabled = true;
        });

        if (feedback) {
          feedback.textContent = correct
            ? (btn.getAttribute('data-feedback-correct') || '✓ 正確！')
            : (btn.getAttribute('data-feedback-incorrect') || '✗ 再想想；正確答案已標示。');
          feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
        }
      });
    });
  }

  function initRecall(recallEl) {
    const input = recallEl.querySelector('input.blank');
    const btn = recallEl.querySelector('.check-btn');
    const feedback = recallEl.querySelector('.feedback');
    if (!input || !btn) return;

    const answers = (recallEl.getAttribute('data-answer') || '')
      .split('|')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    btn.addEventListener('click', () => {
      const val = input.value.trim().toLowerCase();
      const correct = answers.includes(val);
      if (feedback) {
        feedback.textContent = correct
          ? '✓ 正確！'
          : '✗ 正確答案：' + (recallEl.getAttribute('data-answer') || '');
        feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
      }
      input.style.borderBottomColor = correct ? 'var(--success)' : 'var(--fail)';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-quiz]').forEach(initQuiz);
    document.querySelectorAll('[data-recall]').forEach(initRecall);
  });
})();
