/* Reusable conceptual-interaction helpers; never claims to simulate a real Kernel. */
document.addEventListener("DOMContentLoaded",()=>{
const cases={
environment:{title:"測試環境能跑，正式環境卻缺套件",problem:"兩台 Server 的 Runtime、Library、設定不完全相同；更新時間也不同。",answer:"把程式及大量 User Space 依賴放入可版本化的 Image，讓環境更可重現，而不是每台機器手動安裝。",limit:"限制：Kernel、CPU 架構、外部服務、Secret 與環境設定仍可能不同。"},
dependency:{title:"A 更新系統函式庫，B 卻不能啟動",problem:"多個服務共用 Host 的 Library 或 Runtime，升級相依套件可能造成彼此干擾。",answer:"以各自的 Image 組合依賴與檔案，降低對 Host 全域套件版本的依賴。",limit:"限制：仍共用 Kernel，Image 自身也需要修補和更新。"},
delivery:{title:"每次發布都要重新設定 Server",problem:"部署步驟與機器狀態混在一起，回滾常需要反向操作手動安裝過程。",answer:"先 Build 成版本化 Image，再以同一個 Artifact 在不同環境啟動，提高交付一致性。",limit:"限制：配置、DB Migration、外部資源必須另行治理。"},
density:{title:"每個小型服務都需要一套 Guest OS",problem:"若每個工作負載各自使用 VM，需要分別管理 Guest Kernel、OS 啟動和更新。",answer:"Linux Container 共享 Kernel，通常能以較低的額外 OS 開銷建立更多執行單位。",limit:"限制：不是任何工作負載都適合共用 Kernel；安全隔離需求可能偏好 VM。"}
};
document.querySelectorAll("[data-case-button]").forEach(b=>b.addEventListener("click",()=>{
const v=cases[b.dataset.caseButton];if(!v)return;
document.querySelectorAll("[data-case-button]").forEach(el=>{el.classList.toggle("selected",el===b);el.setAttribute("aria-pressed",String(el===b))});
const data={title:v.title,problem:v.problem,answer:v.answer,limit:v.limit};Object.keys(data).forEach(k=>{const t=document.querySelector("[data-case-"+k+"]");if(t)t.textContent=data[k]});
}));
const paths={vm:{title:"VM：Application → Guest Kernel → 虛擬化 I/O → Host",steps:["程式呼叫 read()。","Guest Kernel 檢查並處理該系統呼叫。","需要存取虛擬磁碟時，透過虛擬裝置／Hypervisor 與 Host 底層互動。"],note:"不是每一次 read() 都真的走到實體磁碟，例如可能命中 Guest 的檔案快取。"},container:{title:"Container：Application → Shared Host Linux Kernel",steps:["Container 的 Process 呼叫 read()。","共享的 Host Kernel 直接收到 System Call。","Host Kernel 依照 Mount Namespace、權限與底層檔案系統等條件處理讀取。"],note:"dockerd、containerd、runc 不是每次 read() 系統呼叫都必須經過的代理。"}};
document.querySelectorAll("[data-arch-switch]").forEach(b=>b.addEventListener("click",()=>{const m=b.dataset.archSwitch,p=paths[m];if(!p)return;
document.querySelectorAll("[data-arch-switch]").forEach(el=>{el.classList.toggle("selected",el===b);el.setAttribute("aria-pressed",String(el===b))});
document.querySelectorAll("[data-arch-panel]").forEach(el=>el.classList.toggle("is-active",el.dataset.archPanel===m));
const t=document.querySelector("[data-arch-title]"),o=document.querySelector("[data-arch-steps]"),n=document.querySelector("[data-arch-note]");if(t)t.textContent=p.title;if(o){o.replaceChildren(...p.steps.map(x=>{const li=document.createElement("li");li.textContent=x;return li}))}if(n)n.textContent=p.note;
}));
});
