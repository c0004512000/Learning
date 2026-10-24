document.addEventListener('DOMContentLoaded', () => {
  const quizzes = [...document.querySelectorAll('.quiz[data-question]')];
  const attempts = new Map();
  for (const quiz of quizzes) {
    const feedback = quiz.querySelector('.feedback');
    quiz.querySelector('[data-check]').addEventListener('click', () => {
      const chosen = quiz.querySelector('input:checked');
      if (!chosen) {
        feedback.className = 'feedback';
        feedback.textContent = '先選一項，再檢查你的判斷。';
        return;
      }
      attempts.set(quiz.dataset.question, (attempts.get(quiz.dataset.question) || 0) + 1);
      const explanation = [...quiz.querySelectorAll('template[data-feedback]')]
        .find(item => item.dataset.feedback === chosen.value);
      feedback.className = 'feedback ' + (chosen.dataset.correct === 'true' ? 'success' : 'retry');
      feedback.textContent = explanation.content.textContent;
    });
    quiz.addEventListener('change', () => {
      feedback.className = 'feedback';
      feedback.textContent = '已修改選項，請再次檢查。';
    });
  }
  document.querySelector('#copy').addEventListener('click', async () => {
    const answers = quizzes.map((quiz, index) => {
      const chosen = quiz.querySelector('input:checked');
      return `第 ${index + 1} 題：${chosen ? chosen.closest('label').textContent.trim() : '未作答'}；檢查 ${attempts.get(quiz.dataset.question) || 0} 次`;
    });
    const result = ['CKA Lesson 01｜Kubernetes 的用途與邊界', ...answers,
      '我的說明：' + (document.querySelector('#reflection').value || '尚未填寫'),
      '本次為觀念練習，未驗證叢集操作能力。'].join('\n');
    const status = document.querySelector('#copied');
    try {
      await navigator.clipboard.writeText(result);
      document.querySelector('#export').hidden = true;
      status.textContent = '已複製，可以貼回對話。';
    } catch {
      const output = document.querySelector('#export');
      output.hidden = false;
      output.value = result;
      output.focus();
      output.select();
      status.textContent = '瀏覽器未允許自動複製，請複製下方已選取的文字。';
    }
  });
});
