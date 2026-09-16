# `data-link-name`：Foreman / Faro source investigation

## 查證範圍與可重現證據

查證日期：2026-09-17（Asia/Taipei）。直接讀取實際 source 與 Git objects；既有 Learning 記錄只作待核對的 claims，不拿它們取代 source proof。

| Source | 本次實際查證 revision |
|---|---|
| `garmin-tw-mfg-eng/XD-Foreman-Assistant` | `4e032babef7aa30e5d13d7a506abe208945a5dee`；本機 checkout `main`，可達歷史 48 commits、132 tracked files |
| `garmin-tw-mfg-eng/faro-click-tracking` | `937d4a32e725877188a8d8a223529dece0449d4d`；本機 checkout `main`，可達歷史 104 commits、101 tracked files |
| `grafana/faro-web-sdk` | lockfile 所用 `2.9.0`；tag `v2.9.0` → `6529bc47fe7fa1d39ca971d7f0f8e0432f49edac` |
| `primefaces/primeng` | lockfile 所用 `18.0.2`；`aaef4d94aabcbdbc58e0d523a52f23ae05660810` |
| `grafana/alloy` | `v1.18.0` → `a435563ff073d5355952c1a8d1821110b1392691`；版本來自前次 runtime evidence，本次沒有重查 deployment |
| OTel Collector Contrib Faro receiver / translator | Alloy `go.mod` 指向 `v0.153.0` → `42f949127580c0d00088b785cd0b35842dc0ddb8` |
| `TW-None-Prod-Microservices` | 本機 checkout `a59a4c45dd6bb2e0f8823827e0c878956d93935c`，stage desired configuration |

**目前遠端 Foreman / 公司 Faro `main` 的 HEAD：Unknown。** GitHub connector 的 commit/file GET 回傳 404；這不能證明 repo 被刪除。本次上述兩份 source 是 2026-09-12 留下的完整 checkout，不能宣稱它們是 2026-09-17 最新遠端 HEAD。

後續依 learner 指示透過 WSL 再查：Linux Git 的 `rev-list`、`log -S data-link-name` 與 parent `git grep` 覆核了上述歷史。WSL 直接 GitHub HTTPS 連線逾時；讀取 WSL 既有 `gh` credential 後透過 Windows HTTP client 查詢兩個公司 repos 的 `commits/main`，仍均回傳 404。因此遠端 HEAD 保持 Unknown；本次確實已使用 WSL Git，不把認證可讀等同 repo access 成功。

本機 source root：`C:/Users/fbrandon/AppData/Local/Temp/otel-evidence-4af127607e6548f2ac9afe12c53a27e2/{foreman,faro,micro}`。Git pack/index 以 PowerShell / .NET 讀取，重建 delta 後驗證 Git object SHA-1；逐檔比較 worktree 與 HEAD，忽略 Windows checkout 的 CRLF/LF 差異後，Foreman 132 files、Faro 101 files 都沒有內容差異。沒有新增安裝軟體，沒有呼叫 Git / Node / Docker 的 Windows executable。

附件：

- [完整七組搜尋結果](data-link-name-search-inventory-2026-09-17.md)：Foreman / Faro 全部 tracked worktree files，及修改前的 Learning text files；含 docs、specs、tests，不只 `src/`。
- [逐一 clickable template inventory](data-link-name-clickable-inventory-2026-09-17.md)：每個開頭 tag 的 path、line、exact snippet、標記狀態；另包含 input、selection、tabs、toggler 等 UI declarations。
- [全部可達 commits 的 attribute inventory](data-link-name-history-2026-09-17.csv)：152 commits 的 parent、日期、含 literal 的 files、含 literal 的 source files。所有歷史 blob 都有搜尋，不只 commit message。

以下 Foreman 的 `F/` 表示 repo root 下 `foreman-assistant/`；Faro 的 `C/` 表示 `src/faro-click-tracking/`。所有「目前實作」均指上表 pinned source。

## 1. 導入前原本就有 `data-link-name` 嗎？

**在已查證的 Foreman 可達歷史中：沒有。這個 attribute 與 Faro 導入一起加入。原本存在的是 subsystem / i18n identifiers，不能把 identifier 的歷史誤當成 DOM attribute 的歷史。**

首次包含 literal 的 Foreman commit：[`f4a3688d3beed8f8448b78583cd93985884cff23`](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/commit/f4a3688d3beed8f8448b78583cd93985884cff23)，2026-08-20 10:01:22 +08:00，title：

```text
Integrate faro-click-tracking for real user monitoring (#21)
parent a06bfe22d34f7d446ffffa42e53123330505ebf8
* feat: integrate Faro click tracking and add data-link attributes for user guidance
```

48 個可達 commits 中，只有這個 commit 與後續 HEAD 含 `data-link-name`；其餘 46 個都没有。不是只用 commit message 推論：已讀取每個 commit 的全部 tree/blob 搜尋 literal，且比較 introduction 與 parent。

`F/src/app/layout/main/main.component.html`，parent 與 introduction 的同一位置：

```diff
 [pTooltip]="getSystemTooltip(item)"
+[attr.data-link-name]="item.subsystem"
 (onClick)="openSystemLink(panel.topic, item)"
```

`F/src/app/shared/toolbar/toolbar.component.html`，同一次加入的五行：

```diff
+data-link-name="UserGuide.UserGuide"
+data-link-name="ReferenceDocument.SDS"
+data-link-name="ReferenceDocument.AI"
+data-link-name="ReferenceDocument.ForemanManual"
+data-link-name="Contact.ContactAdministrator"
```

`F/src/main.ts` 也在該 commit 加入 init/config：

