/* Teaching-only target chooser: no network, scan, or shell execution. */
document.addEventListener("DOMContentLoaded", () => {
  const select=document.getElementById("target-choice");
  const output=document.getElementById("target-answer");
  if (!select || !output) return;
  const choices = {
    checkout: { title:"適合從 trivy fs 開始。", desc:"Trivy 在目前執行位置讀取已 Checkout 的檔案。這不需要再次連到 GitHub 才能讀取本機 workspace。",command:"trivy fs --scanners vuln ." },
    git: {title:"適合從 trivy repo 開始。",desc:"它從 Git Repository 取得內容，不會幫你執行 Docker build。私有 Repo 要有適當的認證。",command:"trivy repo --scanners vuln <REPO_URL>"},
    docker:{title:"適合從 trivy image 開始。",desc:"限制 Image 來源為本機 Docker Engine，必須能存取 Docker API。無須先執行容器。",command:"trivy image --image-src docker --scanners vuln demo-app:1.0"},
    harbor:{title:"適合從 trivy image 開始。",desc:"限制從遠端 Registry 讀取 Image；需能連線 Harbor 並提供適當身分認證。",command:"trivy image --image-src remote --scanners vuln registry.example.com/team/app:1.0"},
    sbom:{title:"適合從 trivy sbom 開始。",desc:"輸入是現成的 SBOM，不是原始碼目錄或 Image；須使用 Trivy 支援的格式。",command:"trivy sbom --scanners vuln software.sbom.json"}
  };
  function render(){
    const item=choices[select.value]||choices.checkout;
    output.replaceChildren();
    const title=document.createElement("strong"); title.textContent=item.title;
    const desc=document.createElement("p"); desc.textContent=item.desc;
    const cmd=document.createElement("code"); cmd.textContent=item.command;
    output.append(title,desc,cmd);
  }
  select.addEventListener("change",render);
  render();
});