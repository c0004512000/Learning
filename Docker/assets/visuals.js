/* Session 01: a single purposeful interaction — compare deployment scenarios.
   Kernel / System Call diagrams are fully visible without interaction. */
document.addEventListener("DOMContentLoaded",()=>{
const cases={
environment:{old:["Source code","交給不同 Server","Runtime / 系統套件不同"],new:["Source + Dependencies","Build → Image","在相容 Host 啟動"],point:"把應用程式及大量 User Space 依賴封裝成版本化 Image，降低環境漂移。",limit:"外部 DB、Secret、Kernel 與 CPU 架構仍可能不同。"},
dependency:{old:["Service A 更新 Library","共用 Host 套件","Service B 意外故障"],new:["A 的獨立 Image","保留各自依賴","B 的執行環境不變"],point:"相依套件跟著各自的 Image 交付，減少服務間的版本相依。",limit:"仍共享 Host Kernel，也仍需定期更新 Image 裡的漏洞套件。"},
delivery:{old:["每次交付 Source","逐台安裝與配置","機器狀態難重現"],new:["CI Build Image","Registry 保存版本","各環境 Pull 同一份"],point:"把部署單位從安裝步驟轉成版本化 Artifact，提升部署與回滾的一致性。",limit:"資料庫 Migration、環境變數、憑證仍要獨立治理。"},
density:{old:["一個小型 API","一台 VM + Guest Kernel","每台都要管理 OS"],new:["多個 Container","共用 Host Kernel","較低額外 OS 開銷"],point:"共享 Kernel 讓多個工作負載通常更輕量，無須替每個都啟動 Guest Kernel。",limit:"高隔離需求仍可能選擇 VM，並非 Container 永遠更合適。"}
};
const field=(name,value)=>{const el=document.querySelector("[data-case-"+name+"]");if(el)el.textContent=value};
document.querySelectorAll("[data-case-button]").forEach(b=>b.addEventListener("click",()=>{
  const c=cases[b.dataset.caseButton];if(!c)return;
  document.querySelectorAll("[data-case-button]").forEach(x=>{x.classList.toggle("selected",x===b);x.setAttribute("aria-pressed",String(x===b))});
  for(let i=0;i<3;i++){field("old-"+i,c.old[i]);field("new-"+i,c.new[i])}
  field("point",c.point);field("limit",c.limit);
}));
});