```ts
import { initFaro, type FaroUserInfo } from '@sre2/faro-click-tracking';
initFaro({
  // ...
  trackAttributes: ['data-link-name'],
  enableDeviceTypeDetection: true
});
```

相對地，parent 的 `F/src/app/data/types/general.ts` 與 `F/src/app/layout/main/main.component.ts` 已有：

```ts
export enum Subsytem {
  NA,
  DailySchedule,
  // ...
}
// setPanelList():
subsystem: Subsytem[Subsytem.DailySchedule],
// existing business web-log path:
this.insertForemanWebLog(topic, system.subsystem);
```

`Subsytem` 的拼字就是 source 中的拼字。這證明既有 stable identifier 被新 attribute 沿用。PR #21 保存為單一 parent commit；其未保存的 feature branch 內「哪一個中間 commit 最早寫下 attribute」：**Unknown**。本調查也不涵蓋未取得的其他 branches、不可達 commits 或 repo 以外的 source。

## 2. 名稱最早在哪裡定義？何時真正實作與 render？

必須分成四個時間點：

| 階段 | 最早可達 source proof |
|---|---|
| Faro repo 中首次出現名稱 | `7d8427b5fb147a29234fb6b3cbeba5138db24a0a`，2026-08-06 11:30:00 +08:00；只有設計文件新增 literal，尚未進入 implementation |
| Faro 首次實作讀取規則 | `bd4c040a55ccdf8be30c659978c7bba5f2c5c4d0`，2026-08-06 11:31:14 +08:00；`src/clickInstrumentation.ts`、test |
| Foreman 首次宣告 DOM attribute | 上述 PR #21 commit，2026-08-20；main / toolbar HTML 同一 commit 加入 |
| 瀏覽器首次真正建立 attribute 的時刻 | **Unknown**；Git source 只能定位 render declaration，無首次部署/首次 DOM execution trace |

最早設計文件 [`openspec/changes/link-name-data-attribute/proposal.md`](https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/7d8427b5fb147a29234fb6b3cbeba5138db24a0a/openspec/changes/link-name-data-attribute/proposal.md)：

```md
- `ClickInstrumentation` 新增「`data-link-name` attribute 覆寫」規則
- 使用端影響（非 breaking）：宿主專案可選擇性在需要穩定命名的元素上標記 `data-link-name`
```

完整原文另明確記錄：後續 Foreman 會在自己的 repo 標記 main tiles 與 toolbar links。這是設計文件的計畫；落地證明仍是 Foreman commit/tree 比對。

首次 implementation [`src/clickInstrumentation.ts`](https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/bd4c040a55ccdf8be30c659978c7bba5f2c5c4d0/src/clickInstrumentation.ts)：

```ts
const LINK_NAME_ATTRIBUTE = 'data-link-name';
function getOverrideLinkName(element: Element): string | undefined {
  const marked = element.closest(`[${LINK_NAME_ATTRIBUTE}]`);
  if (marked === null) {
    return undefined;
  }
  return (marked.getAttribute(LINK_NAME_ATTRIBUTE) ?? '').trim();
}
```

這是歷史規則，不能套用到 release snapshot：当時有 trim 與 text fallback；目前已改為 generic attribute extraction，沒有 value trim/text fallback，見 §8。

**Faro 初始 implementation 沒有此 attribute。** [`src/clickInstrumentation.ts` at `ca043905366203c4f7dfae35b4f097e870201c36`](https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/ca043905366203c4f7dfae35b4f097e870201c36/src/clickInstrumentation.ts)：

```ts
const linkName = getDirectTextContent(target);
if (linkName === '') {
  return;
}
// ...
this.api.pushEvent(CLICK_EVENT_NAME, { link_name: linkName });
```

此時沒有 `trackAttributes` / `data-link-name` contract；這是既有 Learning evidence 必須更正的歷史錯誤。

## 3–5. 全部 Foreman render 位置、component、value source

總計 **6 個 template declarations**，不是 6 個 runtime DOM nodes。`main.component.html` 的 `*ngFor` 可 render 多顆 tile；`*ngIf` 會改變實際顯示數量。

### A. Main subsystem 入口

