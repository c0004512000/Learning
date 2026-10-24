# CKAD Resources

## Knowledge
- [CKAD 官方考綱](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/)：能力覆蓋與報考規則；報考前重新查核。
- [Labels and Selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)：標籤、AND 與額外標籤規則，用於第一課。
- [Service](https://kubernetes.io/docs/concepts/services-networking/service/)：以 selector 選取 Pod、維持後端集合與不含 selector 的邊界。

## Gaps
- 尚未收到本課作答；無法確認目前理解與操作熟練度。
- 真實叢集實作尚未驗證；後續能力需要按課程需要補充一手來源。

## Practice resources（2026-10-24 查核）
- [dgkanatsios/CKAD-exercises](https://github.com/dgkanatsios/CKAD-exercises)：MIT 授權社群備考題，非官方歷屆真題。README 保留舊領域分類及百分比，不作目前考綱依據。Services 題的舊 Endpoints 指令不直接沿用；本課使用 EndpointSlice 驗收。
- [Killercoda CKAD](https://killercoda.com/ckad)：社群情境與瀏覽器實作入口；COURSE 內容需會員，不假設全部免費。只在可免費使用且符合當前學習目標時採用；未驗證登入後手機終端體驗。
- [kubectl patch](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_patch/)：更新既有資源的官方語法。
- 第一課新增原創 selector 修復題：初次不限時，熟悉後 6 分鐘；有初始 YAML、限制、提示、解法、驗收與變化題。未在真實叢集執行，不宣稱 runtime 驗證通過。
