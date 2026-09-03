document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    const feedback = quiz.querySelector(".feedback");
    quiz.querySelectorAll("button.choice").forEach((button) => {
      button.addEventListener("click", () => {
        quiz.querySelectorAll("button.choice").forEach((item) => item.classList.remove("correct", "incorrect"));
        const correct = button.dataset.correct === "true";
        button.classList.add(correct ? "correct" : "incorrect");
        feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
        feedback.textContent = correct
          ? (button.dataset.feedback || "正確。")
          : (button.dataset.feedback || "再回到上面的核心模型想一次。");
      });
    });
  });
});