Source：[`F/src/app/layout/main/main.component.html:40–51`](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/main.component.html#L40)。Owning component：`F/src/app/layout/main/main.component.ts:47–73`，`selector: 'app-main'`、`templateUrl: './main.component.html'`。

```html
<div *ngFor="let item of page.items">
  <p *ngIf="item.isNeedDisplay" class="w-full border-b">
    <p-button
      variant="text"
      styleClass="w-full text-left justify-start p-2"
      [pTooltip]="getSystemTooltip(item)"
      [attr.data-link-name]="item.subsystem"
      (onClick)="openSystemLink(panel.topic, item)"
    >
```

DOM placement：`<p-button>` component host。Value 直接來自 `item.subsystem`，不是 `href`、`webLink`、translated title 或 router name。

上游值的產生位置：[`F/src/app/layout/main/main.component.ts:305–525`](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/main.component.ts#L305) 的 `setPanelList()`：

```ts
items: [
  {
    subsystem: Subsytem[Subsytem.DailySchedule],
    ...this.selectedLineResourceInfo?.dailyScheduleSysInfo
      ?.systemSummary,
  },
  {
    subsystem: Subsytem[Subsytem.SystemNotes],
    ...this.selectedLineResourceInfo?.systemNotesSysInfo
      ?.systemSummary,
  },
  // ...
]
```

`F/src/app/data/types/general.ts:43–80` 定義 numeric enum `Subsytem`。Source 明確列出以下 **35 個 configured entries**（由這些 enum member 建立 subsystem identifier）；這是 source configuration，不是 35 個已在 live deployment 顯示的值：

| Panel topic | `setPanelList()` 的 configured subsystem entries |
|---|---|
| ProductionPreparation，305–347 | DailySchedule、SystemNotes、MachineMaintenance、VIP、AuxiliaryMaterials、Handover |
| MaterialManagement，349–392 | ESNLabel、MaterialTracking、JobWorkflowApproval、FindPart、WarehouseManagement、InventoryOperations、FifoToolkit |
| ProductionManagement，394–435 | WeeklyInbound、WIP、LineController、HourlyProductionUnits、JobStatus、JobAnalysis、APS |
| AbnormalManagement，437–477 | IPQCPortal、MFGPortal、CFT、EfficiencyAbnormalReport、Console、FacilityMaintenance、FixtureCheckInOut |
| PersonnelManagement，479–524 | Attendance、ManualWorkHourReporting、LCHourReporting、OvertimeSystem、LeaveSystem、ESDRecord、LaborPerformance、OperatorPreAssignment |

資料 spread 在 `subsystem` 之後。`F/src/app/data/types/aggregation-info.ts:66–72` 的 `SystemSummary` 定義沒有 `subsystem`：

```ts
export interface SystemSummary {
  lightStatus: string;
  isNeedDisplay: boolean;
  sysStatus: string;
  webLink: string;
  updateTime?: Date;
}
```

可證實 declared origin 是 enum；若要保證 backend JSON 永遠沒有額外欄位覆寫、某個 identifier 在某環境實際 render、對應哪個 URL，仍須 API / live DOM evidence，**Unknown**。不能把 source entry list 當成 live menu inventory。

顯示與導航的 source 分開取值：

```html
<!-- main.component.html:67 -->
<span>{{ item.subsystem + ".Title" | translate }}</span>
```

```ts
// main.component.ts:547–554
openSystemLink(topic: string, system: any): void {
  if (system.sysStatus === SystemStatus[SystemStatus.ExternalLink]) {
    window.open(system.webLink, '_blank');
  } else {
    window.location.replace(system.webLink);
  }
  this.insertForemanWebLog(topic, system.subsystem);
}
```

因此 title 是 translated text，navigation destination 是 `webLink`，tracking identity 是 subsystem。三者沒有在 Faro extraction 中互相推導。

### B–F. Toolbar 的五個固定值

Owning component：`F/src/app/shared/toolbar/toolbar.component.ts:15–23`，`selector: 'app-toolbar'`、`templateUrl: './toolbar.component.html'`。全部都在 `<p-drawer>` 的 content template 內，attribute 直接放在 `<p-button>` host。

| Source | DOM / 功能 | Value source 與語意 |
|---|---|---|
| `F/src/app/shared/toolbar/toolbar.component.html:81–93` | UserGuide fieldset 的 `<p-button>` | 固定字串 `UserGuide.UserGuide`，同時是 label 使用的 i18n key；開啟 guide URL |
| 同檔 99–111 | ReferenceDocument fieldset 的 `<p-button *ngIf="showSdsButton">` | 固定字串 `ReferenceDocument.SDS`，同時是 i18n key；開啟 `sdsURL` |
| 同檔 112–123 | ReferenceDocument fieldset 的 `<p-button>` | 固定字串 `ReferenceDocument.AI`，同時是 i18n key；開啟 AI URL |
| 同檔 124–135 | ReferenceDocument fieldset 的 `<p-button>` | 固定字串 `ReferenceDocument.ForemanManual`，同時是 i18n key；開啟 manual URL |
| 同檔 138–145 | Contact fieldset 的 `<p-button>` | 固定字串 `Contact.ContactAdministrator`，同時是 i18n key；觸發 contact action |

每一個使用位置的 exact relevant snippet：

```html
<!-- toolbar.component.html:85–88 -->
label="{{ 'UserGuide.UserGuide' | translate }}"
data-link-name="UserGuide.UserGuide"
(onClick)="
  linkToExternalURL(
    'https://confluence.garmin.com/pages/viewpage.action?pageId=1789675744'
  )
"
```

```html
<!-- toolbar.component.html:100–110 -->
*ngIf="showSdsButton"
label="{{ 'ReferenceDocument.SDS' | translate }}"
data-link-name="ReferenceDocument.SDS"
(onClick)="
  linkToExternalURL(
    sdsURL
  )
"
```

```html
<!-- toolbar.component.html:116–122 -->
label="{{ 'ReferenceDocument.AI' | translate }}"
data-link-name="ReferenceDocument.AI"
(onClick)="
  linkToExternalURL(
    'http://linxpa-dl01.garmin.com:9567/?employee_id=' + employee?.empID
  )
"
```

```html
<!-- toolbar.component.html:128–134 -->
label="{{ 'ReferenceDocument.ForemanManual' | translate }}"
data-link-name="ReferenceDocument.ForemanManual"
(onClick)="
  linkToExternalURL(
    'https://t1moss.garmin.com/HR/HR_SSC/SitePages/%E9%A0%98%E7%8F%AD%E6%89%8B%E5%86%8A.aspx'
  )
"
```

```html
<!-- toolbar.component.html:142–144 -->
label="{{ 'Contact.ContactAdministrator' | translate }}"
data-link-name="Contact.ContactAdministrator"
(onClick)="contactAdministrator()"
```

這些片段挑選原始 attribute lines；不是把中間 omitted attributes 假裝成完整 opening tag。完整 `<p-button ...>` 原文保存在 clickable 附件。導航 functions：[`F/src/app/shared/toolbar/toolbar.component.ts:49–55,133–151`](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.ts#L133)：

```ts
get showSdsButton(): boolean {
  return environment.hasChemicalMgmt;
}
get sdsURL(): string {
  return `${environment.k8sURL}/chemical-mgmt/#/sds-document-overview`;
}
linkToExternalURL(url: string) {
  window.open(url, '_blank');
}
contactAdministrator(): void {
  const email = this.translate.instant('Contact.AdministratorEmail');
  const subject = this.translate.instant('Contact.Subject');
  this.linkToExternalURL(`mailto:${email}?Subject=${subject}`);
}
```

SDS 的 URL 依 environment 產生；tracking value 仍是固定字串。Contact 的 value 不是 email address，也不是 `mailto:` URL。

### Host 如何成為可追蹤 DOM ancestor？

PrimeNG [`packages/primeng/src/button/button.ts:429–480`](https://github.com/primefaces/primeng/blob/aaef4d94aabcbdbc58e0d523a52f23ae05660810/packages/primeng/src/button/button.ts#L429)：

```ts
@Component({
  selector: 'p-button',
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
      <!-- ... icon / label templates ... -->
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
```

這是有省略的 source excerpt。Foreman 是在 host 宣告 attribute；這份 PrimeNG template 沒有把 `data-link-name` forward 到 inner button。Inner button / projected icon / span 可以經 DOM ancestor 找回 marked host；這不等於它們自身都有 attribute。

```text
p-button[data-link-name]  ← closest() 找到標記
  └─ button              ← PrimeNG render
      └─ span / icon     ← 可以是 event.target
```

Source 证明上述 component render path；不是所有 wrappers / portals / future versions 的保證。

## 6. `data-link-name` 的語意

**Foreman 使用的是穩定、與顯示語系分離的 interaction identity。各位置的具體語意不同：main 是 subsystem identifier，toolbar 是功能/文件/contact action 的固定 i18n-style identifier。**

Source proof 是 §3–5 的 binding、label、handlers。它沒有使用 `<a href>` 的名稱取值，也沒有從 Angular route 自動生成 value：

```ts
// F/src/app/app.routes.ts:8–25
path: PageName.Login,
component: LoginComponent,
// ...
path: PageName.Main,
component: MainComponent,
```

```ts
// F/src/app/data/types/general.ts:6–10
export enum PageName {
  Root = '',
  Login = 'login',
  Main = 'main',
}
```

這些 route identifiers 與 main 的 `item.subsystem` 是不同 source fields。Source 沒有 `routeName → data-link-name` 自動 mapping。

Package 層則是 **generic DOM attribute extraction**，沒有 HTML hyperlink / button tag filter：

```ts
// C/src/features/click/clickInstrumentation.ts:37,69–73
const marked = element.closest(`[${attributeName}]`);
for (const attributeName of this.trackAttributes) {
  const value = getTrackedAttributeValue(target, attributeName);
  if (value !== undefined) {
    payload[toPayloadKey(attributeName)] = value;
  }
}
```

可證實它接受各種 marked element/ancestor，包含普通容器；沒有檢查該 element 是否「真正 clickable」。`link_name` 只因 host configured name 是 `data-link-name` 而由 key normalization 得到；目前 package 不知道 subsystem、文件、feature 或 route 的業務含義。

## 7. 哪些 clickable elements 有 / 沒有標記？

完整逐一 source proof 見 [clickable 附件](data-link-name-clickable-inventory-2026-09-17.md)，不要把以下 template counts 讀成 runtime coverage 百分比。

| 種類 | Template declarations | 自身有 `data-link-name` |
|---|---:|---:|
| `<p-button>` | 48 | 6（main 1 + toolbar 5） |
| Native `<button>` | 2 | 0 |
| Native `<a>` | 2 | 0 |

42 個未標記的 `<p-button>` 包含 login、toolbar 的選單/返回/settings、feature 的 edit/save/cancel/update controls、dialog save/cancel、table column toggles。附件提供每一個 tag 的 handler / label 原文，沒有只列 count。

特別的未標記例子：

```html
<!-- F/src/app/shared/toolbar/toolbar.component.html:6–10 -->
<p-button
  *ngIf="!showBackBtn"
  icon="pi pi-bars"
  size="large"
  (onClick)="visibleSidebar = true"
></p-button>
```

```html
<!-- F/src/app/layout/main/system/job-analysis/job-analysis.component.html:127–130 -->
<a
  class="cursor-pointer"
  (click)="linkToCheckOutURL(rowData.jobNumber)"
>
```

```html
<!-- F/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:234 -->
<button *ngIf="isLongNote(rowData.note.currentValue)">
```

還有 `attendance.component.html:154–161` 的 abnormal-detail `<a (click)>`、daily-schedule 204–214/252–259 的 clickable `<div>`、`field-togglechip.component.html:1–6` 的 `<p-chip (click)="toggleValue()">`，都沒有此 attribute。

其他 selection/generated-click UI 宣告也沒有 `data-link-name`：toolbar user splitbutton、language select、note reason select、field selectbutton/multiselect、login tabs、line-selector tabs、tree table toggler、table settings 的 chip filters，以及 input fields。它們的 source declarations 在附件逐一保留；PrimeNG 生成的全部 live DOM clickable nodes/disabled states 本次沒有 runtime 枚舉，**Unknown**。

`F/src/app/shared/line-selector/line-selector.component.html:36–40` 有另一個 data attribute：

```html
<p-tab
  *ngFor="let info of tabInfo.lineResources"
  [value]="info.lineResource"
  [attr.data-red-light-count]="info.redLightCount"
>
```

它不是 `data-link-name`，也不在 Foreman `trackAttributes` 清單中；不會因為「也是 data-*」就成為本次 click payload。

**自身沒有 attribute ≠ extraction 一定失敗。** §5 的 inner button / span 就是反例。只有 target 到 ancestors 都沒有 configured attribute 時，這個 ClickInstrumentation 才建立空 payload 而 return。對上述 feature/dialog/list controls，source 沒有宣告它們的 tracked identity；是否有 runtime 動態增添標記、其他 instrumentation 或後端收到其他 signals，不由這份 source inventory 保證。

## 8. Listener 與 extraction：實際採用哪一種實作？

Source：[`C/src/features/click/clickInstrumentation.ts:35–97`](https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/937d4a32e725877188a8d8a223529dece0449d4d/src/faro-click-tracking/src/features/click/clickInstrumentation.ts#L35)。

```ts
initialize(): void {
  document.addEventListener('click', this.handleClick);
}
destroy(): void {
  document.removeEventListener('click', this.handleClick);
}
```

沒有 options/capture flag，為 document bubbling listener。沒有逐個元素註冊 listener、沒有 `querySelectorAll('[data-link-name]')`。它接收的是傳到這個 listener 的 click；不能教成所有 clicks 一定被觀察。

```ts
private handleClick = (event: MouseEvent): void => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const payload: Record<string, string> = {};
  for (const attributeName of this.trackAttributes) {
    const value = getTrackedAttributeValue(target, attributeName);
    if (value !== undefined) {
      payload[toPayloadKey(attributeName)] = value;
    }
  }
  if (Object.keys(payload).length === 0) {
    return;
  }
  // ... target-based 300ms throttle ...
  this.api.pushEvent(CLICK_EVENT_NAME, payload);
};
```

```ts
function getTrackedAttributeValue(element: Element, attributeName: string): string | undefined {
  const marked = element.closest(`[${attributeName}]`);
  if (marked === null) {
    return undefined;
  }
  return marked.getAttribute(attributeName) ?? undefined;
}
export function toPayloadKey(attributeName: string): string {
  return attributeName.replace(/^data-/, '').replace(/-/g, '_');
}
```

Foreman 只配置 `data-link-name`，所以 runtime 等效查找 `[data-link-name]`，但 source 實際使用的是泛用的 `[${attributeName}]`。

已證實的邊界：

- `closest()` 從 target 自身開始，找最近 marked ancestor；不從 `currentTarget` 開始，也不往 children 搜尋。
- 多個 configured attributes 會獨立查找，可能取自不同 ancestors；Foreman 此版本只有一個。
- normalization 只改 **key**，不改 **value**。目前沒有 `.trim()`、翻譯、lowercase、讀取 `textContent` / `href` / route 的 fallback。
- 原始 value `''` 仍非 `undefined`，會得到 `{ link_name: '' }`；「空 payload 不送」不等於「空 attribute value 不送」。這是目前 code 的直接分支結果，沒有本次 runtime measurement。
- `this.lastSentAt = new WeakMap<EventTarget, number>()`、`now - lastSent < 300` 是同一實際 target 的 throttle；不是按 `link_name` 或 marked host 去重。
- Faro SDK 之後還有自身的 dedupe / buffering 邏輯，見 §9。因此 package 呼叫 `pushEvent()` 不等於每次都产生新的 HTTP POST。

Source 實際存在阻止 bubbling 的 handlers：`F/src/app/shared/table-settings/table-settings.component.ts:38–52`：

```ts
toggleVisible(col: TableColumn, event: Event) {
  // ...
  event.stopPropagation();
}
toggleFrozen(col: TableColumn, event: Event) {
  // ...
  event.stopPropagation();
}
```

對應 template 的 column visibility/frozen `<p-button (onClick)>` 見附件。這是「global listener」不能改寫成「無條件收到全部 click」的實際 source 邊界。

## 9. 完整資料流：DOM → Faro → Alloy

### 9.1 Host config → instrumentation

`F/src/main.ts:11–34`：`trackAttributes: ['data-link-name']`，init 在 bootstrap 前。

`C/src/initFaro/initFaro.ts:112–132`：

```ts
validateTrackAttributes(config.trackAttributes);
const collectorUrl = resolveCollectorUrl(config.environment);
const faro = initializeFaro({
  url: collectorUrl,
  app: { ...config.app, environment: config.environment },
  instrumentations: [
    // ...
    new ClickInstrumentation({
      trackAttributes: config.trackAttributes,
    }),
    // ...
  ],
});
```

Validation 在同檔 81–102 檢查 `name.startsWith('data-')` 與 normalized keys 去重。DOM 上有 attribute，仍必須讓 host 配置追蹤它。

SDK 如何真正注入 API 並執行 listener registration，也有 source proof。[`grafana/faro-web-sdk/packages/core/src/instrumentations/initialize.ts:42–47`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/core/src/instrumentations/initialize.ts#L42)：

```ts
newInstrumentation.api = api;
instrumentations.push(newInstrumentation);
newInstrumentation.initialize();
```

`packages/web-sdk/src/initialize.ts:7–14` 將 browser config 經 `makeCoreConfig()` 傳入 core initializer；core `packages/core/src/initialize.ts:35` 呼叫 `registerInitialInstrumentations(faro)`，後者在 `packages/core/src/instrumentations/registerInitial.ts` 將 config instrumentations 傳給 `faro.instrumentations.add()`。這條 lifecycle 接線使公司 package 的 `initialize()` 註冊 document listener，並讓其 `this.api.pushEvent` 使用 SDK API。

```ts
// packages/core/src/instrumentations/registerInitial.ts:3–5
export function registerInitialInstrumentations(faro: Faro): void {
  faro.instrumentations.add(...faro.config.instrumentations);
}
```

這裡的「一個 listener」只描述 ClickInstrumentation 自己的 registration。Foreman 也配置 `getUser`，所以 `C/src/features/user/userSync.ts:60–64` 另有 `document.addEventListener('click', this.sync)`；不能宣稱整個 application 只有一個 click callback。

### 9.2 DOM → click → key/value payload

§5 的 template 建立 host attribute；PrimeNG inner native button 的 `(click)="onClick.emit($event)"` 呼叫 business handler；同一 DOM click 若繼續 bubbling 到 document，§8 listener 從 `event.target` 查找與取值。

```text
DOM attribute name: data-link-name
DOM attribute value: item.subsystem / toolbar 固定字串
        │ closest() 定位 host；getAttribute() 讀原值
        ▼
payload[toPayloadKey('data-link-name')] = 原值
        │ remove data-；replace '-' with '_'
        ▼
{ link_name: 原值 }
        │ this.api.pushEvent('click', payload)
        ▼
Faro SDK event API
```

這條鏈不會自行生成 DOM attribute。Faro tests 中 `setAttribute()` / HTML examples 是測試 fixture / examples，不是 production instrumentation 幫 Foreman 建立標記；全部搜尋位置可見搜尋附件。

### 9.3 Faro event API → transport item

[`grafana/faro-web-sdk/packages/core/src/api/events/initialize.ts:33–84`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/core/src/api/events/initialize.ts#L33)：

```ts
const attrs = stringifyObjectValues(attributes);
const item: TransportItem<EventEvent> = {
  meta: metas.value,
  payload: customPayloadTransformer({
    name,
    domain: domain ?? config.eventDomain,
    attributes: isEmpty(attrs) ? undefined : attrs,
    timestamp: timestampOverwriteMs ? timestampToIsoString(timestampOverwriteMs) : getCurrentTimestamp(),
    trace: spanContext ? /* ... */ : tracesApi.getTraceContext(),
  }),
  type: TransportItemType.EVENT,
};
// ... dedupe branch ...
if (!addItemToUserActionBuffer(userActionsApi.getActiveUserAction(), item)) {
  transports.execute(item);
}
```

片段內 trace ternary 刻意省略其 object fields，不是可直接貼去執行的完整函式。Attributes 來源仍是 package 的 `{ link_name: value }`；metas 是其他 context 路徑。

同檔的 `if (!skipDedupe && config.dedupe && ... deepEqual(testingPayload, lastPayload)) return` 可抑制相同 event；`packages/web-sdk/src/config/makeCoreConfig.ts:52` 預設 `dedupe = true`。不要把 package 的「超过 300ms 会再呼叫 pushEvent」直接教成 SDK 保證「再送一個 POST」。

### 9.4 Transport item → Faro JSON POST

[`packages/core/src/transports/const.ts:18`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/core/src/transports/const.ts#L18)：

```ts
[TransportItemType.EVENT]: 'events',
```

[`packages/core/src/transports/utils.ts:36–60`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/core/src/transports/utils.ts#L36)：

```ts
body.meta = item[0].meta;
const bk = transportItemTypeToBodyKey[currentItem.type];
// ...
[bk]: signals === undefined ? [currentItem.payload] : [...signals, currentItem.payload],
```

[`packages/web-sdk/src/config/makeCoreConfig.ts:38–45`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/web-sdk/src/config/makeCoreConfig.ts#L38) 根據 configured `url` 建立 `new FetchTransport(...)`。[`packages/web-sdk/src/transports/fetch/transport.ts:62–124,205–231`](https://github.com/grafana/faro-web-sdk/blob/6529bc47fe7fa1d39ca971d7f0f8e0432f49edac/packages/web-sdk/src/transports/fetch/transport.ts#L62)：

```ts
const jsonBody = JSON.stringify(getTransportBody(items));
// requestInit:
method: 'POST',
headers: { 'Content-Type': 'application/json', /* ... */ },
body,
// ...
const response = await fetch(url, {
  ...requestInit,
  keepalive: keepaliveReservation.keepalive,
});
```

預期 JSON 結構示例（不是本次送出的 runtime payload）：

```json
{
  "meta": { "app": { "name": "foreman-assistant" } },
  "events": [
    { "name": "click", "attributes": { "link_name": "ReferenceDocument.SDS" } }
  ]
}
```

Actual schema 另有 domain/timestamp/其他 meta；body 可以 batch 多筆 signals。`link_name` 的位置是 `events[].attributes.link_name`，不是 top-level field。

`C/src/features/environment/environmentUrls.ts:4,19,37–46`：

```ts
export const ALLOY_PATH_SUFFIX = '/alloy';
'tw-prod': 'https://shixpa-peproxy00.garmin.com',
// resolveCollectorUrl:
return `${domain}${ALLOY_PATH_SUFFIX}`;
```

配合 `F/src/main.ts:12` 的 `environment: 'tw-prod'`，source configuration 選出 `https://shixpa-peproxy00.garmin.com/alloy`。頁面部署在哪個 host 不會覆寫這個 explicit config。

### 9.5 Alloy → Faro receiver → prefixed log body

[`grafana/alloy/internal/component/otelcol/receiver/faro/faro.go:18–26`](https://github.com/grafana/alloy/blob/a435563ff073d5355952c1a8d1821110b1392691/internal/component/otelcol/receiver/faro/faro.go#L18)：

```go
Name: "otelcol.receiver.faro",
Build: func(opts component.Options, args component.Arguments) (component.Component, error) {
    fact := faroreceiver.NewFactory()
    return receiver.New(opts, fact, args.(Arguments))
},
```

同 revision `go.mod`：

```go
github.com/open-telemetry/opentelemetry-collector-contrib/receiver/faroreceiver v0.153.0
github.com/open-telemetry/opentelemetry-collector-contrib/pkg/translator/faro v0.153.0 // indirect
```

[`receiver/faroreceiver/receiver.go:166–206`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/42f949127580c0d00088b785cd0b35842dc0ddb8/receiver/faroreceiver/receiver.go#L166)：

```go
var payload faro.Payload
if err := json.Unmarshal(body, &payload); err != nil { /* ... */ }
// ...
logs, translatorErr := farotranslator.TranslateToLogs(req.Context(), payload)
// ...
consumeErr := r.nextLogs.ConsumeLogs(obsCtx, logs)
```

**沒有另一套「Alloy click JSON schema」取代 `events[].attributes.link_name`。** Receiver 解碼 Faro payload，再形成 OTel logs。

[`pkg/translator/faro/keyval.go:51–55,165–177`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/42f949127580c0d00088b785cd0b35842dc0ddb8/pkg/translator/faro/keyval.go#L165)：

```go
func eventToKeyVal(e *faroTypes.Event) *keyVal {
    kv := newKeyVal()
    // ... event name/domain/timestamp ...
    if e.Attributes != nil {
        mergeKeyValWithPrefix(kv, keyValFromMap(e.Attributes), faroEventDataPrefix)
    }
    // ...
    return kv
}
func mergeKeyValWithPrefix(target, source *keyVal, prefix string) {
    for el := source.Oldest(); el != nil; el = el.Next() {
        target.Set(fmt.Sprintf("%s%s", prefix, el.Key), el.Value)
    }
}
```

`pkg/translator/faro/logs_to_faro.go:104` 定義 shared constant `faroEventDataPrefix = "event_data_"`。它提供 constant，但該檔案的 `TranslateFromLogs()` 是反向轉換，不能拿它充當 forward implementation。

[`pkg/translator/faro/faro_to_logs.go:109–116,139–147`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/42f949127580c0d00088b785cd0b35842dc0ddb8/pkg/translator/faro/faro_to_logs.go#L139)：

```go
for i := range payload.Events {
    event := &payload.Events[i]
    kvList = append(kvList, &kvTime{kv: eventToKeyVal(event), /* ... */})
}
// ...
line, err := logfmt.MarshalKeyvals(keyValToInterfaceSlice(i.kv)...)
// ...
logRecord.Body().SetStr(string(line))
logRecord.Attributes().PutStr(faroKind, string(i.kind))
```

因此 `event_data_link_name=<value>` 在這個版本先進入 **logfmt body**。不能直接稱這一步已把所有 event fields 放進 OTel `logRecord.Attributes()`。

### 9.6 Garmin output / Collector 的 attribute materialization

本機 infra source `helm/infra-service/tw-stage/alloy/alloy/stage.values.yaml:34–69`：

```alloy
otelcol.receiver.faro "frontend" {
  endpoint = "0.0.0.0:12347"
  output {
    logs = [otelcol.processor.batch.default.input]
    traces = [otelcol.processor.batch.default.input]
  }
}
otelcol.processor.batch "default" {
  output {
    logs = [otelcol.exporter.otlp.collector.input]
    traces = [otelcol.exporter.otlp.collector.input]
  }
}
otelcol.exporter.otlp "collector" {
  client {
    endpoint = "opentelemetry-collector.open-telemetry.svc.cluster.local:4317"
    // ...
  }
}
```

同 repo `helm/infra-service/tw-stage/open-telemetry/opentelemetry-collector/stage.values.yaml:78` 的 `transform/opensearch_body`：

```yaml
- merge_maps(attributes, ParseKeyValue(body), "upsert") where IsString(body)
```

這個 parser 才將 body 中的 `event_data_link_name` materialize 成 log attributes。實際 index mapping 與 runtime delivery 是另一次查證的 evidence；本次沒有重新查 runtime Kubernetes、發出 telemetry POST 或逐筆驗證 storage。

```text
template data-link-name
  ──render──> p-button host attribute
  ──bubbling click / event.target──> document ClickInstrumentation callback
  ──closest + getAttribute──> raw DOM value
  ──toPayloadKey──> { link_name: value }
  ──pushEvent──> Faro TransportItem.payload.attributes
  ──getTransportBody + JSON.stringify + fetch──> events[].attributes.link_name
  ──Alloy faroreceiver + TranslateToLogs + eventToKeyVal──> log body event_data_link_name
  ──OTLP exporter──> Collector
  ──ParseKeyValue(body)──> attributes.event_data_link_name
```

## 10. Learning repo consistency audit

本表記錄**修改前**的 claims。原文與七組搜尋位置保存在搜尋附件；本次已更正的檔案會保留查證日期與報告連結。

| Learning file / source snippet | 與 source 的一致性 / 缺口 |
|---|---|
| `learning-records/0005-click-target-currenttarget-and-faro-extraction.md:3`：「document listener」「從 event.target 用 closest」 | 與 pinned `clickInstrumentation.ts:59–73,90–92` 一致；原 record 沒有 source path、revision、snippet。`currentTarget` 為 document 也是 DOM listener 語意；source 本身沒有讀 `event.currentTarget`，不可誤稱 code 使用它。 |
| 同檔 :5：「trackAttributes 已驗證只有 data-link-name」 | 與 `F/src/main.ts:29` 一致；原 record 沒有 source proof 或 verification timestamp，無法當成最新遠端 HEAD 證據。 |
| 同檔 :5：「attribute 由 Foreman developer 放在 template / DOM；Faro 不會自行建立」 | 與 main / toolbar declarations 及 Faro read-only extraction 一致；原文沒有首次 introduction 歷史，因此不能延伸成「Faro 導入前原本就有」。 |
| 同檔 :5：「轉成 click payload 的 link_name」 | 結果一致，但原文沒有 `toPayloadKey()` proof；須補充目前是 generic key normalization，不是內建特殊 link-name 邏輯。 |
| 同檔 :5：「user/device 是其他 metadata 路徑」 | 與 `C/src/initFaro/initFaro.ts` 的 userSync / `faro.metas.add(() => ({ device: ... }))` 一致；原 record 無 code proof。 |
| `sources/evidence/foreman-integration.md:27–29`：「item.subsystem runtime binding」「五個 static values」 | 與 source 一致；已有 pinned paths，但沒有原碼片段，也沒追到 `setPanelList()` / enum。runtime 值的 Unknown 保留；source 可以補列 configured entries，不能宣稱 live 顯示清單。 |
| 同檔 :33–37：「48 p-button、2 button、2 a」「p-button host/inner button」 | 重新計数一致，PrimeNG source 一致；不能用 markup count 當 business coverage。本次補上逐一 inventory。 |
| `sources/evidence/faro-click-tracking.md:18–26`：「document listener、closest、getAttribute、normalization、empty payload、throttle」 | 目前 pinned implementation 一致，但原 evidence 多為結論加 path，缺 exact snippets。需區分 package throttle 與 SDK dedupe。 |
| 同檔 :60：「初始實作 ca043905... 已使用 data-attribute contract」 | **錯誤**。初始 implementation 讀 direct text；`data-link-name` 在 Aug 6 的設計/implementation 才加入。source proof 見 §2。 |
| 同檔 :60 的 `bd4c040a55ccdf8be30c659978c7bba5f2c5c4d` | **SHA 誤植**，缺尾碼 `0`；已驗證的完整 SHA 是 `bd4c040a55ccdf8be30c659978c7bba5f2c5c4d0`。 |
| `sources/linked/internal/faro-click-tracking.md` 的 PR #32 SHA `937d4a32e725877188a8d8a223529de0449d4d` | **SHA 誤植**；完整值是 `937d4a32e725877188a8d8a223529dece0449d4d`。 |
| `sources/evidence/opensearch-field-lifecycle.md:18`：「logs_to_faro.go converts Faro payload into OTel log attributes」 | **方向錯誤，且合併了 body→attributes 兩步**。forward 是 `faro_to_logs.go` → `keyval.go` → logfmt body；後續 Collector parser 才取成 attributes。`logs_to_faro.go` 可證明 shared prefix constant，但不能證明 forward execution。 |
| `sources/linked/external/otel-faro-translator.md`：「logs_to_faro.go establishes Faro→OTel translation」 | **同樣方向錯誤**；原 pinned SHA 也未對齊 Alloy 1.18.0 的 go.mod。本次新增實際依賴版本鏈，見 §9.5。 |
| `lessons/0002-faro-click-instrumentation.html:95,259`：「Foreman developer 加 template attribute」「package 只讀」 | 與 source 一致；屬學習說明，不是 introduction/history proof。没有由此證明 attribute predates Faro。 |
| `learning-records/0006-faro-instance-reference-and-click-callback-bridges.md:3`：「公司 package 自己實作」「initialize 註冊 handleClick」 | 與 source 一致；原 record 沒有 code snippet/revision。没有把 package object 與 browser registration 混在一起。 |
| `sources/evidence/foreman-browser-lab-2026-09-16.md:19–20,37–45,67–71`：「SPAN closest 找 EfficiencyAbnormalReport」「Zone wrapper 不能單独证明 Faro callback」「POST link_name」 | 與 source model 相容；這是特定操作的歷史 runtime evidence，source investigation 無法獨立重驗所有 screenshots/實際 execution，也不是 2026-09-17 runtime 現況。 |
| `sources/evidence/foreman-browser-debug-lab.md`：「DailySchedule DOM→POST；HTTP 202」 | 是前次個別 runtime observation，與 extraction model 相容；不能擴張成所有 marked/unmarked controls 皆送達 storage。本次不以其值補寫成全部 live inventory。 |

未發現上述 `0005` 的主要 extraction 結論與 pinned source 衝突；它的問題是**欠缺 proof / version scope / 歷史 distinction**。真正可證實的錯誤是初始 implementation 的歷史描述、translator 方向/body 層次與兩處 SHA 誤植。

Faro repo 本身也有過時 spec，不能拿它取代 source：`C/openspec/specs/click-tracking-package/spec.md:84` 仍寫：

```md
事件內容 SHALL 包含 link_name、device_type、max_touch_points 三個欄位
```

但目前 `C/src/features/click/clickInstrumentation.ts:66–78` 僅建立 configured attribute payload，沒有那三個 default fields。搜尋附件也包含 archived optional override / trim / text fallback、未同步的 change proposals；它們是歷史設計或未對齊的 specs，不是 current runtime contract。

## 明確保留的 Unknown

- 2026-09-17 遠端公司 repos 的最新 HEAD、未取得 branch / 未保存 branch intermediate commits。
- 最早部署、最早 render、目前每個環境的全部 marked live DOM nodes、disabled states、backend JSON 額外欄位。
- 所有 clickable UI 的 business coverage；source template inventory 不等同 runtime node / business action inventory。
- 每筆 click 的 callback execution、SDK dedupe/queue outcome、HTTP acceptance、Alloy→Collector→storage delivery。本次只驗 source，未送出 telemetry。
- 2026-09-17 的 Alloy deployment image / custom image 實際 build dependency；§9.5 的確切 version chain 是 upstream Alloy 1.18.0 source，不是本次驗證的 container binary provenance。
- 初始作者為何把後來的 `trackAttributes` 限制為 `data-*` 的完整理由。能證明 `data-link-name` 的穩定語意設計，不能把它反推成全部 data-* validation 的唯一動機。
