/* Figure 01 and Figure 03: actual stateful diagrams with causal arrows. */
document.addEventListener("DOMContentLoaded",()=>{
  const cases={
    environment:{old:["Source code","交給不同 Server","Runtime / 系統套件不同"],new:["Source + Dependencies","Build → Image","在相容 Host 啟動"],point:"把應用程式及大量 User Space 依賴封裝成版本化 Image，降低環境漂移。",limit:"外部 DB、Secret、Kernel 與 CPU 架構仍可能不同。"},
    dependency:{old:["Service A 更新 Library","共用 Host 套件","Service B 意外故障"],new:["A 的獨立 Image","保留各自依賴","B 的執行環境不變"],point:"相依套件跟著各自的 Image 交付，減少服務間的版本相依。",limit:"仍共享 Host Kernel，也仍需定期更新 Image 裡的漏洞套件。"},
    delivery:{old:["每次交付 Source","逐台安裝與配置","機器狀態難重現"],new:["CI Build Image","Registry 保存版本","各環境 Pull 同一份"],point:"把部署單位從安裝步驟轉成版本化 Artifact，提升部署與回滾的一致性。",limit:"資料庫 Migration、環境變數、憑證仍要獨立治理。"},
    density:{old:["一個小型 API","一台 VM + Guest Kernel","每台都要管理 OS"],new:["多個 Container","共用 Host Kernel","較低額外 OS 開銷"],point:"共享 Kernel 讓多個工作負載通常更輕量，無須替每個都啟動 Guest Kernel。",limit:"高隔離需求仍可能選擇 VM，並非 Container 永遠更合適。"}
  };
  const updateText=(name,value)=>{const el=document.querySelector("[data-case-"+name+"]");if(el)el.textContent=value};
  document.querySelectorAll("[data-case-button]").forEach(button=>button.addEventListener("click",()=>{
    document.querySelectorAll("[data-case-button]").forEach(b=>{b.classList.toggle("selected",b===button);b.setAttribute("aria-pressed",String(b===button))});
    const c=cases[button.dataset.caseButton];if(!c)return;
    for(let i=0;i<3;i++){updateText("old-"+i,c.old[i]);updateText("new-"+i,c.new[i])}
    updateText("point",c.point);updateText("limit",c.limit);
  }));
  const flowEl=document.getElementById("flow-chain");
  if(!flowEl)return;
  const state={mode:"vm",cache:"miss",step:0};
  const n=(type,title,body,edge,why)=>({type,title,body,edge,why});
  const makeSteps=()=>{
    const vm=state.mode==="vm",hit=state.cache==="hit";
    const steps=[
      n("PROCESS","Application","已打開檔案，呼叫 read(fd)","System Call：請 Kernel 讀取資料","程式呼叫 read()；此時尚未涉及 Docker Daemon，也不一定碰到磁碟。"),
      n(vm?"GUEST":"HOST",vm?"Guest Kernel":"Host Linux Kernel",vm?"VM 的獨立 Kernel 收到 read()":"共享 Kernel 直接收到 read()", "VFS 查詢 Page Cache","接收呼叫的是 "+(vm?"Guest Kernel（不是 Host Kernel）":"Host Linux Kernel（不是 dockerd）")+"。Kernel 會先依檔案描述符與檔案系統狀態處理請求。")
    ];
    if(hit){
      steps.push(n("CACHE","Page Cache 命中","Kernel 取得快取中的檔案頁","回傳資料","命中 Page Cache 時不需要為這次讀取再發出儲存裝置 I/O。"));
    }else if(vm){
      steps.push(n("DEVICE","Virtual Block Device","Guest 向自己的虛擬磁碟提出 I/O","虛擬裝置請求","這一步是 VM 的虛擬硬體邊界；它不是 Application 直接呼叫 Host Kernel。"));
      steps.push(n("HYPERVISOR","Hypervisor / I/O Backend","把虛擬裝置請求對應至實際儲存路徑","後端存取資料","虛擬化 I/O 的處理方式會隨 Hypervisor、裝置模型和快取架構不同。"));
      steps.push(n("STORAGE","Storage Backend","讀取缺少的資料頁","資料送回 Guest Kernel","需要外部儲存 I/O，並非每次 read() 都一定發生。"));
    }else{
      steps.push(n("VFS","Host VFS / Filesystem","依 Mount 與權限等規則定位資料","Kernel 發起儲存 I/O","Linux Kernel 根據檔案描述符、檔案系統與掛載規則處理資料。"));
      steps.push(n("STORAGE","Storage Device","讀取缺少的資料頁","資料回到 Host Kernel","這次因為 Page Cache 未命中，Host Kernel 才需要向儲存裝置取得資料。"));
    }
    steps.push(n("RESULT","Application 收到資料","read() 回傳讀取的 Bytes",null,"資料最後回到發出 System Call 的 Process。"));
    return steps;
  };
  let steps=makeSteps();
  function render(){
    steps=makeSteps();state.step=Math.min(state.step,steps.length-1);
    const fragment=document.createDocumentFragment();
    steps.forEach((s,i)=>{
      if(i>0){
        const edge=document.createElement("div");edge.className="flow-connector"+(i<=state.step?" is-seen":"");
        const line=document.createElement("span");line.className="line";
        const label=document.createElement("span");label.className="edge-label";label.textContent=steps[i-1].edge;
        const point=document.createElement("span");point.className="point";
        edge.append(line,label,point);fragment.append(edge);
      }
      const item=document.createElement("div");
      item.className="flow-step kind-"+(s.type==="GUEST"?"guest":s.type==="HOST"?"kernel":"other")+(i<state.step?" is-seen":"")+(i===state.step?" is-active":"");
      if(i===state.step)item.setAttribute("aria-current","step");
      item.innerHTML='<span class="flow-type"></span><span class="flow-text"><strong></strong><span></span></span>';
      item.querySelector(".flow-type").textContent=s.type;
      item.querySelector(".flow-text strong").textContent=s.title;
      item.querySelector(".flow-text span").textContent=s.body;
      fragment.append(item);
    });
    flowEl.replaceChildren(fragment);
    document.getElementById("flow-index").textContent=(state.step+1)+" / "+steps.length;
    document.getElementById("flow-explanation").textContent=steps[state.step].why;
    document.getElementById("flow-prev").disabled=state.step===0;
    document.getElementById("flow-next").disabled=state.step===steps.length-1;
    document.getElementById("flow-next").textContent=state.step===steps.length-1?"已到最後一步":"下一步 →";
    document.getElementById("flow-identity").textContent=state.mode==="vm"?"System Call → Guest Kernel":"System Call → Host Linux Kernel";
    document.getElementById("flow-conclusion").textContent=state.mode==="vm"?
      "VM 的 Application 進入 Guest Kernel；只有需要實際 I/O 時才再走虛擬裝置／後端。":
      "Container 的 Application 直接進入共享 Host Kernel；dockerd 不在每次 read() 路徑上。";
    document.querySelectorAll("[data-flow-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.flowMode===state.mode)));
    document.querySelectorAll("[data-flow-cache]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.flowCache===state.cache)));
  }
  document.querySelectorAll("[data-flow-mode]").forEach(b=>b.addEventListener("click",()=>{state.mode=b.dataset.flowMode;state.step=0;render()}));
  document.querySelectorAll("[data-flow-cache]").forEach(b=>b.addEventListener("click",()=>{state.cache=b.dataset.flowCache;state.step=0;render()}));
  document.getElementById("flow-prev").addEventListener("click",()=>{state.step=Math.max(0,state.step-1);render()});
  document.getElementById("flow-next").addEventListener("click",()=>{state.step=Math.min(steps.length-1,state.step+1);render()});
  document.getElementById("flow-all").addEventListener("click",()=>{state.step=steps.length-1;render()});
  render();
});