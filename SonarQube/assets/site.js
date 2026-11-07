
(function(){const root=document.documentElement,btn=document.querySelector('[data-theme-toggle]');let theme='dark';try{theme=localStorage.getItem('sq-theme')||'dark'}catch(e){}root.dataset.theme=theme;function redraw(){if(btn){btn.disabled=false;btn.textContent=root.dataset.theme==='dark'?'淺色模式':'深色模式'}}redraw();if(btn)btn.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('sq-theme',root.dataset.theme)}catch(e){}redraw()});for(const q of document.querySelectorAll('[data-quiz]')){const b=q.querySelector('[data-check]'),output=q.querySelector('[data-feedback]');if(!b||!output)continue;b.disabled=false;b.addEventListener('click',()=>{const marked=q.querySelector('input[type=radio]:checked');if(!marked){output.textContent='請先選一個答案。';output.className='feedback no';return}const ok=marked.value===q.dataset.correct;output.textContent=(ok?'正確。':'再想一次。')+q.dataset.explanation;output.className='feedback '+(ok?'ok':'no')})}})();

(function(){
  for(const lab of document.querySelectorAll('[data-policy-lab]')){
    const rule=lab.querySelector('[data-lab-rule]'),violation=lab.querySelector('[data-lab-violation]'),allowed=lab.querySelector('[data-lab-allow]');
    const count=lab.querySelector('[data-lab-issues]'),status=lab.querySelector('[data-lab-gate]'),reason=lab.querySelector('[data-lab-reason]');
    function render(){
      const active=rule.value==='on',hasViolation=violation.value==='yes',maxIssues=Number(allowed.value);
      const issues=Number(active&&hasViolation),pass=issues<=maxIssues;
      count.textContent=String(issues);status.textContent=pass?'PASS':'FAIL';status.className=pass?'result-good':'result-bad';
      let why=!active?'Rule 未啟用，因此這條規則不產生 Issue。':!hasViolation?'Rule 已啟用，但本次程式碼沒有違反，因此不產生 Issue。':'Rule 已啟用且程式碼違規，產生 1 個新 Issue。';
      reason.textContent=why+'自訂 Gate 容許最多 '+maxIssues+' 個 New Issues，所以 '+(pass?'PASS。':'FAIL。')+'（概念模擬，非真實掃描）';
    }
    for(const el of [rule,violation,allowed]){el.disabled=false;el.addEventListener('change',render);}
    render();
  }
})();
