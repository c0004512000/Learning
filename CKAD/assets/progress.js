const key='learning-ckad-v1';
let state={};
const message=document.querySelector('#save-status');
try{state=JSON.parse(localStorage.getItem(key)||'{}');if(!state||typeof state!=='object'||Array.isArray(state))state={}}catch{state={};if(message)message.textContent='瀏覽器無法讀取進度；本次仍可操作。'}
function render(){const boxes=[...document.querySelectorAll('[data-progress]')];const done=boxes.filter(x=>x.checked).length;const bar=document.querySelector('progress');if(bar){bar.max=boxes.length;bar.value=done}const text=document.querySelector('#progress-count');if(text)text.textContent=`${done} / ${boxes.length} 項完成（自我記錄）`;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));if(message)message.textContent='已儲存在這個瀏覽器；不會自動同步到其他裝置。'}catch{if(message)message.textContent='無法儲存，請匯出備份後再離開。'}render()}
document.querySelectorAll('[data-progress]').forEach(el=>{el.checked=state[el.dataset.progress]===true;el.addEventListener('change',()=>{state[el.dataset.progress]=el.checked;save()})});
document.querySelectorAll('[data-note]').forEach(el=>{el.value=typeof state[el.dataset.note]==='string'?state[el.dataset.note]:'';el.addEventListener('input',()=>{state[el.dataset.note]=el.value;save()})});
document.querySelector('#search')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.week').forEach(el=>el.hidden=!el.textContent.toLowerCase().includes(q))});
document.querySelector('#export')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,state},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ckad-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
document.querySelector('#import')?.addEventListener('change',async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(data.version!==1||!data.state||typeof data.state!=='object'||Array.isArray(data.state))throw Error();const safe={};for(const [k,v]of Object.entries(data.state)){if(/^w\d+-(read|lab|timed)$/.test(k)&&typeof v==='boolean'||k==='diagnostic-note'&&typeof v==='string')safe[k]=v}state={...state,...safe};save();location.reload()}catch{message.textContent='匯入失敗：請選擇本網站匯出的進度 JSON。'}});
render();
