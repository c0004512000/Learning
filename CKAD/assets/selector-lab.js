(() => {
  const history=[];
  for(const task of document.querySelectorAll('[data-task]')){
    const button=task.querySelector('button[data-check]');
    const feedback=task.querySelector('[role=status]');
    let attempts=0;
    button.addEventListener('click',()=>{
      attempts++;
      const selected=[...task.querySelectorAll('input:checked')].map(x=>x.value).sort().join(',');
      const correct=selected===task.dataset.answer;
      feedback.className='feedback '+(correct?'success':'retry');
      feedback.textContent=(correct?'判斷正確。':'再比較一次。')+(correct?task.dataset.explanation:task.dataset.hint);
      history.push({task:task.dataset.task,attempt:attempts,selected:selected||'沒有選取',correct});
      renderSummary();
    });
  }
  const selector=document.querySelector('#selector');
  const env=document.querySelector('#env');
  function update(){
    const matched=[];
    for(const pod of document.querySelectorAll('[data-pod]')){
      const ok=pod.dataset.app===selector.value&&(!env.checked||pod.dataset.env==='prod');
      pod.classList.toggle('matched',ok);
      pod.querySelector('.status').textContent=ok?'符合選取條件':'不符合選取條件';
      if(ok)matched.push(pod.dataset.pod);
    }
    document.querySelector('#selector-code').textContent='selector:\n  app: '+selector.value+(env.checked?'\n  env: prod':'');
    document.querySelector('#match-result').textContent='目前符合：'+(matched.join('、')||'沒有 Pod')+'。這只判斷標籤，尚未測試連線。';
  }
  selector?.addEventListener('change',update);env?.addEventListener('change',update);if(selector)update();
  const summary=document.querySelector('#learning-summary');
  const reflection=document.querySelector('#reflection');
  function renderSummary(){if(!summary)return;summary.value='CKAD Learning｜Lesson 0001：Service 的標籤選取\n'+(history.length?history.map(x=>`${x.task} 第 ${x.attempt} 次：${x.selected}；${x.correct?'正確':'待修正'}`).join('\n'):'尚未提交練習。')+'\n我的說明：'+(reflection?.value||'尚未填寫')+'\n這是網頁判讀練習，尚未驗證真實叢集操作。';}
  reflection?.addEventListener('input',()=>{try{localStorage.setItem('ckad-0001-reflection',reflection.value)}catch{}renderSummary();});
  try{if(reflection)reflection.value=localStorage.getItem('ckad-0001-reflection')||'';}catch{}
  document.querySelector('#copy-summary')?.addEventListener('click',async()=>{renderSummary();const out=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(summary.value);out.textContent='已複製。回到原本的 ChatGPT 對話貼上即可。';}catch{summary.focus();summary.select();out.textContent='請長按文字並選擇複製。';}});
  renderSummary();
})();
