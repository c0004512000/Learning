(() => {
  const root=document.documentElement;
  root.dataset.theme='dark';
  try {const saved=localStorage.getItem('learning-theme');if(['light','dark'].includes(saved))root.dataset.theme=saved;} catch {}
  document.addEventListener('DOMContentLoaded',()=>{
    const button=document.querySelector('.theme-toggle');if(!button)return;
    const label=()=>{button.textContent=root.dataset.theme==='dark'?'切換淺色':'切換深色';};label();
    button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('learning-theme',root.dataset.theme);}catch{}label();});
  });
})();
