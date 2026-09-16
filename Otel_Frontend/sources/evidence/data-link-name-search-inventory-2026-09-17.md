# 全部七組 literal search inventory — 2026-09-17

本附件對應 [調查報告](data-link-name-investigation-2026-09-17.md)。修改 Learning artifacts 前先固定搜尋結果。

- Foreman：132 tracked worktree files，HEAD `4e032babef7aa30e5d13d7a506abe208945a5dee`；全部 files 已與 Git blob 比對，CRLF/LF normalization 後無差異。
- Faro：101 tracked worktree files，HEAD `937d4a32e725877188a8d8a223529dece0449d4d`；同樣無內容差異。
- Learning：修改前 69 text files，包含 sources/materials 的原始 HTML、lessons、reference、learning-records、scripts、assets text files；不搜尋二進位影像與 Git internal metadata。
- 使用 PowerShell `Select-String -SimpleMatch`（case insensitive），逐組搜尋使用者指定的七個字串。Counts 是 matching lines，不是 occurrence 數；同一行可包含多個 matches。
- Foreman / Faro 保留整行原文與 1-based line number。Learning 的超長 HTML 行另列每個 match 的 column 及附近原文，避免整行 base64 images 淹沒證據；搜尋沒有跳過這些長行。
- Faro docs/specs/test mentions 都保留；不把 historical proposal 或 test fixture 誤稱 production DOM renderer。
- Negative search counts 的 scope 是上述 pinned checkout，不代表 repo 所有 branches 或目前遠端 HEAD。

| Literal | Foreman matching lines | Faro matching lines | Learning matching lines |
|---|---:|---:|---:|
| `data-link-name` | 7 | 118 | 106 |
| `[attr.data-link-name]` | 1 | 0 | 4 |
| `trackAttributes` | 1 | 229 | 68 |
| `ClickInstrumentation` | 0 | 130 | 183 |
| `closest(` | 0 | 41 | 50 |
| `getAttribute(` | 0 | 1 | 18 |
| `link_name` | 0 | 127 | 59 |

Foreman 的 7 行包含 6 render declarations 與 1 host configuration。Faro production implementation 不含 literal `data-link-name`；其泛用 extraction 使用 configured attribute name。以下歷史 spec / tests / README 的 mentions 是搜尋結果的一部分。

## Foreman

``````text
## data-link-name (7 matching lines)
foreman-assistant/src/main.ts:29:  trackAttributes: ['data-link-name'],
foreman-assistant/src/app/layout/main/main.component.html:46:                [attr.data-link-name]="item.subsystem"
foreman-assistant/src/app/shared/toolbar/toolbar.component.html:86:        data-link-name="UserGuide.UserGuide"
foreman-assistant/src/app/shared/toolbar/toolbar.component.html:105:        data-link-name="ReferenceDocument.SDS"
foreman-assistant/src/app/shared/toolbar/toolbar.component.html:117:        data-link-name="ReferenceDocument.AI"
foreman-assistant/src/app/shared/toolbar/toolbar.component.html:129:        data-link-name="ReferenceDocument.ForemanManual"
foreman-assistant/src/app/shared/toolbar/toolbar.component.html:143:        data-link-name="Contact.ContactAdministrator"
## [attr.data-link-name] (1 matching lines)
foreman-assistant/src/app/layout/main/main.component.html:46:                [attr.data-link-name]="item.subsystem"
## trackAttributes (1 matching lines)
foreman-assistant/src/main.ts:29:  trackAttributes: ['data-link-name'],
## ClickInstrumentation (0 matching lines)
## closest( (0 matching lines)
## getAttribute( (0 matching lines)
## link_name (0 matching lines)

``````

## Faro

``````text
## data-link-name (118 matching lines)
README.md:62:  trackAttributes: ['data-link-name', 'data-page'],
README.md:103:  trackAttributes: ['data-link-name'],
README.md:130:  trackAttributes: ['data-link-name', 'data-page', 'data-section'],
README.md:137:    <button data-link-name="Submit">Submit</button>
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前只支援單一標記 attribute `data-link-name`（或自訂 `attributeName`），透過 `element.closest()` 往上查找，決定 `link_name` 欄位。討論過程中曾評估函式型 `getExtraFields(target) => Record<string,string>` 方案，但因 typo 風險、例外處理複雜度、side effect 疑慮，最終定案採用最小化的宣告式方案：宿主專案只給「要追蹤哪些 attribute 名稱」，查找/合併邏輯完全由套件比照既有 `data-link-name` 機制實作，不引入任何 host 自訂函式。詳見 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md)。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:9:- 每個 attribute 各自獨立以 `.closest()` 查找（與 `data-link-name` 相同邏輯），找到的值以「原始 attribute 名稱」為 key 併入同一筆 `click` event payload。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:11:- 找不到某個 attribute 時，該欄位單純不出現在 payload，不視為錯誤（維持與現有 `data-link-name` fallback 邏輯一致的容錯風格）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:30:**理由**：討論過程比較過函式型 `getExtraFields`（彈性大，但 host 自寫查找邏輯、需處理例外/side effect）與宣告式清單（套件內部統一用 `.closest()` 查找，無 host 程式碼可能拋錯）。後者複雜度大幅低於前者，且與現有 `data-link-name` 心智模型一致："宣告 attribute 名稱，套件自動往上找"。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:46:**理由**：與現有 `getOverrideLinkName()` 對 `data-link-name` 的查找邏輯完全一致，維持套件內部只有一套「往上找標記」心智模型；多個 attribute 天然可能標記在 DOM 樹的不同層級（例如 `data-page` 在外層 `<div>`，`data-link-name` 在最內層 `<button>`），各自獨立查找才能同時取得。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:60:**理由**：「這次點擊剛好沒有這個資訊」是正常情況（例如 host 只在特定頁面標記 `data-page`，其他頁面本來就沒有），不是程式錯誤，不應 throw；比照現有 `data-link-name` 找不到時的容錯風格（fallback 或送空字串），本情境沒有 fallback 需求，直接省略欄位最單純。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:3:目前 `click` 事件只送出固定 schema（`link_name`/`device_type`/`max_touch_points`），宿主專案若想在同一次點擊事件中額外記錄「這個點擊發生在哪個頁面/區塊」等資訊，沒有任何擴充管道。經過 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md) 的討論，決定採用「宣告式 attribute 名稱清單」的最小化方案：宿主專案只需在 `initFaro()` 宣告要追蹤哪些 `data-*` attribute，套件比照既有 `data-link-name` 的 `.closest()` 查找機制，自動將這些 attribute 的值併入同一筆 `click` event payload，不引入函式型 hook、不新增例外處理與非同步顧慮。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:11:對 `trackAttributes` 中每一個 attribute 名稱，Package SHALL 於每次點擊時各自獨立從 `event.target` 開始，以 `closest('[該名稱]')` 查找最近一個帶有該 attribute 的元素（含 `event.target` 自身）；查找方式與既有 `data-link-name` 查找機制一致。找到則將該 attribute 的值（trim 前原始字串）以「原始 attribute 名稱」為 key，併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，SHALL NOT 視為錯誤、SHALL NOT 阻止該次 `click` event 送出。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:22:### 1. 新增可選 `data-link-name` attribute 覆寫規則，而非推翻既有「不要求標記」的決策
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:24:**選擇**：`ClickInstrumentation` 新增規則——若 `event.target` 自身或其祖先帶有 `data-link-name` attribute，優先採用該屬性值作為 `link_name`；未標記時維持原本的直接文字節點擷取規則。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:36:### 2. 屬性名稱使用 `data-link-name`，不沿用 Faro 內建 `data-faro-user-action-name`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:38:**選擇**：新增獨立的 `data-link-name` attribute，不重用 Faro Web SDK `UserActionInstrumentation` 既有的 `data-faro-user-action-name` 慣例。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:42:### 3. 用 `element.closest('[data-link-name]')` 往上找最近的標記祖先，而非只看 `event.target` 自身
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:44:**選擇**：查找時從 `event.target` 開始，用 `closest()` 往上找最近一個帶有 `data-link-name` 的元素（含自身）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:51:### 4. `data-link-name` 屬性值為空字串時，視同無效名稱，不 fallback 回文字節點擷取
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:59:- [宿主專案仍需要逐一在模板上標記 `data-link-name`，套件無法自動推導穩定值] → 已在 Non-Goals 中明確排除自動化方案；這是「語系無關穩定命名」問題本質上無法迴避的宿主端工作，套件僅負責提供標準化的覆寫 hook。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:60:- [`data-link-name` 與宿主專案既有的其他 `data-*` attribute 可能有理論上的命名衝突] → 風險低：`data-link-name` 語意明確、命名空間與常見框架慣例（`data-testid`、`data-cy` 等）不重疊；README 會記錄此 attribute 為套件保留名稱。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:9:- `ClickInstrumentation` 新增「`data-link-name` attribute 覆寫」規則：若被點擊元素自身或其祖先帶有 `data-link-name` attribute，直接採用該屬性值（trim 後）作為 `link_name`，不再讀取文字節點；查找方式為由 `event.target` 往上找最近帶有該 attribute 的元素（含自身），不限定特定 HTML 標籤或框架，任何宿主專案皆可採用。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:10:- 未標記 `data-link-name` 的元素行為完全不變，仍套用既有「擷取自身直接文字節點」規則；此為新增的**選配（optional）**能力，不強制、也不影響現有整合。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:11:- `data-link-name` 屬性值 trim 後為空字串時，視同無效名稱，套用既有空名稱防呆（不送出事件），SHALL NOT fallback 回文字節點擷取。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:22:- `click-tracking-package`：修改「點擊名稱擷取規則」需求，新增 `data-link-name` attribute 優先於文字節點擷取的規則；新增「點擊名稱可由 data-link-name attribute 覆寫」需求，定義覆寫規則的查找方式、優先序與空值防呆行為。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:27:- 文件：`README.md` 補上 `data-link-name` attribute 的使用說明。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:29:- 使用端影響（非 breaking）：宿主專案可選擇性在需要穩定命名的元素上標記 `data-link-name`；不標記時行為與現況完全相同。後續 Foreman-Assistant 端會在自己的 repo 標記主頁系統 tile 與 toolbar 側邊選單連結，非本 change 程式碼變更範圍（該 repo 無 openspec 流程）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:3:- [x] 1.1 新增常數 `LINK_NAME_ATTRIBUTE = 'data-link-name'`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:10:- [x] 2.1 新增測試：元素自身帶 `data-link-name="FifoToolkit"` 且文字節點為其他內容時，`pushEvent` 的 `link_name` 為 `"FifoToolkit"`，不採用文字內容
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:11:- [x] 2.2 新增測試：點擊的 `event.target` 自身未標記，但某個祖先帶有 `data-link-name`，`link_name` 仍為該祖先的屬性值
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:12:- [x] 2.3 新增測試：`data-link-name=""`（空字串）時，不送出任何 `click` 事件，且不 fallback 讀取文字節點
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:24:- [x] 4.1 更新 `README.md`：補上 `data-link-name` attribute 的使用說明與範例（含「未標記時行為不變」「值為空字串視同無效」兩點提醒）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:28:- [x] 5.1 於 Foreman-Assistant 標記 `data-link-name` 後點擊對應元素，於 Loki／dashboard 確認 `link_name` 為標記值，且切換語系後該值不變
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:6:1. 若 `event.target` 自身或其祖先（透過 `closest('[data-link-name]')` 查找）帶有 `data-link-name` attribute，採用最近一個該元素的屬性值（trim 後）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:9:#### Scenario: 點擊純文字元素（未標記 data-link-name）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:10:- **WHEN** 使用者點擊一個自身直接包含文字節點「首頁」、且自身與祖先皆未標記 `data-link-name` 的元素
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:13:#### Scenario: 點擊內含多個子元素的容器（未標記 data-link-name）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:14:- **WHEN** 使用者點擊一個自身沒有直接文字節點、且未標記 `data-link-name` 的容器元素，其子孫元素各自帶有文字
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:19:### Requirement: 點擊名稱可由 data-link-name attribute 覆寫
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:20:Package SHALL 支援宿主專案於任意元素（或其祖先）標記 `data-link-name` attribute，以提供穩定、與顯示文字／語系無關的點擊名稱，覆寫「點擊名稱擷取規則」預設的文字節點擷取行為。此為宿主專案選配（optional）能力：不標記的元素行為 SHALL 與未新增本規則前完全一致，套件 SHALL NOT 因此變成要求宿主專案標記任何 attribute 才能被追蹤。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:22:查找方式為由 `event.target` 開始，往上尋找最近一個帶有 `data-link-name` attribute 的元素（含 `event.target` 自身），不限定特定 HTML 標籤或前端框架。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:24:#### Scenario: 點擊自身帶有 data-link-name 的元素
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:25:- **WHEN** 使用者點擊一個自身帶有 `data-link-name="FifoToolkit"` attribute 的元素，其顯示文字為翻譯後的字串（例如「治具Check In/Out」）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:28:#### Scenario: 點擊的目標元素本身未標記，但祖先帶有 data-link-name
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:29:- **WHEN** 使用者實際點擊的元素（`event.target`）自身未標記 `data-link-name`（例如按鈕內部的圖示子元素），但其某個祖先元素帶有 `data-link-name="FifoToolkit"`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:32:#### Scenario: data-link-name 屬性值為空字串
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:33:- **WHEN** 使用者點擊一個帶有 `data-link-name=""`（或 trim 後為空字串）attribute 的元素
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前疊加兩層欄位邏輯：套件內建固定欄位（`link_name`——`data-link-name` 查找 fallback 到直接文字節點、`device_type`/`max_touch_points`——依賴 `src/device/deviceTypeDetector.ts`），以及宿主專案透過 `trackAttributes` 宣告的自訂欄位（`add-custom-track-attributes` 變更引入）。兩層欄位並存導致「payload 保證會有哪些欄位」變得模糊：內建欄位無論宿主專案是否需要都會出現，而自訂欄位需另外宣告。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:78:- **[Risk][BREAKING] 所有現有整合套件的宿主專案，升級後 `click` 事件會完全停止送出 `link_name`/`device_type`/`max_touch_points`，直到改為以 `trackAttributes` 宣告等效欄位** → 屬預期的破壞性變更，需在 CHANGELOG / README 明確標示為 major version bump，並提供遷移範例（例如以 `data-link-name` 取代原生 `link_name` fallback 邏輯）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:81:- **[Trade-off] 放棄「開箱即用」的固定欄位，換取欄位組成的完全透明與一致性** → 對只需要基本點擊名稱追蹤的宿主專案而言，升級後需自行以 `trackAttributes` 宣告 `data-link-name` 才能維持原行為，屬本次變更明確接受的取捨。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:7:- **BREAKING**：`ClickInstrumentation` 送出的 `click` 事件 payload 不再自動包含 `link_name`、`device_type`、`max_touch_points` 三個內建欄位；移除對應的直接文字節點擷取、`data-link-name` 覆寫查找、裝置類型計算等邏輯。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:24:- `click-tracking-package`：移除「點擊名稱擷取規則」「點擊名稱可由 data-link-name attribute 覆寫」「空名稱防呆」「`click` 事件內容（固定欄位）」「裝置資訊自動附加」等由套件內建欄位定義決定的需求；「可設定額外追蹤 attribute 清單」需求改為新增「payload key 轉換規則」與「轉換後 key 撞名驗證」，移除「與內建欄位 key 撞名」驗證；新增「payload 為空時不送出事件」需求取代原「空名稱防呆」。同一元素節流去重需求維持不變。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:28:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（移除 `link_name`/`device_type`/`max_touch_points` 計算邏輯與 `data-link-name`/直接文字節點擷取相關函式，改用「payload 是否為空」作為送出防呆條件；`toPayloadKey()` 已存在且已 commit，不需修改）、[src/initFaro.ts](../../../src/initFaro.ts)（`validateTrackAttributes()` 移除內建欄位撞名檢查，修正清單內部撞名檢查的錯誤訊息文字 bug，更新 doc comment；轉換後 key 撞名的 `Set` 檢查邏輯已存在且已 commit，不需修改）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:31:- **Breaking change 遷移**：既有依賴 `link_name`/`device_type`/`max_touch_points` 三個固定欄位的宿主專案，升級後這些欄位將不再出現於 `click` 事件；需改為透過 `trackAttributes` 自行標記對應的 `data-*` attribute（例如以 `data-link-name` 取代原生 `link_name` 邏輯），方能維持既有 Loki pipeline 相容。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:40:- [x] 5.3 新增遷移範例：如何以 `trackAttributes` 宣告 `data-link-name` 取代原 `link_name` 邏輯（含「fallback 讀取文字節點」的行為已不再支援的提醒）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:113:**Reason**：`link_name` 欄位不再由套件內建計算，其擷取邏輯（`data-link-name` 查找、直接文字節點擷取）整組移除；宿主專案改用 `trackAttributes` 宣告 `data-link-name` 取得等效欄位。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:114:**Migration**：宿主專案若需維持原「點擊名稱」欄位，SHALL 於 `trackAttributes` 中加入 `data-link-name`，並於 HTML 上以 `data-link-name` attribute 標記需要穩定名稱的元素；套件會依既有 `trackAttributes` 查找機制（`.closest()`）取得該值，並以轉換後的 key `link_name` 併入 payload。若需要「找不到 `data-link-name` 時 fallback 讀取元素自身直接文字節點」的行為，套件不再提供，SHALL 由宿主專案自行於需要的元素上皆標記 `data-link-name`。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:116:### Requirement: 點擊名稱可由 data-link-name attribute 覆寫
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:117:**Reason**：屬於「點擊名稱擷取規則」的一部分，隨該需求一併移除；`data-link-name` 標記機制本身透過 `trackAttributes` 延續（見上一項 Migration），僅「覆寫」與「fallback 文字節點」的特殊語意不再由套件內建。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）自建立以來一路都是 opt-out 模式：預設追蹤所有元素（未標記 `data-link-name` 時 fallback 讀取自身直接文字節點），只有標記 `data-link-name=""` 才能排除單一元素（見 [link-name-data-attribute/design.md](../archive/2026-08-06-link-name-data-attribute/design.md) 決策 4）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:5:實際使用（Foreman-Assistant）中發現：當「不想追蹤」的元素數量增加時，opt-out 模式要求宿主專案在每一個不想追蹤的元素上都補一個 `data-link-name=""`，排除清單分散在各元件裡、難以整體管理，且與宿主專案「只想追蹤少數幾個真正關心的連結」的實際需求方向相反。宿主專案希望能整個反轉預設值：只有明確標記的元素才追蹤，其餘一律不送出事件；並且這個「要用 opt-in 還是 opt-out」的選擇本身應該是全域、由 `initFaro()` 呼叫端一次決定，而不是逐元素標記。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:10:- 讓宿主專案可以透過 `initFaro()` 的設定，將點擊追蹤策略整個切換成「只追蹤標記 `data-link-name` 的元素」（opt-in），一次設定即對整個頁面生效。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:16:- 不新增框架層級的 API（例如 Angular directive／React hook）協助標記 `data-link-name`；套件維持框架無關，標記方式不變。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:17:- 不變更 `data-link-name` 屬性名稱、`closest()` 往上查找祖先的既有查找邏輯。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:26:- 兩種模式共用「取得 override link name → 空名稱防呆 → 節流去重 → pushEvent」整套既有流程，差異只在「找不到 `data-link-name` 標記時要不要 fallback 讀文字節點」這一步，用同一個 class 加一個分支即可表達，不需要重複實作節流/事件格式邏輯到第二個 class。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:41:### 3. opt-in 模式下，`data-link-name=""` 與「完全沒有標記」效果相同（皆不送出事件），不需要額外規則
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:49:- [宿主專案切換為 opt-in 模式後，若忘記在想追蹤的元素上補 `data-link-name`，會悄悄漏追蹤（不會有任何錯誤或警告）] → 這是 opt-in 模式的本質取捨，已在 proposal 中明確記錄為預期行為（「其餘一律不送出事件」）；套件不做執行期警告是延續既有「不侵入宿主專案、不引入額外 console 噪音」的風格，宿主專案需自行確認标记覆盖率（例如靠既有整合測試或人工核對）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:3:目前 `ClickInstrumentation` 採「預設全部追蹤、需標記 `data-link-name=""` 才能排除單一元素」的 opt-out 模式。隨著宿主專案（Foreman-Assistant）陸續發現「不想被記錄」的元素（例如純本地端表單操作按鈕，其顯示文字剛好構成有效 `link_name`），若持續用 opt-out 模式，每多一個不想追蹤的元素就要多改一次宿主程式碼並加上 `data-link-name=""`，長期下來排除清單會越來越長、越來越分散在各元件裡，難以維護，也不是宿主專案期望的使用方式。宿主專案期望的模型是反過來的：**只有明確標記 `data-link-name` 的元素才會被記錄**，其餘元素完全不追蹤；同時希望能全域決定要不要啟用這種「全域被動監聽」行為，因為並非每個專案都需要監聽全域點擊。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:7:- `initFaro()` 新增選用設定，讓宿主專案可將 `ClickInstrumentation` 由目前的「opt-out（預設全部追蹤，標記空字串才排除）」模式，切換為「opt-in（只追蹤有標記 `data-link-name` 且非空字串的元素，其餘一律不送出事件）」模式。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:10:  - 找不到 `data-link-name` 標記的元素（`getOverrideLinkName()` 回傳 `undefined`）SHALL NOT fallback 讀取文字節點，視同空名稱，不送出事件。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:11:  - `data-link-name=""`（空字串）在 opt-in 模式下的效果與 opt-out 模式一致：仍視為空名稱，不送出事件（維持既有「空字串防呆」語意一致性，不需要額外規則）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:20:- `click-tracking-package`: 「全域點擊追蹤，不限元素類型」與「點擊名稱可由 data-link-name attribute 覆寫」兩項 Requirement 新增條件分支——當 `initFaro()` 啟用 opt-in 模式時，未標記 `data-link-name` 的元素不再被追蹤（不再 fallback 讀取文字節點）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:6:- [x] 1.4 確認 `data-link-name=""` 的既有空名稱防呆、300ms 節流去重邏輯在兩種模式下皆不受影響
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:17:- [x] 3.2 新增測試：`mode: 'markedOnly'` 時，標記 `data-link-name` 的元素行為與 `mode: 'all'` 一致
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:18:- [x] 3.3 新增測試：`mode: 'markedOnly'` 時，未標記 `data-link-name` 的元素（即使自身有直接文字節點）不送出任何 `click` 事件
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:19:- [x] 3.4 新增測試：`mode: 'markedOnly'` 時，`data-link-name=""` 的元素不送出任何 `click` 事件
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:20:- [x] 3.5 確認既有測試（純文字節點擷取、`data-link-name` 覆寫、空名稱防呆、300ms 節流去重）維持通過，不需修改
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:35:- [ ] 6.1 於任一宿主專案（例如 Foreman-Assistant）測試分支中，將 `initFaro()` 加上 `linkTracking: { mode: 'markedOnly' }`，確認未標記 `data-link-name` 的元素（例如 config-dialog 的「確認」按鈕）不再產生 `click` 事件，且已標記的元素追蹤行為不受影響
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:4:`initFaro()` SHALL 提供選用設定，讓宿主專案將點擊追蹤策略由預設的 opt-out 模式（`mode: 'all'`，未標記 `data-link-name` 的元素仍會 fallback 讀取文字節點）切換為 opt-in 模式（`mode: 'markedOnly'`）。未提供此設定時，SHALL 維持 `mode: 'all'` 行為，與現況完全一致。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:7:- 元素（或其祖先）帶有 `data-link-name` 且 trim 後非空字串時，行為與既有「點擊名稱可由 data-link-name attribute 覆寫」需求一致，採用該屬性值作為 `link_name`。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:8:- 找不到任何帶 `data-link-name` 的祖先（含自身）時，SHALL NOT fallback 讀取文字節點；視同空名稱，套用既有「空名稱防呆」規則，不送出任何 `click` 事件。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:9:- `data-link-name=""`（trim 後為空字串）與「完全未標記」效果相同，皆不送出事件。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:13:- **WHEN** 宿主專案呼叫 `initFaro()` 且未設定點擊追蹤模式，使用者點擊一個未標記 `data-link-name`、但自身有直接文字節點的元素
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:17:- **WHEN** 宿主專案呼叫 `initFaro()` 並設定為 `mode: 'markedOnly'`，使用者點擊一個帶有 `data-link-name="FifoToolkit"` 的元素
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:21:- **WHEN** 宿主專案呼叫 `initFaro()` 並設定為 `mode: 'markedOnly'`，使用者點擊一個未標記 `data-link-name`、但自身有直接文字節點的元素
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:24:#### Scenario: opt-in 模式下，data-link-name 為空字串仍不送出事件
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:25:- **WHEN** 宿主專案呼叫 `initFaro()` 並設定為 `mode: 'markedOnly'`，使用者點擊一個帶有 `data-link-name=""` 的元素
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:3:`ClickInstrumentation` 目前用 `mode`（`'all'` / `'markedOnly'`）決定找不到 `data-link-name` 時要不要 fallback 抓文字節點；`trackAttributes` 則是另一份「額外附加到 payload」的 attribute 清單，兩者查找邏輯（`closest()` + 取值）已由共用的 `getTrackedAttributeValue()` 實作，`getOverrideLinkName()` 只是對它的一層 trim 包裝。使用者確認：「客製化 attribute」就是指既有的 `trackAttributes`，不新增獨立選項；文字節點 fallback 是否完全移除留待後續 issue 討論，本次先不動。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:5:進一步討論後發現：`data-link-name` 與 `trackAttributes` 唯一差異是「是否需要在 `initFaro()` 設定 JS 選項」——`data-link-name` 只需標記 HTML，`trackAttributes` 需要額外註冊名稱才會生效。由於目前唯一實際使用情境本來就要主動設定 `trackAttributes`，這個「免設定」的預設值價值有限，決定連 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:12:- 完全移除 `data-link-name` 與 `LINK_NAME_ATTRIBUTE`，套件不再有任何內建預設的 link name attribute。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:22:### `link_name` 僅依直接文字節點決定，`trackAttributes` 與其解耦（移除 data-link-name，也不再由 trackAttributes 覆寫）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:23:`link_name` 恢復為單純呼叫 `getDirectTextContent(target)`，不再有任何 attribute（無論是 `data-link-name` 或 `trackAttributes` 命中值）可覆寫它；`trackAttributes` 僅維持既有「依清單各自查找，找到則以原始 attribute 名稱為 key 併入 payload」的通用附加欄位機制（Object 形式）。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:29:替代方案（不採用二）：保留 `data-link-name` 作為 fallback，或讓 `trackAttributes` 命中值覆寫 `link_name`。使用者確認 `trackAttributes` 不應與 `link_name` 綁定，決定完全解耦。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:38:- **BREAKING**：原本仰賴 `data-link-name` 或 `trackAttributes` 命中值決定 `link_name` 的宿主專案，`link_name` 會改回只取自身直接文字節點內容。→ Mitigation：於 proposal 中明確標記 BREAKING；若宿主專案需要穩定、與顯示文字無關的名稱，可改用 `trackAttributes` 將該 attribute 值以其原始名稱附加到 payload 中的其他欄位，自行在後端／查詢時使用該欄位。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:39:- **BREAKING**：僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，`link_name` 會整批改變為 fallback 文字節點內容或完全不同的值。→ Mitigation：proposal 中明確標記 BREAKING，並提示改為在 `trackAttributes` 註冊該 attribute 名稱。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:3:`getOverrideLinkName()` 只是 `getTrackedAttributeValue(element, LINK_NAME_ATTRIBUTE)?.trim()` 的單純包裝，沒有獨立邏輯，徒增一層間接呼叫。另外 `ClickInstrumentation` 目前的 `mode`（`'all'` / `'markedOnly'`）與「文字節點 fallback」機制增加了設定複雜度與行為分歧。進一步檢視後發現，套件內建的 `data-link-name` attribute 與宿主專案自訂的 `trackAttributes` 清單本質上做同一件事（`closest()` 查找＋取值），差別只在於 `data-link-name` 免去了「先在 `trackAttributes` 註冊一次」這個步驟；但目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個「免設定」的價值低於多維護一條路徑、多兩個規格需求的成本，因此決定連同 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:11:- **BREAKING**: 完全移除 `data-link-name` attribute 支援（含 `LINK_NAME_ATTRIBUTE` 常數）；套件不再有任何內建預設的 link name attribute。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:17:- `click-tracking-package`: 點擊名稱擷取規則變更為「僅依自身直接文字節點決定，無 attribute 可覆寫」，移除 `data-link-name` 與 `mode` 選項相關需求；`trackAttributes` 與 `link_name` 判斷解耦，維持既有「附加欄位」需求不變。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:22:- 對外 API 破壞性變更：移除 `mode` 選項與 `ClickTrackingMode` 型別匯出；移除 `data-link-name` 支援；`trackAttributes` 不再影響 `link_name`。原本仰賴「標記 `data-link-name` 或 `trackAttributes` 命中值決定 link_name」的宿主專案，`link_name` 會改回只取該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:3:- [x] 1.1 移除 `getOverrideLinkName()`、`LINK_NAME_ATTRIBUTE` 常數與 `data-link-name` 相關邏輯
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:10:- [x] 2.1 移除 `clickInstrumentation.test.ts` 中針對 `mode: 'markedOnly'` 與 `data-link-name` 覆寫的 describe/測試案例
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:37:### Requirement: 點擊名稱可由 data-link-name attribute 覆寫
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:38:**Reason**: `data-link-name` 與 `trackAttributes` 的查找邏輯（`closest()` 查找＋取值）完全相同，唯一差異是「免 JS 設定即可生效」；但套件目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個免設定的預設值價值有限，維護兩條路徑、兩份規格需求的成本高於效益。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:39:**Migration**: 原本僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，需改為在 `initFaro({ trackAttributes: ['data-link-name'] })` 中明確註冊該 attribute 名稱；該值會以「額外附加欄位」的形式出現在 payload 中（key 為 `data-link-name`），但不再覆寫 `link_name`——`link_name` 一律採用該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:37:1. 若 `event.target` 自身或其祖先（透過 `closest('[data-link-name]')` 查找）帶有 `data-link-name` attribute，採用最近一個該元素的屬性值（trim 後）。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:40:#### Scenario: 點擊純文字元素（未標記 data-link-name）
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:41:- **WHEN** 使用者點擊一個自身直接包含文字節點「首頁」、且自身與祖先皆未標記 `data-link-name` 的元素
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:44:#### Scenario: 點擊內含多個子元素的容器（未標記 data-link-name）
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:45:- **WHEN** 使用者點擊一個自身沒有直接文字節點、且未標記 `data-link-name` 的容器元素，其子孫元素各自帶有文字
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:48:### Requirement: 點擊名稱可由 data-link-name attribute 覆寫
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:49:Package SHALL 支援宿主專案於任意元素（或其祖先）標記 `data-link-name` attribute，以提供穩定、與顯示文字／語系無關的點擊名稱，覆寫「點擊名稱擷取規則」預設的文字節點擷取行為。此為宿主專案選配（optional）能力：不標記的元素行為 SHALL 與未新增本規則前完全一致，套件 SHALL NOT 因此變成要求宿主專案標記任何 attribute 才能被追蹤。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:51:查找方式為由 `event.target` 開始，往上尋找最近一個帶有 `data-link-name` attribute 的元素（含 `event.target` 自身），不限定特定 HTML 標籤或前端框架。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:53:#### Scenario: 點擊自身帶有 data-link-name 的元素
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:54:- **WHEN** 使用者點擊一個自身帶有 `data-link-name="FifoToolkit"` attribute 的元素，其顯示文字為翻譯後的字串（例如「治具Check In/Out」）
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:57:#### Scenario: 點擊的目標元素本身未標記，但祖先帶有 data-link-name
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:58:- **WHEN** 使用者實際點擊的元素（`event.target`）自身未標記 `data-link-name`（例如按鈕內部的圖示子元素），但其某個祖先元素帶有 `data-link-name="FifoToolkit"`
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:61:#### Scenario: data-link-name 屬性值為空字串
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:62:- **WHEN** 使用者點擊一個帶有 `data-link-name=""`（或 trim 後為空字串）attribute 的元素
## [attr.data-link-name] (0 matching lines)
## trackAttributes (229 matching lines)
README.md:5:The content of `click` events is composed entirely of the `data-*` attributes declared by the host project via `trackAttributes`; if `trackAttributes` is not declared, the package will not send any `click` events (see [Tracking Clicks: `trackAttributes`](#tracking-clicks-trackattributes) below).
README.md:13:  - [Click Tracking: `trackAttributes`](#click-tracking-trackattributes)
README.md:62:  trackAttributes: ['data-link-name', 'data-page'],
README.md:68:Once called, everything takes effect automatically: `click` event tracking (based on the fields declared in `trackAttributes`), user identity sync, and device type detection (if enabled) — with no need to modify any `onClick` code, and no need to manually call any identity API at login/logout. Full API details, required parameters, and usage examples for each capability are documented per-feature below in [Features](#features).
README.md:103:  trackAttributes: ['data-link-name'],
README.md:116:| `trackAttributes` | `string[]` (optional) | List of `data-*` attribute names to track; the `click` event payload is composed entirely and exclusively of the fields matched from this list — see [Features: Click Tracking](#click-tracking-trackattributes) below |
README.md:123:### Click Tracking: `trackAttributes`
README.md:125:Listens for clicks across the entire page, regardless of element type (`<a>`/`<button>`/others). Whether a `click` event is sent, and its content, is determined entirely by the `data-*` attributes declared via the `trackAttributes` parameter: the package does not automatically capture click text, nor does it automatically attach any other information.
README.md:130:  trackAttributes: ['data-link-name', 'data-page', 'data-section'],
README.md:146:- For each name in `trackAttributes`, the package independently searches upward from the clicked element (`event.target`) using `closest()` to find the nearest element (including itself) that carries that attribute.
README.md:148:- **If none of the `trackAttributes` names are found for a given click, no `click` event is sent for that click**; as long as at least one name matches, an event is sent with only the matched fields.
README.md:231:- **`click` events carry no default fields**: all fields must be explicitly declared by the host project via `trackAttributes`; the package provides no out-of-the-box fields.
README.md:233:- **`trackAttributes` matching relies entirely on DOM structure**: `.closest()` only searches upward through ancestors, and does not check whether the attribute semantically "actually" corresponds to this particular click; if a marker is placed carelessly and wraps unrelated content, fields may end up on click events where they don't belong. The package cannot validate this at runtime, so host projects need to be careful about marker placement.
README.md:234:- **No complete semantic filtering**: clicks are captured globally regardless of element type; `trackAttributes` matching and 300ms throttling/deduplication only reduce noise, and cannot guarantee 100% filtering of semantically ambiguous clicks.
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:8:- 允許宿主專案宣告 0～多個額外要追蹤的 `data-*` attribute 名稱（`trackAttributes`）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:20:### 1. `trackAttributes` 為字串陣列（attribute 名稱），非物件/函式
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:26:  trackAttributes?: string[]; // 新增，例如 ['data-page', 'data-section']
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:36:**選擇**：`trackAttributes: ['data-page']` 找到後，payload 直接是 `{ 'data-page': '...' }`，不去除 `data-` 前綴、不轉 camelCase。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:44:**選擇**：`trackAttributes` 中每個名稱各自執行一次 `event.target.closest('[該名稱]')`，彼此互不影響、互不依賴查找順序或層級關係。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:50:**選擇**：`trackAttributes` 陣列中任一名稱不符合 `data-` 前綴規則、或與現有固定欄位 key（`link_name`/`device_type`/`max_touch_points`）撞名，SHALL 在 `initFaro()` 執行當下立即拋出 `Error`，訊息包含觸發驗證失敗的具體名稱。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:58:**選擇**：某次點擊，`trackAttributes` 中某個 attribute 名稱往上找不到任何標記元素時，該欄位直接不出現在該次 `click` event payload 中。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:64:- **[Risk] `.closest()` 依 host DOM 結構決定命中範圍，標記位置錯誤會導致意外撈取** → 若 host 將 `trackAttributes` 標記的 attribute 放在會包住不相關內容的外層容器（例如包住整個 app 的根節點，而非僅包住實際對應的區塊，如 Navbar 元件本身），會導致該欄位出現在所有點擊事件中，即使語意上不相關；套件無法在執行期驗證「標記位置是否符合語意」，此為純宣告式設計的必然責任轉移。緩解方式：文件明確提醒 host 只在真正對應的範圍元素上標記，不要標記在跨頁面共用的外層容器上。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:66:- **[Risk] `trackAttributes` 内部 attribute 命名一致性（例如同義但打法不同的 attribute 名稱）套件無法防範** → 已知限制，非本次設計目標；由 host 自行維護 attribute 命名規範（例如集中定義常數）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:7:- 新增 `linkTracking.trackAttributes?: string[]` 設定：宿主專案宣告要額外追蹤的 `data-*` attribute 名稱清單。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:8:- 每次點擊時，套件對 `trackAttributes` 中每一個 attribute 名稱，各自從 `event.target` 開始往上 `.closest()` 查找最近一個帶有該 attribute 的元素，找到則將其值併入該次 `click` event payload；找不到則該欄位不出現在 payload 中（非錯誤）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:10:- `trackAttributes` 中每個名稱 SHALL 以 `data-` 開頭，不符合規則時 `initFaro()` 呼叫當下立即拋出明確錯誤（比照現有 `collectorDomain` 必填拋錯風格）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:11:- 若 `trackAttributes` 中的名稱與現有固定欄位 key（`link_name`、`device_type`、`max_touch_points`）撞名，`initFaro()` 呼叫當下立即拋出明確錯誤（靜態可判斷，不需等到點擊當下才發現）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:12:- 未提供 `trackAttributes` 時行為與現況完全一致，非 breaking change。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:22:- `click-tracking-package`：新增「可設定額外追蹤 attribute 清單」需求——`click` event payload 除既有欄位外，可依 `trackAttributes` 設定併入宿主專案宣告的 DOM attribute 值；新增「attribute 名稱格式驗證」與「payload key 撞名驗證」兩項拋錯需求。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:26:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（新增依 `trackAttributes` 查找並合併欄位的邏輯）、[src/initFaro.ts](../../../src/initFaro.ts)（`InitFaroConfig.linkTracking` 新增 `trackAttributes` 欄位、呼叫時驗證命名格式與撞名）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:27:- **Affected tests**：`clickInstrumentation.test.ts`（新增多 attribute 查找、找不到時欄位省略、key 直接用原始 attribute 名稱等案例）、`initFaro.test.ts`（新增 `trackAttributes` 格式驗證與撞名拋錯案例）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:28:- **Affected docs**：`README.md` 需新增 `trackAttributes` 使用範例與限制說明。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:1:## 1. `clickInstrumentation.ts` 新增 trackAttributes 查找與合併邏輯
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:3:- [x] 1.1 `ClickInstrumentationOptions` 新增選填 `trackAttributes?: string[]`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:5:- [x] 1.3 `handleClick` 內：在既有 `link_name`/`device_type`/`max_touch_points` 之外，對 `trackAttributes` 中每個名稱各自查找，找到的併入同一次 `pushEvent()` payload，key 為原始 attribute 名稱字串；找不到則該欄位不出現在 payload
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:9:- [x] 2.1 `InitFaroConfig.linkTracking` 新增選填 `trackAttributes?: string[]`，更新對應 doc comment
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:10:- [x] 2.2 新增驗證：`trackAttributes` 中任一名稱不以 `data-` 開頭時，`initFaro()` 呼叫當下拋出 `Error`，訊息包含該名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:11:- [x] 2.3 新增驗證：`trackAttributes` 中任一名稱與內建欄位 key（`link_name`/`device_type`/`max_touch_points`）相同時，`initFaro()` 呼叫當下拋出 `Error`，訊息包含該名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:12:- [x] 2.4 將 `trackAttributes` 傳入 `ClickInstrumentation` 建構子
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:16:- [x] 3.1 `clickInstrumentation.test.ts`：新增測試——單一 `trackAttributes` 項目查找成功，欄位併入 payload，key 為原始 attribute 名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:17:- [x] 3.2 新增測試：多個 `trackAttributes` 項目分別標記在不同 DOM 層級，皆能各自查找併入同一筆 payload
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:18:- [x] 3.3 新增測試：`trackAttributes` 項目查找不到時，該欄位不出現在 payload，且該次點擊事件仍正常送出（`link_name` 有效時）
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:19:- [x] 3.4 `initFaro.test.ts`：新增測試——`trackAttributes` 含未以 `data-` 開頭的名稱時拋出錯誤，訊息包含該名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:20:- [x] 3.5 新增測試：`trackAttributes` 與內建欄位 key 撞名時拋出錯誤，訊息包含該名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:21:- [x] 3.6 未提供 `trackAttributes` 時的既有測試案例應維持全數通過（回歸測試）
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:31:- [x] 5.1 更新 `README.md`：新增 `trackAttributes` 使用範例（含多個 attribute 的情境）
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:4:`initFaro()` SHALL 接受選填的 `linkTracking.trackAttributes: string[]` 設定，宿主專案可宣告 0 個以上要額外追蹤的 `data-*` attribute 名稱。未提供此欄位時行為 SHALL 與未新增本需求前完全一致，非 breaking change。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:6:#### Scenario: 未提供 trackAttributes
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:7:- **WHEN** 宿主專案呼叫 `initFaro()` 且未提供 `linkTracking.trackAttributes`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:10:### Requirement: 依 trackAttributes 查找並合併額外欄位
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:11:對 `trackAttributes` 中每一個 attribute 名稱，Package SHALL 於每次點擊時各自獨立從 `event.target` 開始，以 `closest('[該名稱]')` 查找最近一個帶有該 attribute 的元素（含 `event.target` 自身）；查找方式與既有 `data-link-name` 查找機制一致。找到則將該 attribute 的值（trim 前原始字串）以「原始 attribute 名稱」為 key，併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，SHALL NOT 視為錯誤、SHALL NOT 阻止該次 `click` event 送出。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:14:- **WHEN** `trackAttributes` 設定為 `['data-page']`，使用者點擊一個自身或祖先帶有 `data-page="checkout"` 的元素
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:18:- **WHEN** `trackAttributes` 設定為 `['data-page', 'data-section']`，使用者點擊的元素本身帶有 `data-section="form"`，其祖先帶有 `data-page="checkout"`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:22:- **WHEN** `trackAttributes` 設定為 `['data-page']`，使用者點擊的元素自身與所有祖先皆未標記 `data-page`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:25:### Requirement: trackAttributes 名稱格式驗證
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:26:`trackAttributes` 陣列中每一個名稱 SHALL 以 `data-` 開頭。若有任一名稱不符合此規則，Package SHALL 於 `initFaro()` 呼叫當下立即拋出明確錯誤，錯誤訊息 SHALL 包含不符合規則的名稱。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:28:#### Scenario: trackAttributes 含未以 data- 開頭的名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:29:- **WHEN** 宿主專案呼叫 `initFaro({ linkTracking: { trackAttributes: ['page'] } })`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:32:### Requirement: trackAttributes 與既有欄位 key 撞名驗證
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:33:`trackAttributes` 陣列中任一名稱 SHALL NOT 與內建欄位 key（`link_name`、`device_type`、`max_touch_points`）相同。若有撞名，Package SHALL 於 `initFaro()` 呼叫當下立即拋出明確錯誤，錯誤訊息 SHALL 包含撞名的名稱。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:35:#### Scenario: trackAttributes 與內建欄位 key 撞名
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:36:- **WHEN** 宿主專案呼叫 `initFaro({ linkTracking: { trackAttributes: ['link_name'] } })`
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:15:- 不透過 `trackAttributes`／`ClickInstrumentation` 傳遞裝置類型——裝置類型不是 DOM attribute，語意上不屬於「宿主專案宣告的 click 客製化欄位」，維持 `host-defined-click-payload` 對 `click` payload 的既有定位（完全、僅由 `trackAttributes` 組成）。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:27:**替代方案**：預設開啟（opt-out）——與 `host-defined-click-payload` 及既有 `trackAttributes` 的 opt-in 精神不一致，且會讓所有現有整合套件的宿主專案未經評估就多出全域事件監聽，故不採用。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:31:**選擇**：裝置類型透過 Faro SDK 原生的 `metas.add()` API 附加到 Faro 實例，套用到該實例送出的所有 signal；不透過 `ClickInstrumentation`／`trackAttributes` 傳遞。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:35:**替代方案**：讓宿主專案自行在需要時把裝置類型寫進自訂 `data-*` attribute、透過 `trackAttributes` 取得——僅能涵蓋 `click` 事件，無法涵蓋 log/trace/exception 等其他 signal，不符合「跨 signal 皆可能有用」的目標，故不採用。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/proposal.md:3:`host-defined-click-payload` 變更移除了套件對 `click` 事件的所有內建欄位（含 `device_type`/`max_touch_points`），改由宿主專案透過 `trackAttributes` 完全自訂欄位。但裝置類型（`desktop`/`tablet`）並非 DOM 上的 `data-*` attribute，宿主專案無法單純透過 `trackAttributes` 取得；且裝置類型作為「跨 signal 皆可能有用」的環境資訊（不只點擊事件，log/trace/exception 等也可能需要），語意上更適合透過 Faro 官方的 `metas` 機制附加，而非硬塞進某個特定事件的 payload。因此新增一個獨立、選配（opt-in）的裝置類型偵測與 meta 附加機制，取代舊版「裝置資訊隨 click 事件送出」的做法。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/proposal.md:12:- 裝置類型不透過 `trackAttributes`／`ClickInstrumentation` 取得或送出，維持 `host-defined-click-payload` 的既有決定（`click` 事件 payload 完全、僅由 `trackAttributes` 組成）。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/tasks.md:32:- [ ] 5.1 更新 `README.md`：新增 `enableDeviceTypeDetection` 使用範例（含 `device.type` meta 於任意 signal 出現的說明），並補上「裝置類型不透過 `trackAttributes` 取得」的提醒
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/specs/device-type-detection/spec.md:15:裝置類型並非宿主頁面 DOM 上的 `data-*` attribute，不會、也不應該透過 `trackAttributes`／`ClickInstrumentation` 取得或送出。`enableDeviceTypeDetection` 開啟時，系統 SHALL 透過 Faro 官方的 `faro.metas.add()` 機制掛上一個 meta getter，將目前裝置類型併入 Faro 內建的 `device.type` 欄位；此 getter SHALL 在每次任何 signal（`log`/`trace`/`exception`/`event`/`measurement`，包含但不限於 `click` 事件）送出前才被呼叫，使 `device.type` 即時反映呼叫當下最新的裝置類型，不需要、也不應該由使用端手動呼叫任何「更新 meta」的 API。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:8:另一個曾評估過的風險——`ClickInstrumentation.getTrackedAttributeValue()`（[clickInstrumentation.ts](../../../src/features/click/clickInstrumentation.ts)）把 `trackAttributes` 名稱直接拼進 `closest('[name]')` 選擇器字串，若名稱含非法 CSS selector 字元會讓 `closest()` 拋出 `DOMException`——經評估後決定**不**在套件內加上執行期防禦，理由見下方「決策」第 2 點。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:18:- 不為 `trackAttributes` 名稱新增任何執行期或輸入驗證層級的「非法 selector 字元」防禦；`closest()` 因非法字元拋出的例外維持現況（不捕捉），理由見下方「決策」第 2 點。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:28:曾評估在 `getTrackedAttributeValue()` 內包 try/catch，把「非法 selector 導致 `closest()` 拋例外」視為與「找不到」同一類結果。但衡量後認為：`trackAttributes` 是宿主開發者在 `initFaro()` 呼叫當下提供的組態，不是執行期才決定的動態輸入；會觸發非法 selector 的字元（例如空白、逗號、冒號等）多半是明顯的設定錯誤或複製貼上失誤，理論上應在開發/測試階段就會被發現並修正，且錯誤本身（`DOMException`）訊息已足夠明確，能直接指出問題所在的 selector 字串，不需要套件額外包裝。維持現況（不捕捉、直接拋出）讓問題在最早的時機就曝露、修正，而非被靜默吞掉導致設定錯誤長期不被注意。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:29:- 替代方案（已採用於本次變更前的草案，後撤回）：在 `getTrackedAttributeValue()` 內以 try/catch 捕捉並回傳 `undefined`，讓拼字錯誤的欄位單純「查不到」而不影響其他欄位與事件送出——撤回原因是這會讓設定錯誤變得不易察覺（開發者可能長期不知道某個 `trackAttributes` 項目其實從未生效），與「儘早暴露設定錯誤」的目標衝突。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:30:- 替代方案：在 `validateTrackAttributes()` 階段用正規表達式嚴格驗證合法 attribute name 並提早拋錯——可考慮但本次不納入範圍，留待後續有實際需求再評估。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:39:- [風險] 不處理 `closest()` 非法 selector 例外：若 `trackAttributes` 中某個名稱含非法字元，該次點擊處理會拋出未捕捉例外，且因 `ClickInstrumentation` 監聽整個 `document` 的 `click`，理論上會在**每一次點擊**時重現，影響範圍是全站點擊追蹤（甚至可能中斷宿主以程式化方式 `dispatchEvent()`/`.click()` 觸發的同步呼叫鏈）。→ 緩解：這屬於組態錯誤而非執行期不可預期的輸入，應能在開發/QA 階段的基本手動測試中被發現；`DOMException` 訊息會明確指出是哪個 selector 字串出錯，方便快速定位修正。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:5:另外一個曾強化的項目——`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS attribute selector 字元的防禦——經評估後決定**不納入本次變更範圍**：`trackAttributes` 是宿主開發者在呼叫 `initFaro()` 時提供的組態，不是執行期才決定的動態輸入，若名稱含有非法字元會在開發/測試階段就被發現，且現有的 `closest()` 拋出的 `DOMException` 訊息已足夠明確。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:12:不納入本次變更：`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS selector 字元的執行期防禦（例如包裝 `closest()` 的 try/catch）——評估後認為這屬於開發者設定錯誤，應在開發/測試階段直接暴露與修正，不需要套件防禦。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/tasks.md:8:## 2. `trackAttributes` 查找防禦非法 selector 例外（已評估後決定不處理）
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/tasks.md:10:- [x] 2.1（已移除）評估後決定：`trackAttributes` 是宿主開發者於 `initFaro()` 呼叫當下提供的組態，非執行期才決定的動態輸入；名稱含非法 selector 字元屬於明顯的設定錯誤，應在開發/測試階段被發現並修正，`closest()` 拋出的 `DOMException` 訊息已足夠明確指出問題字串。維持現況（不捕捉例外），已移除對應的 try/catch 實作與測試案例。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前疊加兩層欄位邏輯：套件內建固定欄位（`link_name`——`data-link-name` 查找 fallback 到直接文字節點、`device_type`/`max_touch_points`——依賴 `src/device/deviceTypeDetector.ts`），以及宿主專案透過 `trackAttributes` 宣告的自訂欄位（`add-custom-track-attributes` 變更引入）。兩層欄位並存導致「payload 保證會有哪些欄位」變得模糊：內建欄位無論宿主專案是否需要都會出現，而自訂欄位需另外宣告。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:5:**現況更新**：`toPayloadKey()` 轉換規則與 `validateTrackAttributes()` 的 `Set`-based「轉換後 key 於清單內部撞名」檢查，已透過合併本機 `dev` 分支（commit `18464e8`）帶入目前分支並已 commit（`5a2d321`），不再只是 `dist/` 裡的舊 build 產物。也就是說，「payload key 轉換」與「清單內部撞名檢查」這兩件事本身已經完成，本次變更真正剩下要做的，只有「移除三個內建欄位」與「移除與內建欄位撞名的檢查（因內建欄位即將不存在）」，並修正合併後發現的一個既有訊息文字 bug（見決策 3）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:11:- `trackAttributes` 機制（宣告 `data-*` attribute 名稱清單、`.closest()` 查找、找不到則省略欄位）維持不變，作為宿主專案取得 payload 欄位的唯一管道。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:19:- 不提供任何內建的「常用欄位組合」快速設定（例如「一鍵啟用 link_name」的相容選項）——升級路徑一律是宿主專案自行以 `trackAttributes` 宣告等效的 `data-*` attribute。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:20:- 不改變 `trackAttributes` 每個名稱「必須以 `data-` 開頭」的既有格式驗證規則。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:24:### 1. 移除三個內建欄位，`trackAttributes` 成為 payload 欄位的唯一來源
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:26:**選擇**：`handleClick` 不再計算 `link_name`/`device_type`/`max_touch_points`，payload 物件從空物件開始，僅由 `trackAttributes` 查找結果填入。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:28:**理由**：呼應提案「套件不會 default 帶入任何 key」的明確定位——欄位是否存在、存在哪些，完全由宿主專案透過 `trackAttributes` 宣告決定，套件不再對 payload 內容有任何預設假設，簡化套件職責且與 `trackAttributes` 機制的既有心智模型一致（宣告什麼就送什麼，不宣告就沒有）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:30:**替代方案**：以 `buildClickPayload` 回呼函式取代 `trackAttributes`——已於前一版 design 提出但經確認為誤解使用者需求而作廢；`trackAttributes` 宣告式清單已能滿足「host 自訂 attribute」的需求，且維持宣告式設計可避免引入 host 自訂函式可能拋出例外的風險，不需改為回呼函式。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:44:**選擇**：本次變更經確認目前既有實作已滿足需求，**不需再做任何修改**，只需將其套用範圍從「內建欄位 + trackAttributes」簡化為「只有 trackAttributes」（即：內建欄位移除後，payload 中自然只剩 `trackAttributes` 經轉換後的欄位，`toPayloadKey()` 本身不需任何程式碼變更）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:52:**現狀**：目前分支的 `validateTrackAttributes()`（見 [src/initFaro.ts](../../../src/initFaro.ts)，已 commit `5a2d321`）已經同時具備「與內建欄位撞名」與「轉換後 key 於清單內部撞名」兩種檢查，後者的實作方式為：依序走訪 `trackAttributes`，用一個 `Set<string>`（`seenPayloadKeys`）記錄已出現過的轉換後 key；對每個名稱計算 `toPayloadKey(name)` 後，若該 key 已存在於 `Set` 中，立即拋出錯誤，否則將該 key 加入 `Set`。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:56:**選擇**：沿用既有的 `Set`-based 撞名檢查邏輯本身；移除「轉換後 key 是否等於內建欄位 key（`link_name`/`device_type`/`max_touch_points`）」的檢查段落，因內建欄位已不存在，此檢查不再有意義；同時修正清單內部撞名分支的錯誤訊息文字，改為正確描述「與清單內其他項目轉換後重複」（例如：`[faro-click-tracking] trackAttributes 中的 "${name}" 轉換後的欄位名稱 "${payloadKey}" 與清單內其他項目重複，請改用其他名稱。`）。「名稱需以 `data-` 開頭」的既有檢查維持不變。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:64:**選擇**：`handleClick` 於 `trackAttributes` 查找完成後，若 payload 為空物件（`Object.keys(payload).length === 0`，即沒有任何 `trackAttributes` 項目命中），SHALL NOT 呼叫 `pushEvent`；只要至少一個欄位命中即送出。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:66:**理由**：原本「link_name trim 後為空字串則不送出」的防呆邏輯，本質是「這次點擊沒有任何有意義的資訊可送」；`link_name` 移除後，這個判斷標準改用「trackAttributes 是否有任何命中」延續同樣的精神，避免每次點擊都送出完全空白、無查詢價值的事件到 Loki，造成不必要的雜訊與儲存成本。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:68:**替代方案**：不論 payload 是否為空一律送出——會讓每次點擊（即使沒有標記任何 `trackAttributes`）都送出一筆空事件，對 Loki 端造成大量無意義雜訊，故不採用（已與使用者確認此決策）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:72:**選擇**：既有以 `WeakMap<EventTarget, number>` 記錄 `event.target` 最後送出時間、300ms 內重複點擊略過的機制完全保留；判定順序為先計算 payload（`trackAttributes` 查找），若為空則直接 return，非空才進行節流檢查與 `pushEvent`（與原本「先算 link_name、為空則 return、非空才節流」的順序一致，僅把判斷依據從 `link_name` 換成「payload 是否為空」）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:78:- **[Risk][BREAKING] 所有現有整合套件的宿主專案，升級後 `click` 事件會完全停止送出 `link_name`/`device_type`/`max_touch_points`，直到改為以 `trackAttributes` 宣告等效欄位** → 屬預期的破壞性變更，需在 CHANGELOG / README 明確標示為 major version bump，並提供遷移範例（例如以 `data-link-name` 取代原生 `link_name` fallback 邏輯）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:80:- **[Risk] 「payload 為空則不送出」的判斷需要每次點擊都完整跑過 `trackAttributes` 查找才能得知** → 與原本「需先算出 link_name 才能判斷是否為空」的效能特性相同，不是本次變更新增的效能疑慮；`trackAttributes` 清單通常不長（個位數），效能影響可忽略。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:81:- **[Trade-off] 放棄「開箱即用」的固定欄位，換取欄位組成的完全透明與一致性** → 對只需要基本點擊名稱追蹤的宿主專案而言，升級後需自行以 `trackAttributes` 宣告 `data-link-name` 才能維持原行為，屬本次變更明確接受的取捨。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:3:目前 `click` 事件一律固定送出 `link_name`、`device_type`、`max_touch_points` 三個套件內建欄位，宿主專案能客製化的部分僅止於額外的 `trackAttributes` 清單，兩者疊加在同一個 payload 上。隨著客製化需求增加，套件內建欄位與宿主自訂欄位並存的模式讓「哪些欄位是套件保證存在、哪些是選填」變得模糊，也讓套件背負了「幫宿主專案決定 link_name/裝置資訊怎麼算」的職責。改為完全交由宿主專案透過 `trackAttributes` 宣告要送出的欄位，套件不再 default 帶入任何欄位，可讓 payload 內容單純由宿主專案掌控，套件只負責「查找、轉換 key、送出」。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:8:- `trackAttributes` 機制維持不變：宿主專案宣告要追蹤的 `data-*` attribute 名稱清單，每次點擊時套件對每個名稱各自從 `event.target` 開始以 `.closest()` 往上查找，找到則將其值併入該次 `click` event payload；找不到則該欄位不出現，不視為錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:10:- **沿用已 commit 的驗證邏輯，並修正一個已發現的錯誤訊息 bug**：`initFaro()` 呼叫當下的 `trackAttributes` 驗證，移除「與內建欄位 key（`link_name`/`device_type`/`max_touch_points`）撞名」的檢查（因內建欄位已不存在，此檢查不再有意義）；保留並沿用已存在且已 commit 的「轉換後 key 於清單內部撞名」`Set` 檢查（見 [src/initFaro.ts](../../../src/initFaro.ts)）——對 `trackAttributes` 清單依序計算轉換後的 key，若與之前已出現過的 key 相同，`initFaro()` 呼叫當下立即拋出明確錯誤。發現當前實作在清單內部撞名分支複用了與內建欄位撞名相同的錯誤訊息文字（誤導為「內建欄位撞名」），本次變更順便修正成正確描述「與清單內其他項目轉換後重複」。「名稱需以 `data-` 開頭」的既有格式驗證維持不變。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:11:- **變更送出條件**：原本「點擊名稱 trim 後為空字串時不送出事件」的空名稱防呆，隨 `link_name` 移除而失去意義；改為「該次點擊經 `trackAttributes` 查找後，payload 為空物件（沒有任何欄位命中）時，不送出該次 `click` 事件」。只要至少有一個 `trackAttributes` 項目命中，即會送出事件（即使只有一個欄位）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:13:- `initFaro()` 的 `InitFaroConfig.trackAttributes` 欄位與其透傳給 `ClickInstrumentation` 的行為維持不變，僅更新 doc comment 反映上述驗證規則與 key 轉換規則的變化。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:14:- 裝置類型偵測模組（`src/device/`、`getDeviceType`/`DeviceType` 匯出）維持現狀，**不**在本次變更中移除——僅止於不再自動併入 `click` 事件 payload，模組本身仍保留供宿主專案視需要自行使用（例如宿主專案可自行判斷裝置類型後，寫入自己標記的 `data-*` attribute，再透過 `trackAttributes` 追蹤）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:28:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（移除 `link_name`/`device_type`/`max_touch_points` 計算邏輯與 `data-link-name`/直接文字節點擷取相關函式，改用「payload 是否為空」作為送出防呆條件；`toPayloadKey()` 已存在且已 commit，不需修改）、[src/initFaro.ts](../../../src/initFaro.ts)（`validateTrackAttributes()` 移除內建欄位撞名檢查，修正清單內部撞名檢查的錯誤訊息文字 bug，更新 doc comment；轉換後 key 撞名的 `Set` 檢查邏輯已存在且已 commit，不需修改）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:29:- **Affected tests**：`clickInstrumentation.test.ts`（移除 `link_name`/`device_type`/`max_touch_points` 相關測試案例，新增 payload 為空不送出測試、trackAttributes 命中即送出測試；payload key 轉換相關測試已存在，不需新增）、`initFaro.test.ts`（移除撞內建欄位 key 的驗證測試；「轉換後 key 撞名」拋錯測試已存在，僅需視修正後的錯誤訊息文字調整比對內容）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:30:- **Affected docs**：`README.md` 需更新「click 事件」章節，移除固定欄位說明，新增 `trackAttributes` 之 payload key 轉換規則說明與範例（含撞名情境）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:31:- **Breaking change 遷移**：既有依賴 `link_name`/`device_type`/`max_touch_points` 三個固定欄位的宿主專案，升級後這些欄位將不再出現於 `click` 事件；需改為透過 `trackAttributes` 自行標記對應的 `data-*` attribute（例如以 `data-link-name` 取代原生 `link_name` 邏輯），方能維持既有 Loki pipeline 相容。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:3:> `toPayloadKey()` 與其在 `trackAttributes` 迴圈中的套用已存在且已 commit（`5a2d321`，來自合併 `dev` 分支），以下只列出**尚待進行**的工作。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:6:- [x] 1.2 `handleClick` 改為：payload 物件從空物件開始（不再預先塞入 `link_name`/`device_type`/`max_touch_points`），僅由既有 `trackAttributes` 迴圈（沿用 `getTrackedAttributeValue()` + 已存在的 `toPayloadKey()`）填入
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:12:> `validateTrackAttributes()` 的 `Set<string>`（`seenPayloadKeys`）撞名檢查邏輯已存在且已 commit，以下只列出**尚待進行**的工作。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:14:- [x] 2.1 移除 `BUILT_IN_CLICK_EVENT_FIELD_KEYS` 常數與「`trackAttributes` 名稱轉換後是否與內建欄位 key 撞名」的檢查（`if (BUILT_IN_CLICK_EVENT_FIELD_KEYS.includes(payloadKey))` 該段落）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:15:- [x] 2.2 **修正既有錯誤訊息 bug**：`seenPayloadKeys.has(payloadKey)` 成立時目前拋出的訊息複製自內建欄位撞名分支（`"${name}" 與內建欄位 key 撞名`），語意錯誤；改為正確描述「與清單內其他項目轉換後重複」，例如：``[faro-click-tracking] trackAttributes 中的 "${name}" 轉換後的欄位名稱 "${payloadKey}" 與清單內其他項目重複，請改用其他名稱。``
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:17:- [x] 2.4 更新 `InitFaroConfig.trackAttributes` 的 doc comment：移除「SHALL NOT 與內建欄位 key 撞名」的段落，改為說明 payload key 轉換規則與清單內部撞名驗證
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:21:> 下列測試已存在且已通過（`5a2d321`），不需重複新增：`clickInstrumentation.test.ts` 的「單一 trackAttributes 項目查找成功，欄位以轉換後的名稱併入 payload」「trackAttributes 名稱含連字號時轉換」「多個 trackAttributes 項目...」「trackAttributes 項目查找不到時該欄位不出現」；`initFaro.test.ts` 的「trackAttributes 轉換後與內建欄位 key 撞名時拋出錯誤」「多個 trackAttributes 轉換後名稱重複時拋出錯誤」「trackAttributes 皆合法時正常初始化」「trackAttributes 含未以 data- 開頭的名稱時拋出錯誤」。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:24:- [x] 3.2 新增測試：所有 `trackAttributes` 皮未命中時（或未提供 `trackAttributes`），`pushEvent` 不被呼叫
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:25:- [x] 3.3 新增測試：至少一個 `trackAttributes` 命中時，`pushEvent` 被呼叫且 payload **僅**包含命中的欄位（不含 `link_name`/`device_type`/`max_touch_points`）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:26:- [x] 3.4 既有節流去重測試（300ms 內重複點擊只送第一次、超過 300ms 各自送出）改為搭配至少一個一定會命中的 `trackAttributes` 設定重寫，驗證節流邏輯不受影響（另外新增未命中的點擊不會佔用節流時間戳的測試）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:27:- [x] 3.5 `initFaro.test.ts`：移除「`trackAttributes` 轉換後與內建欄位 key 撞名時，拋出錯誤」的測試案例（因內建欄位即將移除，此檢查已不存在）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:28:- [x] 3.6 更新「多個 trackAttributes 轉換後名稱重複時，拋出錯誤」測試，將 `toThrowError(/panel_topic/)` 改為比對修正後的訊息內容（確認訊息為「與清單內其他項目重複」而非「與內建欄位撞名」）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:39:- [x] 5.2 新增 `trackAttributes` 之 payload key 轉換規則說明（含 `data-panel-topic` -> `panel_topic` 範例），並說明轉換後撞名會於 `initFaro()` 呼叫當下拋錯
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:40:- [x] 5.3 新增遷移範例：如何以 `trackAttributes` 宣告 `data-link-name` 取代原 `link_name` 邏輯（含「fallback 讀取文字節點」的行為已不再支援的提醒）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:4:點擊事件 SHALL 以事件名稱 `click` 透過 Faro `pushEvent` 送出，事件內容 SHALL 僅包含由 `trackAttributes` 查找命中的欄位（依「payload key 轉換規則」轉換過 key 名稱），套件 SHALL NOT 自動附加任何內建欄位（例如原本的 `link_name`／`device_type`／`max_touch_points`）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:7:- **WHEN** 一次點擊通過節流去重檢查，且 `trackAttributes` 查找後至少有一個欄位命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:11:`trackAttributes` 查找命中的 attribute 值，SHALL 以轉換後的 key 併入 `click` event payload，而非原始 attribute 名稱字串。轉換規則：去除開頭的 `data-` 前綴，其餘連字號 `-` 一律替換為底線 `_`。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:14:- **WHEN** `trackAttributes` 包含 `data-panel-topic`，且該次點擊查找命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:18:- **WHEN** `trackAttributes` 分別包含 `data-panel-topic` 與 `data-panel_topic`（HTML 上為兩個不同 attribute）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:22:Package SHALL 支援 `ClickInstrumentationOptions.trackAttributes?: string[]` 設定：宿主專案宣告要追蹤的 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `.closest()` 往上查找最近一個帶有該 attribute 的元素，找到則將其值以「轉換後的 key」（見「payload key 轉換規則」需求）併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，不視為錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:24:`trackAttributes` 中每個名稱 SHALL 以 `data-` 開頭，不符合規則時 `initFaro()` 呼叫當下立即拋出明確錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:27:- **WHEN** `trackAttributes` 包含 `data-page`，且該次點擊的目標元素或其祖先帶有 `data-page="checkout"`
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:31:- **WHEN** `trackAttributes` 包含 `data-page`，且該次點擊的目標元素與其祖先皆未標記 `data-page`
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:35:- **WHEN** 宿主專案呼叫 `initFaro()` 時，`trackAttributes` 中含有未以 `data-` 開頭的名稱
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:39:`initFaro()` 呼叫當下，Package SHALL 依序走訪 `trackAttributes` 清單，對每個名稱計算「payload key 轉換規則」後的結果，並記錄已出現過的轉換後 key；若某個名稱轉換後的 key 與之前已記錄過的某個 key 相同，SHALL 於該名稱處理當下立即拋出明確錯誤，訊息包含觸發撞名當下的原始 attribute 名稱與其轉換後的 key（不要求列出先前已記錄、與其撞名的另一個原始名稱）。Package SHALL NOT 再檢查 `trackAttributes` 名稱是否與任何內建欄位 key 撞名（套件已不存在內建欄位）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:42:- **WHEN** 宿主專案呼叫 `initFaro()` 時，`trackAttributes` 依序包含 `data-panel-topic` 與 `data-panel_topic`
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:46:- **WHEN** 宿主專案呼叫 `initFaro()` 時，`trackAttributes` 中每個名稱轉換後的 key 皆互不相同
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:50:當一次點擊經 `trackAttributes` 查找後，payload 為空物件（沒有任何欄位命中）時，Package SHALL 捨棄該次點擊，不送出任何 Faro 事件。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:52:#### Scenario: 所有 trackAttributes 皆未命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:53:- **WHEN** 使用者點擊一個元素，`trackAttributes` 中每個名稱皆查找不到對應標記
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:56:#### Scenario: 至少一個 trackAttributes 命中即送出
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:57:- **WHEN** 使用者點擊一個元素，`trackAttributes` 中至少一個名稱查找命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:61:Package SHALL 提供一個 `ClickInstrumentation`，於 `document` 層級監聽所有點擊事件，不依賴任何特定元素類型（例如不限定 `<a>` 或 `<button>`）。是否送出事件、送出什麼內容，完全由「payload 為空時不送出事件」與 `trackAttributes` 查找結果決定，套件 SHALL NOT 要求宿主專案於 HTML 上標記特定名稱的 attribute 才能被監聽到點擊本身。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:65:- **THEN** `ClickInstrumentation` 的點擊處理邏輯被觸發（含 `trackAttributes` 查找與空 payload 判斷），不因元素類型而略過
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:71:- **WHEN** 使用者於 300 毫秒內對同一個元素連續點擊多次，且每次 `trackAttributes` 查找皆命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:75:- **WHEN** 使用者點擊一個元素後，等待超過 300 毫秒才再次點擊同一元素，且每次 `trackAttributes` 查找皆命中
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:104:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與 `trackAttributes` 命中的欄位混雜。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:108:- **THEN** 該次 `pushEvent` 的 payload 欄位 SHALL 僅包含 `trackAttributes` 命中的欄位，SHALL NOT 包含任何使用者相關欄位
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:113:**Reason**：`link_name` 欄位不再由套件內建計算，其擷取邏輯（`data-link-name` 查找、直接文字節點擷取）整組移除；宿主專案改用 `trackAttributes` 宣告 `data-link-name` 取得等效欄位。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:114:**Migration**：宿主專案若需維持原「點擊名稱」欄位，SHALL 於 `trackAttributes` 中加入 `data-link-name`，並於 HTML 上以 `data-link-name` attribute 標記需要穩定名稱的元素；套件會依既有 `trackAttributes` 查找機制（`.closest()`）取得該值，並以轉換後的 key `link_name` 併入 payload。若需要「找不到 `data-link-name` 時 fallback 讀取元素自身直接文字節點」的行為，套件不再提供，SHALL 由宿主專案自行於需要的元素上皆標記 `data-link-name`。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:117:**Reason**：屬於「點擊名稱擷取規則」的一部分，隨該需求一併移除；`data-link-name` 標記機制本身透過 `trackAttributes` 延續（見上一項 Migration），僅「覆寫」與「fallback 文字節點」的特殊語意不再由套件內建。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:122:**Migration**：無需額外遷移，行為由「payload 為空時不送出事件」需求延續（判斷依據從「link_name 是否為空」改為「trackAttributes 是否至少有一個命中」）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:126:**Migration**：宿主專案若仍需要裝置類型資訊出現在 `click` 事件中，SHALL 自行判斷裝置類型（可沿用套件既有匯出的 `getDeviceType()`，或自行實作），將結果寫入自訂的 `data-*` attribute（例如 `data-device-type`），再透過 `trackAttributes` 宣告該 attribute 名稱以取得等效欄位。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:3:`ClickInstrumentation` 目前用 `mode`（`'all'` / `'markedOnly'`）決定找不到 `data-link-name` 時要不要 fallback 抓文字節點；`trackAttributes` 則是另一份「額外附加到 payload」的 attribute 清單，兩者查找邏輯（`closest()` + 取值）已由共用的 `getTrackedAttributeValue()` 實作，`getOverrideLinkName()` 只是對它的一層 trim 包裝。使用者確認：「客製化 attribute」就是指既有的 `trackAttributes`，不新增獨立選項；文字節點 fallback 是否完全移除留待後續 issue 討論，本次先不動。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:5:進一步討論後發現：`data-link-name` 與 `trackAttributes` 唯一差異是「是否需要在 `initFaro()` 設定 JS 選項」——`data-link-name` 只需標記 HTML，`trackAttributes` 需要額外註冊名稱才會生效。由於目前唯一實際使用情境本來就要主動設定 `trackAttributes`，這個「免設定」的預設值價值有限，決定連 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:13:- `trackAttributes` 與 `link_name` 判斷解耦：僅維持既有「附加任意欄位到 payload」的通用機制（Object 形式，各自以原始 attribute 名稱為 key），不再有「命中值被用作 link_name」的特殊規則。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:17:- 不改變 `trackAttributes` 原本「額外附加到 payload」的用途與行為。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:22:### `link_name` 僅依直接文字節點決定，`trackAttributes` 與其解耦（移除 data-link-name，也不再由 trackAttributes 覆寫）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:23:`link_name` 恢復為單純呼叫 `getDirectTextContent(target)`，不再有任何 attribute（無論是 `data-link-name` 或 `trackAttributes` 命中值）可覆寫它；`trackAttributes` 僅維持既有「依清單各自查找，找到則以原始 attribute 名稱為 key 併入 payload」的通用附加欄位機制（Object 形式）。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:25:理由：`trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能標記頁面、區塊、功能等任意維度），把它當作決定 `link_name` 的來源等於把通用附加欄位機制強行綁死到 `link_name` 這個寫死的 key 上，違反「不寫死變數名稱」的原則。移除後 `trackAttributes` 回歸單純、通用，`link_name` 判斷邏輯也更單純。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:27:替代方案（不採用一）：新增獨立的 `linkNameAttribute?: string` 選項，與 `trackAttributes`（附加欄位清單）分開。使用者已確認不需要。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:29:替代方案（不採用二）：保留 `data-link-name` 作為 fallback，或讓 `trackAttributes` 命中值覆寫 `link_name`。使用者確認 `trackAttributes` 不應與 `link_name` 綁定，決定完全解耦。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:38:- **BREAKING**：原本仰賴 `data-link-name` 或 `trackAttributes` 命中值決定 `link_name` 的宿主專案，`link_name` 會改回只取自身直接文字節點內容。→ Mitigation：於 proposal 中明確標記 BREAKING；若宿主專案需要穩定、與顯示文字無關的名稱，可改用 `trackAttributes` 將該 attribute 值以其原始名稱附加到 payload 中的其他欄位，自行在後端／查詢時使用該欄位。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:39:- **BREAKING**：僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，`link_name` 會整批改變為 fallback 文字節點內容或完全不同的值。→ Mitigation：proposal 中明確標記 BREAKING，並提示改為在 `trackAttributes` 註冊該 attribute 名稱。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:3:`getOverrideLinkName()` 只是 `getTrackedAttributeValue(element, LINK_NAME_ATTRIBUTE)?.trim()` 的單純包裝，沒有獨立邏輯，徒增一層間接呼叫。另外 `ClickInstrumentation` 目前的 `mode`（`'all'` / `'markedOnly'`）與「文字節點 fallback」機制增加了設定複雜度與行為分歧。進一步檢視後發現，套件內建的 `data-link-name` attribute 與宿主專案自訂的 `trackAttributes` 清單本質上做同一件事（`closest()` 查找＋取值），差別只在於 `data-link-name` 免去了「先在 `trackAttributes` 註冊一次」這個步驟；但目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個「免設定」的價值低於多維護一條路徑、多兩個規格需求的成本，因此決定連同 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:5:再進一步檢視發現，`trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能只是想標記頁面／區塊／功能等任意維度），把它當作決定 `link_name` 的來源等於強行把一個通用的附加欄位機制綁死到 `link_name` 這個寫死的 key 上。因此改回：`trackAttributes` 僅作為既有的「附加任意欄位到 payload」通用機制（以 Object 形式、各自以原始 attribute 名稱為 key），與 `link_name` 完全脫鉤；`link_name` 單純依「自身直接文字節點」決定，不再有任何 attribute 可覆寫它。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:12:- `trackAttributes` 恢復為單純的通用附加欄位機制：依清單各自查找，找到則以原始 attribute 名稱為 key 併入 payload（Object 形式），與 `link_name` 判斷完全無關；不再有「第一個命中值被用作 link_name」的特殊規則。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:17:- `click-tracking-package`: 點擊名稱擷取規則變更為「僅依自身直接文字節點決定，無 attribute 可覆寫」，移除 `data-link-name` 與 `mode` 選項相關需求；`trackAttributes` 與 `link_name` 判斷解耦，維持既有「附加欄位」需求不變。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:22:- 對外 API 破壞性變更：移除 `mode` 選項與 `ClickTrackingMode` 型別匯出；移除 `data-link-name` 支援；`trackAttributes` 不再影響 `link_name`。原本仰賴「標記 `data-link-name` 或 `trackAttributes` 命中值決定 link_name」的宿主專案，`link_name` 會改回只取該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:5:- [x] 1.3 新增 `link_name` 決定邏輯：依序遍歷 `trackAttributes`，取第一個 `getTrackedAttributeValue()` 命中（非 `undefined`）的值（trim 後）；若皆未命中，fallback 至既有 `getDirectTextContent(target)`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:6:- [x] 1.4 確認「額外附加到 payload」迴圈維持不變（`trackAttributes` 命中的 attribute 仍以原始名稱併入 payload，即使該值已被用作 `link_name`）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:11:- [x] 2.2 新增測試：`trackAttributes` 依清單順序取第一個命中值
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:12:- [x] 2.3 新增測試：`trackAttributes` 皆查無時 fallback 回文字節點
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:25:## 5. link_name 與 trackAttributes 解耦（設計反悔修正）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:27:- [x] 5.1 移除 `handleClick()` 中「依序遍歷 `trackAttributes` 決定 `link_name`」的迴圈；`link_name` 改為固定呼叫 `getDirectTextContent(target)`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:28:- [x] 5.2 更新 `ClickInstrumentationOptions.trackAttributes` 的註解，移除「同時也是決定 link_name 的來源」的描述，恢復為單純的附加欄位說明
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:29:- [x] 5.3 更新 `clickInstrumentation.test.ts`：還原/移除先前新增的「trackAttributes 命中決定 link_name」相關測試斷言，改為驗證 `trackAttributes` 命中不影響 `link_name`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:35:- [x] 6.1 `InitFaroConfig` 移除 `linkTracking` 巢狀物件，`trackAttributes?: string[]` 改為頂層欄位；更新 doc comment，移除過時的「決定 link_name 的唯一客製化來源」描述
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:36:- [x] 6.2 `validateTrackAttributes(config.linkTracking?.trackAttributes)` 改為 `validateTrackAttributes(config.trackAttributes)`；錯誤訊息中的 `linkTracking.trackAttributes` 字樣改為 `trackAttributes`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:37:- [x] 6.3 `new ClickInstrumentation({ trackAttributes: config.linkTracking?.trackAttributes })` 改為 `new ClickInstrumentation({ trackAttributes: config.trackAttributes })`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:38:- [x] 6.4 更新 `initFaro.test.ts` 中所有 `linkTracking: { trackAttributes: [...] }` 呼叫改為 `trackAttributes: [...]`，describe 標題同步更新
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:4:點擊名稱 SHALL 僅擷取 `event.target` 自身的直接文字節點內容（`childNodes` 中 `nodeType` 為文字節點者），並 trim 前後空白；SHALL NOT 遞迴擷取子孫元素的文字內容。點擊名稱擷取 SHALL NOT 依賴任何 `data-*` attribute（包含 `trackAttributes` 清單中的 attribute），`trackAttributes` 僅用於「額外附加欄位到 payload」（見「trackAttributes 附加欄位」需求），與點擊名稱決定完全無關。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:14:#### Scenario: trackAttributes 命中不影響 link_name
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:15:- **WHEN** 套件設定 `trackAttributes: ['data-page']`，使用者點擊一個帶有 `data-page="checkout"`、自身直接文字節點為「確認」的元素
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:20:### Requirement: trackAttributes 附加欄位
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:21:Package SHALL 支援宿主專案於 `initFaro({ trackAttributes })` 宣告一份 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `closest()` 往上查找最近一個帶有該 attribute 的元素（含自身），找到則將其值以「原始 attribute 名稱」為 key 併入同一筆 `click` event payload（Object 形式）；找不到則該欄位不出現在 payload 中，不視為錯誤。此機制與「點擊名稱擷取規則」完全無關，SHALL NOT 影響 `link_name` 的決定。此設定 SHALL 為 `InitFaroConfig` 的頂層欄位，SHALL NOT 巢狀於任何以「link」命名的物件之下——套件可追蹤任意 attribute，並非只限定於 link 相關用途。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:23:#### Scenario: 單一 trackAttributes 項目查找成功
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:24:- **WHEN** 套件設定 `trackAttributes: ['data-page']`，使用者點擊一個帶有 `data-page="checkout"` 的元素
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:27:#### Scenario: 多個 trackAttributes 項目分別標記在不同 DOM 層級
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:28:- **WHEN** 套件設定 `trackAttributes: ['data-page', 'data-section']`，使用者點擊的元素本身未標記，但其祖先分別帶有 `data-page="checkout"` 與 `data-section="form"`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:31:#### Scenario: trackAttributes 項目查找不到
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:32:- **WHEN** 套件設定 `trackAttributes: ['data-page']`，使用者點擊一個未帶 `data-page` 的元素
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:38:**Reason**: `data-link-name` 與 `trackAttributes` 的查找邏輯（`closest()` 查找＋取值）完全相同，唯一差異是「免 JS 設定即可生效」；但套件目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個免設定的預設值價值有限，維護兩條路徑、兩份規格需求的成本高於效益。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:39:**Migration**: 原本僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，需改為在 `initFaro({ trackAttributes: ['data-link-name'] })` 中明確註冊該 attribute 名稱；該值會以「額外附加欄位」的形式出現在 payload 中（key 為 `data-link-name`），但不再覆寫 `link_name`——`link_name` 一律採用該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:41:### Requirement: trackAttributes 可覆寫 link_name
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:42:**Reason**: `trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能用它標記頁面、區塊、功能等任意維度），將其中命中值強制當作 `link_name` 的來源，等於把通用的附加欄位機制綁死到 `link_name` 這個寫死的 key 上。點擊名稱擷取規則改為與 `trackAttributes` 完全解耦，`trackAttributes` 回歸單純的「附加任意欄位到 payload」通用機制。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:43:**Migration**: 原本依賴 `trackAttributes` 命中值決定 `link_name` 的宿主專案，`link_name` 會改為該元素自身的直接文字節點內容；該 attribute 的原始值仍會以「原始 attribute 名稱」為 key 出現在同一筆 payload 中（見「trackAttributes 附加欄位」需求），未消失，僅不再寫入 `link_name`。
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:4:function setupInstrumentation(trackAttributes: string[] = []) {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:6:  const instrumentation = new ClickInstrumentation({ trackAttributes });
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:23:  it('未提供 trackAttributes 時，點擊任意元素皆不送出事件', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:34:  it('trackAttributes 皆未命中時（payload 為空物件），不送出事件', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:45:  it('單一 trackAttributes 項目查找成功，payload 僅包含轉換後名稱（去除 data- 前綴、"-" 轉 "_"）的該欄位', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:59:  it('trackAttributes 名稱含連字號時，轉換後的欄位名稱把 "-" 改為 "_"（避免 Loki event_data_ 欄位含連字號無法被 query 解析）', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:73:  it('多個 trackAttributes 項目分別標記在不同 DOM 層級，皆能各自查找併入同一筆 payload（欄位名稱皆已轉換）', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:93:  it('trackAttributes 部分項目查找不到時，payload 僅包含命中的欄位，該次點擊事件仍正常送出', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:22:  trackAttributes?: string[];
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:48:  private readonly trackAttributes: string[];
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:55:    this.trackAttributes = options.trackAttributes ?? [];
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:64:    // payload 完全由 trackAttributes 查找結果組成，套件不 default 帶入任何欄位；
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:68:    for (const attributeName of this.trackAttributes) {
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:75:    // 沒有任何 trackAttributes 命中時，這次點擊沒有可送的資訊，不送出事件（也不佔用節流時間戳記）。
src/faro-click-tracking/src/initFaro/initFaro.test.ts:133:describe('initFaro() 的 trackAttributes 驗證', () => {
src/faro-click-tracking/src/initFaro/initFaro.test.ts:138:  it('trackAttributes 含未以 data- 開頭的名稱時，拋出錯誤且訊息包含該名稱', () => {
src/faro-click-tracking/src/initFaro/initFaro.test.ts:139:    expect(() => initFaro({ ...baseConfig(), trackAttributes: ['page'] })).toThrowError(/page/);
src/faro-click-tracking/src/initFaro/initFaro.test.ts:143:  it('trackAttributes 皆合法時，initFaro() 正常初始化，不拋錯', () => {
src/faro-click-tracking/src/initFaro/initFaro.test.ts:144:    expect(() => initFaro({ ...baseConfig(), trackAttributes: ['data-page'] })).not.toThrow();
src/faro-click-tracking/src/initFaro/initFaro.test.ts:148:  it('多個 trackAttributes 轉換後名稱重複時，拋出錯誤，訊息描述為「與清單內其他項目重複」而非內建欄位撞名', () => {
src/faro-click-tracking/src/initFaro/initFaro.test.ts:152:        trackAttributes: ['data-panel-topic', 'data-panel_topic'],
src/faro-click-tracking/src/initFaro/initFaro.test.ts:158:  it('未提供 trackAttributes 時，行為與現況一致，不拋錯', () => {
src/faro-click-tracking/src/initFaro/initFaro.ts:60:  trackAttributes?: string[];
src/faro-click-tracking/src/initFaro/initFaro.ts:69:   *    無法、也不應該透過 `trackAttributes`／`ClickInstrumentation` 取得，改用 Faro
src/faro-click-tracking/src/initFaro/initFaro.ts:81:function validateTrackAttributes(trackAttributes: string[] | undefined): void {
src/faro-click-tracking/src/initFaro/initFaro.ts:82:  if (!trackAttributes) {
src/faro-click-tracking/src/initFaro/initFaro.ts:86:  for (const name of trackAttributes) {
src/faro-click-tracking/src/initFaro/initFaro.ts:89:        `[faro-click-tracking] trackAttributes 中的 "${name}" 必須以 "data-" 開頭。`,
src/faro-click-tracking/src/initFaro/initFaro.ts:95:        `[faro-click-tracking] trackAttributes 中的 "${name}" 轉換後的欄位名稱 "${payloadKey}" 與清單內其他項目重複，` +
src/faro-click-tracking/src/initFaro/initFaro.ts:107: * 僅由 `trackAttributes` 命中的欄位組成，套件不 default 帶入任何欄位。
src/faro-click-tracking/src/initFaro/initFaro.ts:114:  validateTrackAttributes(config.trackAttributes);
src/faro-click-tracking/src/initFaro/initFaro.ts:128:        trackAttributes: config.trackAttributes,
src/faro-click-tracking/src/initFaro/initFaro.ts:139:    // 選用 `device.type`（MetaDevice 官方欄位）而非自訂 trackAttributes，是因為裝置類型並非
## ClickInstrumentation (130 matching lines)
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前只支援單一標記 attribute `data-link-name`（或自訂 `attributeName`），透過 `element.closest()` 往上查找，決定 `link_name` 欄位。討論過程中曾評估函式型 `getExtraFields(target) => Record<string,string>` 方案，但因 typo 風險、例外處理複雜度、side effect 疑慮，最終定案採用最小化的宣告式方案：宿主專案只給「要追蹤哪些 attribute 名稱」，查找/合併邏輯完全由套件比照既有 `data-link-name` 機制實作，不引入任何 host 自訂函式。詳見 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md)。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:26:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（新增依 `trackAttributes` 查找並合併欄位的邏輯）、[src/initFaro.ts](../../../src/initFaro.ts)（`InitFaroConfig.linkTracking` 新增 `trackAttributes` 欄位、呼叫時驗證命名格式與撞名）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:27:- **Affected tests**：`clickInstrumentation.test.ts`（新增多 attribute 查找、找不到時欄位省略、key 直接用原始 attribute 名稱等案例）、`initFaro.test.ts`（新增 `trackAttributes` 格式驗證與撞名拋錯案例）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:1:## 1. `clickInstrumentation.ts` 新增 trackAttributes 查找與合併邏輯
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:3:- [x] 1.1 `ClickInstrumentationOptions` 新增選填 `trackAttributes?: string[]`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:12:- [x] 2.4 將 `trackAttributes` 傳入 `ClickInstrumentation` 建構子
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:16:- [x] 3.1 `clickInstrumentation.test.ts`：新增測試——單一 `trackAttributes` 項目查找成功，欄位併入 payload，key 為原始 attribute 名稱
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:3:`ClickInstrumentation`（[clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）目前只送出 `link_name` 一個欄位；裝置資訊（`device_type`/`max_touch_points`）由 `initFaro()`（[initFaro.ts](../../../src/initFaro.ts)）透過 Faro `metas` 機制計算一次並附加到「該次初始化後送出的所有 Faro signal」。宿主專案回報：既有 Loki pipeline 只解析 `pushEvent()` 的 event payload，不會讀取 `metas`，因此裝置資訊實際上進不了 Loki。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:23:**選擇**：`ClickInstrumentation` 直接 import `getDeviceType()`（[deviceType.ts](../../../src/deviceType.ts)），於 `handleClick` 組 payload 時呼叫 `getDeviceType()` 與讀取 `navigator.maxTouchPoints`，取得當下最新值後一併送出。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:28:- 保留 `metas`，另外在 `initFaro()` 把裝置資訊透過建構子傳給 `ClickInstrumentation`——放棄，多一層傳遞、且仍需在 `initFaro()` 當下計算一次，準確度不如即時讀取。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:29:- `ClickInstrumentation` 自行重寫一份 `maxTouchPoints > 0 ? 'tablet' : 'desktop'` 判斷邏輯——放棄，重複既有 `deviceType.ts` 邏輯，維護成本增加。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:41:**選擇**：只修改 `ClickInstrumentation`；不觸碰 `getWebInstrumentations()`/`TracingInstrumentation` 等其他 instrumentation 的 payload。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/proposal.md:7:- `ClickInstrumentation` 送出的 `click` 事件 payload 新增 `device_type`、`max_touch_points` 欄位，與既有 `link_name` 一起透過 `pushEvent()` 送出。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/proposal.md:24:- 程式碼：`src/clickInstrumentation.ts`（新增欄位）、`src/initFaro.ts`（移除 `metas` 設定）、`src/deviceMeta.ts` 與 `src/deviceMeta.test.ts`（刪除）、`src/index.ts`（移除對應 export）、`src/clickInstrumentation.test.ts`（補測試）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/proposal.md:26:- 相依：`getDeviceType()`（`src/deviceType.ts`）繼續保留並被 `ClickInstrumentation` 直接使用；不影響其 public export。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/tasks.md:1:## 1. ClickInstrumentation 送出裝置欄位
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/tasks.md:3:- [x] 1.1 於 `src/clickInstrumentation.ts` import `getDeviceType`（`./deviceType`）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/tasks.md:16:- [x] 3.1 更新 `src/clickInstrumentation.test.ts` 既有測試：`pushEvent` 斷言補上 `device_type`/`max_touch_points`（jsdom 預設 `maxTouchPoints` 為 0 → `device_type: 'desktop'`, `max_touch_points: '0'`）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-device-type-detection/design.md:18:- 不涉及 `click-tracking-package` 既有 spec（`initFaro()`、`ClickInstrumentation` 等）的行為變更，僅調整 `device_type` 計算的資料來源。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:27:### 1. 用獨立 `ClickInstrumentation`，不沿用 Faro 內建 `UserActionInstrumentation`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:31:**選擇**：另外實作一個獨立的 `ClickInstrumentation extends BaseInstrumentation`，監聽 `click` 事件，不要求任何 attribute，與內建的 `UserActionInstrumentation` 平行存在、互不衝突（`initFaro()` 內部仍會透過 `getWebInstrumentations()` 帶出所有預設 instrumentation，只是這次不使用它的 attribute 慣例）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:76:`initFaro()` 內部仍組合 `getWebInstrumentations()` + `TracingInstrumentation` + 本次新增的 `ClickInstrumentation`，並把裝置 meta 加進 `metas`。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:78:**替代方案考慮過**：Option B（套件只出 `ClickInstrumentation`/裝置 meta 積木，宿主自行呼叫 `initializeFaro()`）——更composable、不易與宿主既有其他 instrumentation 衝突，但使用端已明確選擇 Option A（一行 `initFaro()` 啟動的體驗優先）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:88:- **[風險] `WeakMap` 節流狀態存在 `ClickInstrumentation` 實例的生命週期內，若同一頁面存在多個 `initFaro()` 呼叫（理論上不應發生，但無強制防呆）可能出現各自獨立的節流狀態** → [緩解] 文件明確要求 `initFaro()` 全應用生命週期只呼叫一次；不在程式碼層級強制單例。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/proposal.md:8:- 新增 `ClickInstrumentation`（繼承 Faro `BaseInstrumentation`）：於 `document` 層級監聽全域點擊事件，不限定元素類型（不限 `<a>`/`<button>`）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/tasks.md:12:## 3. ClickInstrumentation
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/tasks.md:14:- [x] 3.1 實作 `ClickInstrumentation extends BaseInstrumentation`，於 `initialize()` 中對 `document` 註冊 `click` 事件監聽（不限元素類型）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/tasks.md:23:- [x] 4.2 於 `initFaro()` 內部組合 `initializeFaro()` 呼叫：帶入 `getWebInstrumentations()` + `TracingInstrumentation`（依傳入後端網域清單設定）+ `ClickInstrumentation`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:22:Package SHALL 提供一個 `ClickInstrumentation`，於 `document` 層級監聽所有點擊事件，不依賴任何特定元素類型（例如不限定 `<a>` 或 `<button>`），也 SHALL NOT 要求宿主專案於 HTML 上標記任何 data attribute。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:26:- **THEN** `ClickInstrumentation` 的點擊處理邏輯被觸發，不因元素類型而略過
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:3:`ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）自 [faro-click-tracking-package](../faro-click-tracking-package/design.md) change 建立以來，`link_name` 一律取自 `event.target` 自身的直接文字節點，且該 change 的 design 明確記錄了一個決策：**點擊追蹤不要求宿主專案標記任何 HTML attribute**（不沿用 Faro 內建 `UserActionInstrumentation` 的 `data-faro-user-action-name` 慣例），理由是「使用端明確表示不想在既有 HTML 上加任何標記」。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:24:**選擇**：`ClickInstrumentation` 新增規則——若 `event.target` 自身或其祖先帶有 `data-link-name` attribute，優先採用該屬性值作為 `link_name`；未標記時維持原本的直接文字節點擷取規則。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:3:`ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）目前的 `link_name` 一律擷取自被點擊元素自身的直接文字節點。宿主專案 Foreman-Assistant 回報：這個文字通常來自 i18n 翻譯後的顯示字串，會隨語系改變（中/英文字不同），且觀察到 Loki 端某些翻譯文字前後帶有斜線（例如 `event_data_link_name="/治具Check In/Out/"`），導致 dashboard 讀不到穩定、可比對的連結名稱，還得額外做「不同語系文字 → 同一個邏輯連結」的 mapping，增加維運成本。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:9:- `ClickInstrumentation` 新增「`data-link-name` attribute 覆寫」規則：若被點擊元素自身或其祖先帶有 `data-link-name` attribute，直接採用該屬性值（trim 後）作為 `link_name`，不再讀取文字節點；查找方式為由 `event.target` 往上找最近帶有該 attribute 的元素（含自身），不限定特定 HTML 標籤或框架，任何宿主專案皆可採用。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:26:- 程式碼：修改 `src/clickInstrumentation.ts`（`handleClick` 新增 attribute 優先查找邏輯）、`src/clickInstrumentation.test.ts`（新增覆寫規則相關測試）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:1:## 1. `clickInstrumentation.ts` 新增 attribute 覆寫規則
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/design.md:5:本次需求是使用者身分識別，情境不同：`user`（`MetaUser`）是 Faro 官方已知的 Meta schema 欄位（與 `session`/`browser`/`os` 同層級）。已透過實機測試確認：呼叫 `faro.metas.add({ user: { id } })` 後，Alloy 會正確將其攤平合併進送往 Loki 的 log body（欄位命名為 `user_id`，與既有 `session_id`/`browser_name` 走同一套底線命名規則），且此行為對 log/event/exception 等多種訊號類型皆成立（見 Alloy `internal/component/faro/receiver/exporters.go` 的 `payload.MergeKeyVal(kv, meta)`）。因此本次不會重蹈裝置資訊被丟棄的問題，可以直接採用 metas 機制，不需要修改 `ClickInstrumentation` 的事件 payload。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/design.md:19:- 不修改 `ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）既有的 `click` 事件欄位（`link_name`/`device_type`/`max_touch_points`）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/design.md:33:- 若改用類似裝置資訊的做法（塞進 `ClickInstrumentation` 的 `pushEvent` payload），使用者資訊將只出現在 `click` 事件，其餘訊號類型讀不到，不符合本次目標。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/design.md:37:- 比照裝置資訊，在 `ClickInstrumentation.handleClick` 內讀取目前使用者並塞進 `pushEvent` payload——放棄，範圍過窄（只涵蓋 click 事件），且與 metas 機制的既有驗證結果（`user` 能正常運作）不符，沒有必要迴避官方機制。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/proposal.md:14:- 不修改 `ClickInstrumentation` 的 `pushEvent` payload——使用者資訊透過 metas 機制自動附加到所有 Faro signal，不需要、也不會在事件本身的 payload 中重複帶出使用者欄位。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/proposal.md:30:- 相依：不影響 `ClickInstrumentation`（`src/clickInstrumentation.ts`）既有行為與其 `click` 事件欄位（`link_name`/`device_type`/`max_touch_points`）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/proposal.md:32:- 已知但不在本次範圍內：Alloy 端觀察到「有 `trace_id` 關聯的 log」會額外出現一個以 OTel 點號命名的重複欄位（例如 `event_data_user.id`），與本次 metas 附加的 `user_id`（底線命名）並存。此現象源自 Alloy/後端 OTel pipeline 對 trace 關聯 log 的屬性合併行為，非本套件或 `ClickInstrumentation` 產生，需另外由 Alloy／後端設定負責人評估是否調整，不在本次 change 的程式碼變更範圍內。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/tasks.md:20:- [x] 3.5 確認 `src/clickInstrumentation.test.ts` 既有測試不受影響（`click` 事件 payload 仍只包含 `link_name`／`device_type`／`max_touch_points`，未混入使用者欄位）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/specs/click-tracking-package/spec.md:29:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與既有 `link_name`／`device_type`／`max_touch_points` 欄位混雜。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/design.md:3:目前 `initFaro()`（[initFaro.ts](../../../src/initFaro.ts)）只負責建立 Faro 實例與掛載 `ClickInstrumentation`；使用者身分透過 [faroUser.ts](../../../src/user/faroUser.ts) 提供的 `setFaroUser()`/`clearFaroUser()` 由宿主專案在登入/登出等程式碼位置手動呼叫。這個模式的問題是呼叫點分散、容易遺漏（尤其是「頁面重新整理後還原已登入身分」這種容易被忽略的情境）。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/design.md:12:- 自動同步邏輯與既有 `ClickInstrumentation` 職責分離，各自獨立可測試。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/design.md:25:**理由**：push 式雖然沒有同步延遲的問題，但要求宿主把自己的狀態管理（Redux store / NgRx / 自訂 EventTarget）包成 `subscribe` 介面，屬於中高侵入性；pull 式只要求宿主提供一個「讀取當下身分」的純函式，門檻低很多，且套件可以自己決定何時呼叫、統一處理節流與例外，跟現有 `ClickInstrumentation` 的架構風格一致。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/design.md:27:### 2. 獨立的 `UserSyncInstrumentation`，不與 `ClickInstrumentation` 合併
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/design.md:29:**替代方案**：直接在既有 `ClickInstrumentation.handleClick` 裡加同步呼叫。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/proposal.md:8:- 新增 `UserSyncInstrumentation`（獨立於既有 `ClickInstrumentation`），當 `initFaro()` 收到 `getUser` 時自動掛載：
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/proposal.md:27:- **不影響**：`ClickInstrumentation`、裝置偵測相關程式碼。
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/tasks.md:18:- [x] 3.3 確認既有 `faroUser.test.ts`、`clickInstrumentation.test.ts` 不受影響（維持全數通過）
src/faro-click-tracking/openspec/changes/auto-sync-faro-user/specs/user-identity-auto-sync/spec.md:50:- **THEN** 套件攔截該例外，視同 `getUser()` 回傳 `null` 處理後續比對邏輯，且該次觸發事件（如 click）的其他既有行為（例如 `ClickInstrumentation` 的點擊追蹤）不受影響
src/faro-click-tracking/openspec/changes/decouple-faro-instance-registry/design.md:3:`faroInstance` 單例狀態、`registerFaroInstance()`、以及「取得已註冊實例、未註冊時拋出錯誤」的邏輯目前都寫在 [faroUser.ts](../../../src/user/faroUser.ts) 內。這是套件內部所有「非 instrumentation 對外 API」（不像 `ClickInstrumentation` 能由 Faro SDK 框架自動注入 `api`）用來存取 Faro 實例的共用機制，理應與 user 領域邏輯分離。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:3:`host-defined-click-payload` 完成後，`ClickInstrumentation` 不再計算或送出任何裝置資訊，`src/device/deviceTypeDetector.ts` 原本仍在模組載入時自動 `document.addEventListener('pointerdown', ...)`，成為一個「沒有任何欄位消費、卻仍持續監聽全域事件」的孤兒模組。此次變更重新賦予這個模組明確用途：讓宿主專案可選擇性開啟裝置類型偵測，透過已對外匯出的 `getDeviceType()` 自行查詢並決定如何使用，取代舊版「裝置資訊隨 click 事件自動送出」的做法。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:15:- 不透過 `trackAttributes`／`ClickInstrumentation` 傳遞裝置類型——裝置類型不是 DOM attribute，語意上不屬於「宿主專案宣告的 click 客製化欄位」，維持 `host-defined-click-payload` 對 `click` payload 的既有定位（完全、僅由 `trackAttributes` 組成）。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:31:**選擇**：裝置類型透過 Faro SDK 原生的 `metas.add()` API 附加到 Faro 實例，套用到該實例送出的所有 signal；不透過 `ClickInstrumentation`／`trackAttributes` 傳遞。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/design.md:55:- **[Risk] 忘記呼叫 `stopDeviceTypeDetection()` 導致監聽在測試/元件卸載後持續存在** → 目前套件未提供自動清理機制（`initFaro()` 也沒有對應的「銷毀」流程），與既有 `ClickInstrumentation`/`UserSyncInstrumentation` 目前的生命週期管理方式一致（皆假設 `initFaro()` 只呼叫一次、伴隨頁面整個生命週期），非本次變更引入的新風險，暫不處理。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/proposal.md:12:- 裝置類型不透過 `trackAttributes`／`ClickInstrumentation` 取得或送出，維持 `host-defined-click-payload` 的既有決定（`click` 事件 payload 完全、僅由 `trackAttributes` 組成）。
src/faro-click-tracking/openspec/changes/device-type-meta-tracking/specs/device-type-detection/spec.md:15:裝置類型並非宿主頁面 DOM 上的 `data-*` attribute，不會、也不應該透過 `trackAttributes`／`ClickInstrumentation` 取得或送出。`enableDeviceTypeDetection` 開啟時，系統 SHALL 透過 Faro 官方的 `faro.metas.add()` 機制掛上一個 meta getter，將目前裝置類型併入 Faro 內建的 `device.type` 欄位；此 getter SHALL 在每次任何 signal（`log`/`trace`/`exception`/`event`/`measurement`，包含但不限於 `click` 事件）送出前才被呼叫，使 `device.type` 即時反映呼叫當下最新的裝置類型，不需要、也不應該由使用端手動呼叫任何「更新 meta」的 API。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:5:1. `registerFaroInstance()`（[faroInstance.ts](../../../src/core/faroInstance/faroInstance.ts)）直接覆蓋模組級變數，`initFaro()`（[initFaro.ts](../../../src/initFaro/initFaro.ts)）每次呼叫都會 `new` 出新的 `ClickInstrumentation`/`UserSyncInstrumentation`，各自在 `initialize()` 註冊一次 `document`/`window` listener，重複呼叫會疊加 listener。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:8:另一個曾評估過的風險——`ClickInstrumentation.getTrackedAttributeValue()`（[clickInstrumentation.ts](../../../src/features/click/clickInstrumentation.ts)）把 `trackAttributes` 名稱直接拼進 `closest('[name]')` 選擇器字串，若名稱含非法 CSS selector 字元會讓 `closest()` 拋出 `DOMException`——經評估後決定**不**在套件內加上執行期防禦，理由見下方「決策」第 2 點。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:19:- 不讓套件真正支援 SSR 渲染（例如伺服器端也能追蹤點擊），只確保 import 階段不拋例外；`enableDeviceTypeDetection`、`ClickInstrumentation` 等瀏覽器限定功能仍只能在瀏覽器環境下呼叫。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:39:- [風險] 不處理 `closest()` 非法 selector 例外：若 `trackAttributes` 中某個名稱含非法字元，該次點擊處理會拋出未捕捉例外，且因 `ClickInstrumentation` 監聽整個 `document` 的 `click`，理論上會在**每一次點擊**時重現，影響範圍是全站點擊追蹤（甚至可能中斷宿主以程式化方式 `dispatchEvent()`/`.click()` 觸發的同步呼叫鏈）。→ 緩解：這屬於組態錯誤而非執行期不可預期的輸入，應能在開發/QA 階段的基本手動測試中被發現；`DOMException` 訊息會明確指出是哪個 selector 字串出錯，方便快速定位修正。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:5:另外一個曾強化的項目——`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS attribute selector 字元的防禦——經評估後決定**不納入本次變更範圍**：`trackAttributes` 是宿主開發者在呼叫 `initFaro()` 時提供的組態，不是執行期才決定的動態輸入，若名稱含有非法字元會在開發/測試階段就被發現，且現有的 `closest()` 拋出的 `DOMException` 訊息已足夠明確。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:12:不納入本次變更：`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS selector 字元的執行期防禦（例如包裝 `closest()` 的 try/catch）——評估後認為這屬於開發者設定錯誤，應在開發/測試階段直接暴露與修正，不需要套件防禦。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:25:- 受影響程式碼：[initFaro.ts](../../../src/initFaro/initFaro.ts)、[faroInstance.ts](../../../src/core/faroInstance/faroInstance.ts)、[clickInstrumentation.ts](../../../src/features/click/clickInstrumentation.ts)、[deviceTypeDetector.ts](../../../src/features/device/deviceTypeDetector.ts)。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/specs/click-tracking-package/spec.md:4:Package SHALL 防止 `initFaro()` 被呼叫超過一次：當 `initFaro()` 已成功建立過 Faro 實例後，任何後續呼叫 SHALL 立即拋出明確錯誤，SHALL NOT 建立新的 Faro 實例、SHALL NOT 註冊任何新的 `ClickInstrumentation`／`UserSyncInstrumentation` listener，也 SHALL NOT 覆蓋先前已註冊的 Faro 實例參照。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前疊加兩層欄位邏輯：套件內建固定欄位（`link_name`——`data-link-name` 查找 fallback 到直接文字節點、`device_type`/`max_touch_points`——依賴 `src/device/deviceTypeDetector.ts`），以及宿主專案透過 `trackAttributes` 宣告的自訂欄位（`add-custom-track-attributes` 變更引入）。兩層欄位並存導致「payload 保證會有哪些欄位」變得模糊：內建欄位無論宿主專案是否需要都會出現，而自訂欄位需另外宣告。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:18:- 不移除或變更裝置類型偵測模組（`src/device/deviceType.ts`、`deviceTypeDetector.ts`）與其公開匯出（`getDeviceType`/`DeviceType`）——該模組雖然不再被 `ClickInstrumentation` 使用，但仍是套件對外提供的獨立工具，宿主專案可自行選用（例如用來決定要寫入哪個 `data-*` attribute 值），本次變更範圍僅限 `click` 事件 payload 的組成方式，不涉及移除既有公開 API。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:34:**現狀**：`toPayloadKey()` 已實際存在於目前分支並已 commit（見 [src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts) 當前內容，commit `5a2d321`，來自合併 `dev` 分支），實際轉換規則為：
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:7:- **BREAKING**：`ClickInstrumentation` 送出的 `click` 事件 payload 不再自動包含 `link_name`、`device_type`、`max_touch_points` 三個內建欄位；移除對應的直接文字節點擷取、`data-link-name` 覆寫查找、裝置類型計算等邏輯。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:9:- **沿用套件已實作且已 commit 進本分支的** payload key 轉換規則（rewrite）：`toPayloadKey()` 已透過合併 `dev` 分支帶入本分支並 commit（見 [src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）——找到的 attribute 值不以「原始 attribute 名稱」為 key，改用轉換後的 key：去除 `data-` 前綴，其餘連字號 `-` 一律改為底線 `_`（例如 `data-panel-topic` 與 `data-panel_topic` 轉換後皮為 `panel_topic`）。本次變更不需對 `toPayloadKey()` 本身作任何修改。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:13:- `initFaro()` 的 `InitFaroConfig.trackAttributes` 欄位與其透傳給 `ClickInstrumentation` 的行為維持不變，僅更新 doc comment 反映上述驗證規則與 key 轉換規則的變化。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:28:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（移除 `link_name`/`device_type`/`max_touch_points` 計算邏輯與 `data-link-name`/直接文字節點擷取相關函式，改用「payload 是否為空」作為送出防呆條件；`toPayloadKey()` 已存在且已 commit，不需修改）、[src/initFaro.ts](../../../src/initFaro.ts)（`validateTrackAttributes()` 移除內建欄位撞名檢查，修正清單內部撞名檢查的錯誤訊息文字 bug，更新 doc comment；轉換後 key 撞名的 `Set` 檢查邏輯已存在且已 commit，不需修改）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:29:- **Affected tests**：`clickInstrumentation.test.ts`（移除 `link_name`/`device_type`/`max_touch_points` 相關測試案例，新增 payload 為空不送出測試、trackAttributes 命中即送出測試；payload key 轉換相關測試已存在，不需新增）、`initFaro.test.ts`（移除撞內建欄位 key 的驗證測試；「轉換後 key 撞名」拋錯測試已存在，僅需視修正後的錯誤訊息文字調整比對內容）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:1:## 1. `clickInstrumentation.ts` 移除內建欄位
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:21:> 下列測試已存在且已通過（`5a2d321`），不需重複新增：`clickInstrumentation.test.ts` 的「單一 trackAttributes 項目查找成功，欄位以轉換後的名稱併入 payload」「trackAttributes 名稱含連字號時轉換」「多個 trackAttributes 項目...」「trackAttributes 項目查找不到時該欄位不出現」；`initFaro.test.ts` 的「trackAttributes 轉換後與內建欄位 key 撞名時拋出錯誤」「多個 trackAttributes 轉換後名稱重複時拋出錯誤」「trackAttributes 皆合法時正常初始化」「trackAttributes 含未以 data- 開頭的名稱時拋出錯誤」。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:23:- [x] 3.1 `clickInstrumentation.test.ts`：移除所有 `link_name`/`device_type`/`max_touch_points` 相關測試案例與 `setMaxTouchPoints`/`loadClickInstrumentation` 輔助函式
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:22:Package SHALL 支援 `ClickInstrumentationOptions.trackAttributes?: string[]` 設定：宿主專案宣告要追蹤的 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `.closest()` 往上查找最近一個帶有該 attribute 的元素，找到則將其值以「轉換後的 key」（見「payload key 轉換規則」需求）併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，不視為錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:61:Package SHALL 提供一個 `ClickInstrumentation`，於 `document` 層級監聽所有點擊事件，不依賴任何特定元素類型（例如不限定 `<a>` 或 `<button>`）。是否送出事件、送出什麼內容，完全由「payload 為空時不送出事件」與 `trackAttributes` 查找結果決定，套件 SHALL NOT 要求宿主專案於 HTML 上標記特定名稱的 attribute 才能被監聽到點擊本身。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:65:- **THEN** `ClickInstrumentation` 的點擊處理邏輯被觸發（含 `trackAttributes` 查找與空 payload 判斷），不因元素類型而略過
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:104:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與 `trackAttributes` 命中的欄位混雜。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）自建立以來一路都是 opt-out 模式：預設追蹤所有元素（未標記 `data-link-name` 時 fallback 讀取自身直接文字節點），只有標記 `data-link-name=""` 才能排除單一元素（見 [link-name-data-attribute/design.md](../archive/2026-08-06-link-name-data-attribute/design.md) 決策 4）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:15:- 不做「逐元素設定要用 opt-in 或 opt-out」的混合模式；模式是整個 `ClickInstrumentation` 實例層級（等同整個 `initFaro()` 呼叫）的全域設定，符合使用端「全域決定要不要監聽全域點擊」的需求描述。混合模式會讓「這個元素現在到底套用哪個模式」的心智負擔提高，目前無明確需求支撐這種複雜度。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:21:### 1. 新增 `ClickInstrumentation` 建構參數 `{ mode?: 'all' | 'markedOnly' }`，而非另建一個 class
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:23:**選擇**：`ClickInstrumentation` 建構子接受一個選用的 options 物件，內含 `mode` 欄位，預設值 `'all'`（即現況行為）；`'markedOnly'` 為新增的 opt-in 模式。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:31:- 另外寫一個 `MarkedOnlyClickInstrumentation` class——放棄，會複製一份節流/事件格式邏輯，違反「同一份行為只維護一處」的原則，且 `initFaro()` 要多一套邏輯判斷該 new 哪個 class。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:33:### 2. `initFaro()` 新增 `linkTracking?: { mode?: 'all' | 'markedOnly' }` 設定，透傳給 `ClickInstrumentation`
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:35:**選擇**：`InitFaroConfig` 新增選用欄位 `linkTracking`，內含 `mode`；`initFaro()` 內部 `new ClickInstrumentation({ mode: config.linkTracking?.mode })`。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:38:- 與現有 `getUser`／`backendUrls`／`webInstrumentationsOptions` 等既有選用欄位的設計風格一致：`initFaro()` 是唯一公開進入點，所有可調整行為都透過它的設定物件表達，呼叫端不需要直接碰 `ClickInstrumentation`。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:3:目前 `ClickInstrumentation` 採「預設全部追蹤、需標記 `data-link-name=""` 才能排除單一元素」的 opt-out 模式。隨著宿主專案（Foreman-Assistant）陸續發現「不想被記錄」的元素（例如純本地端表單操作按鈕，其顯示文字剛好構成有效 `link_name`），若持續用 opt-out 模式，每多一個不想追蹤的元素就要多改一次宿主程式碼並加上 `data-link-name=""`，長期下來排除清單會越來越長、越來越分散在各元件裡，難以維護，也不是宿主專案期望的使用方式。宿主專案期望的模型是反過來的：**只有明確標記 `data-link-name` 的元素才會被記錄**，其餘元素完全不追蹤；同時希望能全域決定要不要啟用這種「全域被動監聽」行為，因為並非每個專案都需要監聽全域點擊。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:7:- `initFaro()` 新增選用設定，讓宿主專案可將 `ClickInstrumentation` 由目前的「opt-out（預設全部追蹤，標記空字串才排除）」模式，切換為「opt-in（只追蹤有標記 `data-link-name` 且非空字串的元素，其餘一律不送出事件）」模式。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:24:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（新增建構參數控制模式）、[src/initFaro.ts](../../../src/initFaro.ts)（`InitFaroConfig` 新增選用欄位並透傳給 `ClickInstrumentation`）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:25:- **Affected tests**：[src/click/clickInstrumentation.test.ts](../../../src/click/clickInstrumentation.test.ts) 新增 opt-in 模式相關案例。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:1:## 1. `clickInstrumentation.ts` 新增 opt-in 模式支援
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:3:- [x] 1.1 新增型別 `export type ClickTrackingMode = 'all' | 'markedOnly';` 與建構參數型別（例如 `interface ClickInstrumentationOptions { mode?: ClickTrackingMode }`）
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:4:- [x] 1.2 `ClickInstrumentation` 建構子接受選用 `options: ClickInstrumentationOptions = {}`，並存成 instance 欄位（例如 `private readonly mode: ClickTrackingMode`），未提供時預設 `'all'`
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/tasks.md:11:- [x] 2.2 `initFaro()` 內 `new ClickInstrumentation({ mode: config.linkTracking?.mode })`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:3:`ClickInstrumentation` 目前用 `mode`（`'all'` / `'markedOnly'`）決定找不到 `data-link-name` 時要不要 fallback 抓文字節點；`trackAttributes` 則是另一份「額外附加到 payload」的 attribute 清單，兩者查找邏輯（`closest()` + 取值）已由共用的 `getTrackedAttributeValue()` 實作，`getOverrideLinkName()` 只是對它的一層 trim 包裝。使用者確認：「客製化 attribute」就是指既有的 `trackAttributes`，不新增獨立選項；文字節點 fallback 是否完全移除留待後續 issue 討論，本次先不動。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:11:- 移除 `mode` / `ClickTrackingMode`，不再有全域監聽模式切換（`ClickInstrumentation` 本來就一律 `document` 層級監聽，`mode` 只影響「查無標記時的 fallback 行為」，並非監聽範圍）。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:32:`constructor` 不再讀取 `options.mode`；`ClickInstrumentationOptions` 移除 `mode` 欄位；`ClickTrackingMode` 型別、`this.mode` 欄位一併移除。文字節點 fallback（`getDirectTextContent`）維持不變、不受此決策影響，現在是 `link_name` 的唯一來源。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:3:`getOverrideLinkName()` 只是 `getTrackedAttributeValue(element, LINK_NAME_ATTRIBUTE)?.trim()` 的單純包裝，沒有獨立邏輯，徒增一層間接呼叫。另外 `ClickInstrumentation` 目前的 `mode`（`'all'` / `'markedOnly'`）與「文字節點 fallback」機制增加了設定複雜度與行為分歧。進一步檢視後發現，套件內建的 `data-link-name` attribute 與宿主專案自訂的 `trackAttributes` 清單本質上做同一件事（`closest()` 查找＋取值），差別只在於 `data-link-name` 免去了「先在 `trackAttributes` 註冊一次」這個步驟；但目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個「免設定」的價值低於多維護一條路徑、多兩個規格需求的成本，因此決定連同 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:10:- **BREAKING**: 移除 `ClickInstrumentationOptions.mode` 與 `ClickTrackingMode` 型別，`ClickInstrumentation` 不再支援 `'all'` / `'markedOnly'` 模式切換。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:21:- 受影響檔案：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)、[src/click/clickInstrumentation.test.ts](../../../src/click/clickInstrumentation.test.ts)、可能涉及 `initFaro.ts`／`index.ts` 中對 `ClickTrackingMode`／`mode` 選項的匯出或使用。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:1:## 1. clickInstrumentation.ts 重構
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:4:- [x] 1.2 移除 `ClickTrackingMode` 型別與 `ClickInstrumentationOptions.mode` 欄位；`constructor` 不再讀取 `options.mode`，移除 `this.mode` 欄位
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:10:- [x] 2.1 移除 `clickInstrumentation.test.ts` 中針對 `mode: 'markedOnly'` 與 `data-link-name` 覆寫的 describe/測試案例
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:28:- [x] 5.2 更新 `ClickInstrumentationOptions.trackAttributes` 的註解，移除「同時也是決定 link_name 的來源」的描述，恢復為單純的附加欄位說明
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:29:- [x] 5.3 更新 `clickInstrumentation.test.ts`：還原/移除先前新增的「trackAttributes 命中決定 link_name」相關測試斷言，改為驗證 `trackAttributes` 命中不影響 `link_name`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:37:- [x] 6.3 `new ClickInstrumentation({ trackAttributes: config.linkTracking?.trackAttributes })` 改為 `new ClickInstrumentation({ trackAttributes: config.trackAttributes })`
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:24:Package SHALL 提供一個 `ClickInstrumentation`，於 `document` 層級監聽所有點擊事件，不依賴任何特定元素類型（例如不限定 `<a>` 或 `<button>`），也 SHALL NOT 要求宿主專案於 HTML 上標記任何 data attribute。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:28:- **THEN** `ClickInstrumentation` 的點擊處理邏輯被觸發，不因元素類型而略過
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:135:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與既有 `link_name`／`device_type`／`max_touch_points` 欄位混雜。
src/faro-click-tracking/src/index.ts:4:export { ClickInstrumentation } from './features/click/clickInstrumentation';
src/faro-click-tracking/src/index.ts:5:export type { ClickInstrumentationOptions } from './features/click/clickInstrumentation';
src/faro-click-tracking/src/core/faroInstance/faroInstance.ts:4:// 供套件內任何非 instrumentation 的對外 API（不像 ClickInstrumentation 能由 Faro SDK
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:2:import { ClickInstrumentation } from './clickInstrumentation';
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:6:  const instrumentation = new ClickInstrumentation({ trackAttributes });
src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:17:describe('ClickInstrumentation', () => {
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:6:export interface ClickInstrumentationOptions {
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:44:export class ClickInstrumentation extends BaseInstrumentation {
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:53:  constructor(options: ClickInstrumentationOptions = {}) {
src/faro-click-tracking/src/features/user/userSync.ts:14: * 與 `ClickInstrumentation` 職責分離：本身不做任何點擊事件追蹤，只負責身分同步，
src/faro-click-tracking/src/initFaro/initFaro.ts:7:import { ClickInstrumentation, toPayloadKey } from '../features/click/clickInstrumentation';
src/faro-click-tracking/src/initFaro/initFaro.ts:69:   *    無法、也不應該透過 `trackAttributes`／`ClickInstrumentation` 取得，改用 Faro
src/faro-click-tracking/src/initFaro/initFaro.ts:106: * 呼叫一次即可取得全域點擊追蹤（ClickInstrumentation）的能力；`click` 事件 payload 完全、
src/faro-click-tracking/src/initFaro/initFaro.ts:127:      new ClickInstrumentation({
src/faro-click-tracking/src/initFaro/initFaro.ts:140:    // 宿主頁面 DOM 上的 attribute，無法透過 ClickInstrumentation 的 closest() 查找取得，
## closest( (41 matching lines)
README.md:146:- For each name in `trackAttributes`, the package independently searches upward from the clicked element (`event.target`) using `closest()` to find the nearest element (including itself) that carries that attribute.
README.md:150:**Note**: Marked attributes should be placed on the element that semantically corresponds to their actual scope, avoiding placement on outer containers that wrap unrelated content (e.g. the root node wrapping the entire app) — otherwise, since `.closest()` will keep matching upward, that field could unexpectedly appear on all click events.
README.md:233:- **`trackAttributes` matching relies entirely on DOM structure**: `.closest()` only searches upward through ancestors, and does not check whether the attribute semantically "actually" corresponds to this particular click; if a marker is placed carelessly and wraps unrelated content, fields may end up on click events where they don't belong. The package cannot validate this at runtime, so host projects need to be careful about marker placement.
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前只支援單一標記 attribute `data-link-name`（或自訂 `attributeName`），透過 `element.closest()` 往上查找，決定 `link_name` 欄位。討論過程中曾評估函式型 `getExtraFields(target) => Record<string,string>` 方案，但因 typo 風險、例外處理複雜度、side effect 疑慮，最終定案採用最小化的宣告式方案：宿主專案只給「要追蹤哪些 attribute 名稱」，查找/合併邏輯完全由套件比照既有 `data-link-name` 機制實作，不引入任何 host 自訂函式。詳見 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md)。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:9:- 每個 attribute 各自獨立以 `.closest()` 查找（與 `data-link-name` 相同邏輯），找到的值以「原始 attribute 名稱」為 key 併入同一筆 `click` event payload。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:30:**理由**：討論過程比較過函式型 `getExtraFields`（彈性大，但 host 自寫查找邏輯、需處理例外/side effect）與宣告式清單（套件內部統一用 `.closest()` 查找，無 host 程式碼可能拋錯）。後者複雜度大幅低於前者，且與現有 `data-link-name` 心智模型一致："宣告 attribute 名稱，套件自動往上找"。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:42:### 3. 每個 attribute 各自獨立 `.closest()` 查找，起點皆為 `event.target`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:44:**選擇**：`trackAttributes` 中每個名稱各自執行一次 `event.target.closest('[該名稱]')`，彼此互不影響、互不依賴查找順序或層級關係。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:64:- **[Risk] `.closest()` 依 host DOM 結構決定命中範圍，標記位置錯誤會導致意外撈取** → 若 host 將 `trackAttributes` 標記的 attribute 放在會包住不相關內容的外層容器（例如包住整個 app 的根節點，而非僅包住實際對應的區塊，如 Navbar 元件本身），會導致該欄位出現在所有點擊事件中，即使語意上不相關；套件無法在執行期驗證「標記位置是否符合語意」，此為純宣告式設計的必然責任轉移。緩解方式：文件明確提醒 host 只在真正對應的範圍元素上標記，不要標記在跨頁面共用的外層容器上。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:3:目前 `click` 事件只送出固定 schema（`link_name`/`device_type`/`max_touch_points`），宿主專案若想在同一次點擊事件中額外記錄「這個點擊發生在哪個頁面/區塊」等資訊，沒有任何擴充管道。經過 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md) 的討論，決定採用「宣告式 attribute 名稱清單」的最小化方案：宿主專案只需在 `initFaro()` 宣告要追蹤哪些 `data-*` attribute，套件比照既有 `data-link-name` 的 `.closest()` 查找機制，自動將這些 attribute 的值併入同一筆 `click` event payload，不引入函式型 hook、不新增例外處理與非同步顧慮。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:8:- 每次點擊時，套件對 `trackAttributes` 中每一個 attribute 名稱，各自從 `event.target` 開始往上 `.closest()` 查找最近一個帶有該 attribute 的元素，找到則將其值併入該次 `click` event payload；找不到則該欄位不出現在 payload 中（非錯誤）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:4:- [x] 1.2 新增內部函式：對單一 attribute 名稱，從 `event.target` 執行 `closest('[名稱]')`，回傳找到的值（trim 前原始字串）或 `undefined`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:11:對 `trackAttributes` 中每一個 attribute 名稱，Package SHALL 於每次點擊時各自獨立從 `event.target` 開始，以 `closest('[該名稱]')` 查找最近一個帶有該 attribute 的元素（含 `event.target` 自身）；查找方式與既有 `data-link-name` 查找機制一致。找到則將該 attribute 的值（trim 前原始字串）以「原始 attribute 名稱」為 key，併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，SHALL NOT 視為錯誤、SHALL NOT 阻止該次 `click` event 送出。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:42:### 3. 用 `element.closest('[data-link-name]')` 往上找最近的標記祖先，而非只看 `event.target` 自身
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:44:**選擇**：查找時從 `event.target` 開始，用 `closest()` 往上找最近一個帶有 `data-link-name` 的元素（含自身）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:48:- `closest()` 是標準 DOM API，行為與 HTML 標籤結構、前端框架完全無關，符合「機制需與具體標籤/框架無關」的目標。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:49:- 不影響既有「未標記時只看 `event.target` 自身直接文字節點」的規則——`closest()` 找不到任何帶 attribute 的祖先時，直接 fallback 現有邏輯，行為不變。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:4:- [x] 1.2 新增內部函式 `getOverrideLinkName(target: Element): string | undefined`：用 `target.closest(\`[${LINK_NAME_ATTRIBUTE}]\`)` 找最近帶有該 attribute 的元素（含自身），找不到回傳 `undefined`；找到則回傳其屬性值 `.trim()` 後的結果（可能為空字串）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:6:1. 若 `event.target` 自身或其祖先（透過 `closest('[data-link-name]')` 查找）帶有 `data-link-name` attribute，採用最近一個該元素的屬性值（trim 後）。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:8:另一個曾評估過的風險——`ClickInstrumentation.getTrackedAttributeValue()`（[clickInstrumentation.ts](../../../src/features/click/clickInstrumentation.ts)）把 `trackAttributes` 名稱直接拼進 `closest('[name]')` 選擇器字串，若名稱含非法 CSS selector 字元會讓 `closest()` 拋出 `DOMException`——經評估後決定**不**在套件內加上執行期防禦，理由見下方「決策」第 2 點。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:18:- 不為 `trackAttributes` 名稱新增任何執行期或輸入驗證層級的「非法 selector 字元」防禦；`closest()` 因非法字元拋出的例外維持現況（不捕捉），理由見下方「決策」第 2 點。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:27:### 2. `closest()` 例外防護：評估後決定不處理
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:28:曾評估在 `getTrackedAttributeValue()` 內包 try/catch，把「非法 selector 導致 `closest()` 拋例外」視為與「找不到」同一類結果。但衡量後認為：`trackAttributes` 是宿主開發者在 `initFaro()` 呼叫當下提供的組態，不是執行期才決定的動態輸入；會觸發非法 selector 的字元（例如空白、逗號、冒號等）多半是明顯的設定錯誤或複製貼上失誤，理論上應在開發/測試階段就會被發現並修正，且錯誤本身（`DOMException`）訊息已足夠明確，能直接指出問題所在的 selector 字串，不需要套件額外包裝。維持現況（不捕捉、直接拋出）讓問題在最早的時機就曝露、修正，而非被靜默吞掉導致設定錯誤長期不被注意。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/design.md:39:- [風險] 不處理 `closest()` 非法 selector 例外：若 `trackAttributes` 中某個名稱含非法字元，該次點擊處理會拋出未捕捉例外，且因 `ClickInstrumentation` 監聽整個 `document` 的 `click`，理論上會在**每一次點擊**時重現，影響範圍是全站點擊追蹤（甚至可能中斷宿主以程式化方式 `dispatchEvent()`/`.click()` 觸發的同步呼叫鏈）。→ 緩解：這屬於組態錯誤而非執行期不可預期的輸入，應能在開發/QA 階段的基本手動測試中被發現；`DOMException` 訊息會明確指出是哪個 selector 字串出錯，方便快速定位修正。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:5:另外一個曾強化的項目——`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS attribute selector 字元的防禦——經評估後決定**不納入本次變更範圍**：`trackAttributes` 是宿主開發者在呼叫 `initFaro()` 時提供的組態，不是執行期才決定的動態輸入，若名稱含有非法字元會在開發/測試階段就被發現，且現有的 `closest()` 拋出的 `DOMException` 訊息已足夠明確。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/proposal.md:12:不納入本次變更：`ClickInstrumentation` 對 `trackAttributes` 名稱含非法 CSS selector 字元的執行期防禦（例如包裝 `closest()` 的 try/catch）——評估後認為這屬於開發者設定錯誤，應在開發/測試階段直接暴露與修正，不需要套件防禦。
src/faro-click-tracking/openspec/changes/enhance-exception-and-error-handling/tasks.md:10:- [x] 2.1（已移除）評估後決定：`trackAttributes` 是宿主開發者於 `initFaro()` 呼叫當下提供的組態，非執行期才決定的動態輸入；名稱含非法 selector 字元屬於明顯的設定錯誤，應在開發/測試階段被發現並修正，`closest()` 拋出的 `DOMException` 訊息已足夠明確指出問題字串。維持現況（不捕捉例外），已移除對應的 try/catch 實作與測試案例。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:11:- `trackAttributes` 機制（宣告 `data-*` attribute 名稱清單、`.closest()` 查找、找不到則省略欄位）維持不變，作為宿主專案取得 payload 欄位的唯一管道。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:8:- `trackAttributes` 機制維持不變：宿主專案宣告要追蹤的 `data-*` attribute 名稱清單，每次點擊時套件對每個名稱各自從 `event.target` 開始以 `.closest()` 往上查找，找到則將其值併入該次 `click` event payload；找不到則該欄位不出現，不視為錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:22:Package SHALL 支援 `ClickInstrumentationOptions.trackAttributes?: string[]` 設定：宿主專案宣告要追蹤的 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `.closest()` 往上查找最近一個帶有該 attribute 的元素，找到則將其值以「轉換後的 key」（見「payload key 轉換規則」需求）併入該次 `click` event payload；找不到則該欄位不出現在 payload 中，不視為錯誤。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:114:**Migration**：宿主專案若需維持原「點擊名稱」欄位，SHALL 於 `trackAttributes` 中加入 `data-link-name`，並於 HTML 上以 `data-link-name` attribute 標記需要穩定名稱的元素；套件會依既有 `trackAttributes` 查找機制（`.closest()`）取得該值，並以轉換後的 key `link_name` 併入 payload。若需要「找不到 `data-link-name` 時 fallback 讀取元素自身直接文字節點」的行為，套件不再提供，SHALL 由宿主專案自行於需要的元素上皆標記 `data-link-name`。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/design.md:17:- 不變更 `data-link-name` 屬性名稱、`closest()` 往上查找祖先的既有查找邏輯。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:3:`ClickInstrumentation` 目前用 `mode`（`'all'` / `'markedOnly'`）決定找不到 `data-link-name` 時要不要 fallback 抓文字節點；`trackAttributes` 則是另一份「額外附加到 payload」的 attribute 清單，兩者查找邏輯（`closest()` + 取值）已由共用的 `getTrackedAttributeValue()` 實作，`getOverrideLinkName()` 只是對它的一層 trim 包裝。使用者確認：「客製化 attribute」就是指既有的 `trackAttributes`，不新增獨立選項；文字節點 fallback 是否完全移除留待後續 issue 討論，本次先不動。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:3:`getOverrideLinkName()` 只是 `getTrackedAttributeValue(element, LINK_NAME_ATTRIBUTE)?.trim()` 的單純包裝，沒有獨立邏輯，徒增一層間接呼叫。另外 `ClickInstrumentation` 目前的 `mode`（`'all'` / `'markedOnly'`）與「文字節點 fallback」機制增加了設定複雜度與行為分歧。進一步檢視後發現，套件內建的 `data-link-name` attribute 與宿主專案自訂的 `trackAttributes` 清單本質上做同一件事（`closest()` 查找＋取值），差別只在於 `data-link-name` 免去了「先在 `trackAttributes` 註冊一次」這個步驟；但目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個「免設定」的價值低於多維護一條路徑、多兩個規格需求的成本，因此決定連同 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:21:Package SHALL 支援宿主專案於 `initFaro({ trackAttributes })` 宣告一份 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `closest()` 往上查找最近一個帶有該 attribute 的元素（含自身），找到則將其值以「原始 attribute 名稱」為 key 併入同一筆 `click` event payload（Object 形式）；找不到則該欄位不出現在 payload 中，不視為錯誤。此機制與「點擊名稱擷取規則」完全無關，SHALL NOT 影響 `link_name` 的決定。此設定 SHALL 為 `InitFaroConfig` 的頂層欄位，SHALL NOT 巢狀於任何以「link」命名的物件之下——套件可追蹤任意 attribute，並非只限定於 link 相關用途。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:38:**Reason**: `data-link-name` 與 `trackAttributes` 的查找邏輯（`closest()` 查找＋取值）完全相同，唯一差異是「免 JS 設定即可生效」；但套件目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個免設定的預設值價值有限，維護兩條路徑、兩份規格需求的成本高於效益。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:37:1. 若 `event.target` 自身或其祖先（透過 `closest('[data-link-name]')` 查找）帶有 `data-link-name` attribute，採用最近一個該元素的屬性值（trim 後）。
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:9:   * 開始以 closest() 往上查找最近一個帶有該 attribute 的元素（含自身），找到則將其值
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:37:  const marked = element.closest(`[${attributeName}]`);
src/faro-click-tracking/src/initFaro/initFaro.ts:51:   * 每次點擊時，套件對清單中每一個名稱各自從 event.target 開始以 closest() 往上查找，
src/faro-click-tracking/src/initFaro/initFaro.ts:140:    // 宿主頁面 DOM 上的 attribute，無法透過 ClickInstrumentation 的 closest() 查找取得，
## getAttribute( (1 matching lines)
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:41:  return marked.getAttribute(attributeName) ?? undefined;
## link_name (127 matching lines)
README.md:141:     { link_name: 'Submit', page: 'checkout', section: 'payment-form' } -->
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前只支援單一標記 attribute `data-link-name`（或自訂 `attributeName`），透過 `element.closest()` 往上查找，決定 `link_name` 欄位。討論過程中曾評估函式型 `getExtraFields(target) => Record<string,string>` 方案，但因 typo 風險、例外處理複雜度、side effect 疑慮，最終定案採用最小化的宣告式方案：宿主專案只給「要追蹤哪些 attribute 名稱」，查找/合併邏輯完全由套件比照既有 `data-link-name` 機制實作，不引入任何 host 自訂函式。詳見 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md)。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/design.md:50:**選擇**：`trackAttributes` 陣列中任一名稱不符合 `data-` 前綴規則、或與現有固定欄位 key（`link_name`/`device_type`/`max_touch_points`）撞名，SHALL 在 `initFaro()` 執行當下立即拋出 `Error`，訊息包含觸發驗證失敗的具體名稱。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:3:目前 `click` 事件只送出固定 schema（`link_name`/`device_type`/`max_touch_points`），宿主專案若想在同一次點擊事件中額外記錄「這個點擊發生在哪個頁面/區塊」等資訊，沒有任何擴充管道。經過 [docs/discussions/configurable-click-event-schema.md](../../../../../docs/discussions/configurable-click-event-schema.md) 的討論，決定採用「宣告式 attribute 名稱清單」的最小化方案：宿主專案只需在 `initFaro()` 宣告要追蹤哪些 `data-*` attribute，套件比照既有 `data-link-name` 的 `.closest()` 查找機制，自動將這些 attribute 的值併入同一筆 `click` event payload，不引入函式型 hook、不新增例外處理與非同步顧慮。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/proposal.md:11:- 若 `trackAttributes` 中的名稱與現有固定欄位 key（`link_name`、`device_type`、`max_touch_points`）撞名，`initFaro()` 呼叫當下立即拋出明確錯誤（靜態可判斷，不需等到點擊當下才發現）。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:5:- [x] 1.3 `handleClick` 內：在既有 `link_name`/`device_type`/`max_touch_points` 之外，對 `trackAttributes` 中每個名稱各自查找，找到的併入同一次 `pushEvent()` payload，key 為原始 attribute 名稱字串；找不到則該欄位不出現在 payload
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:11:- [x] 2.3 新增驗證：`trackAttributes` 中任一名稱與內建欄位 key（`link_name`/`device_type`/`max_touch_points`）相同時，`initFaro()` 呼叫當下拋出 `Error`，訊息包含該名稱
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/tasks.md:18:- [x] 3.3 新增測試：`trackAttributes` 項目查找不到時，該欄位不出現在 payload，且該次點擊事件仍正常送出（`link_name` 有效時）
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:8:- **THEN** `click` event payload 僅包含既有欄位（`link_name`/`device_type`/`max_touch_points`），行為與新增本功能前完全一致
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:23:- **THEN** 該次 `click` event payload 不包含 `data-page` 欄位，且該次點擊事件（若 `link_name` 有效）仍正常送出
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:33:`trackAttributes` 陣列中任一名稱 SHALL NOT 與內建欄位 key（`link_name`、`device_type`、`max_touch_points`）相同。若有撞名，Package SHALL 於 `initFaro()` 呼叫當下立即拋出明確錯誤，錯誤訊息 SHALL 包含撞名的名稱。
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:36:- **WHEN** 宿主專案呼叫 `initFaro({ linkTracking: { trackAttributes: ['link_name'] } })`
src/faro-click-tracking/openspec/changes/add-custom-track-attributes/specs/click-tracking-package/spec.md:37:- **THEN** `initFaro()` 立即拋出錯誤，錯誤訊息包含 `'link_name'`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:3:`ClickInstrumentation`（[clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）目前只送出 `link_name` 一個欄位；裝置資訊（`device_type`/`max_touch_points`）由 `initFaro()`（[initFaro.ts](../../../src/initFaro.ts)）透過 Faro `metas` 機制計算一次並附加到「該次初始化後送出的所有 Faro signal」。宿主專案回報：既有 Loki pipeline 只解析 `pushEvent()` 的 event payload，不會讀取 `metas`，因此裝置資訊實際上進不了 Loki。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/design.md:12:- 維持既有 `link_name` 擷取規則、空名稱防呆、300ms 節流去重行為不變。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/proposal.md:7:- `ClickInstrumentation` 送出的 `click` 事件 payload 新增 `device_type`、`max_touch_points` 欄位，與既有 `link_name` 一起透過 `pushEvent()` 送出。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/tasks.md:4:- [x] 1.2 `handleClick` 組 payload 時新增 `device_type: getDeviceType()`、`max_touch_points: String(navigator.maxTouchPoints)`，與 `link_name` 一併傳入 `this.api.pushEvent('click', { link_name, device_type, max_touch_points })`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/specs/click-tracking-package/spec.md:4:點擊事件 SHALL 以事件名稱 `click` 透過 Faro `pushEvent` 送出，事件內容 SHALL 包含 `link_name`（依擷取規則得出的點擊名稱）、`device_type`（依 `navigator.maxTouchPoints > 0` 判斷為 `tablet`，否則為 `desktop`）、`max_touch_points`（`navigator.maxTouchPoints` 原始數值字串）三個欄位。`device_type`／`max_touch_points` SHALL 於該次點擊事件觸發當下即時計算，反映觸發當下的裝置狀態。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-click-event-device-info/specs/click-tracking-package/spec.md:8:- **THEN** 系統以事件名稱 `click` 呼叫 `pushEvent`，事件內容包含 `link_name`、`device_type`、`max_touch_points` 三個欄位
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:3:本 repo（`frontend/src/faro.ts`、`frontend/src/App.tsx`、`frontend/src/deviceType.ts`）目前用手動方式做裝置點擊追蹤：每個要追蹤的 `<a onClick>` 呼叫 `handleLinkClick`，手動組 `device_type`/`max_touch_points`/`session_id`/`link_name` 後呼叫 `faro.api.pushEvent('link_click', {...})`。這個模式對「既有專案想加裝置追蹤」而言改動成本過高——要嘛每個連結都改一次程式碼，要嘛放棄追蹤。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/design.md:60:本 repo 現有手動機制用的事件名稱是 `link_click`，語意上僅限「連結」。這次套件的追蹤範圍擴大到「所有點擊」，沿用 `link_click` 會誤導語意，因此改用更中性的 `click`。事件欄位維持 `link_name`（點擊到的文字名稱）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/proposal.md:12:- 自訂事件名稱為通用的 `click`（不沿用專案現有的 `link_click`），事件內容含 `link_name` 欄位。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/tasks.md:18:- [x] 3.5 以事件名稱 `click`、欄位 `link_name` 呼叫 `this.api.pushEvent()`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:37:- **THEN** 該次點擊事件的 `link_name` 為 `"首頁"`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:41:- **THEN** 該次點擊事件的 `link_name` 不包含任何子孫元素的文字內容（即擷取結果為空字串）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:62:點擊事件 SHALL 以事件名稱 `click` 透過 Faro `pushEvent` 送出，事件內容 SHALL 包含 `link_name` 欄位（依擷取規則得出的點擊名稱）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-faro-click-tracking-package/specs/click-tracking-package/spec.md:66:- **THEN** 系統以事件名稱 `click` 呼叫 `pushEvent`，事件內容包含 `link_name` 欄位
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:3:`ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）自 [faro-click-tracking-package](../faro-click-tracking-package/design.md) change 建立以來，`link_name` 一律取自 `event.target` 自身的直接文字節點，且該 change 的 design 明確記錄了一個決策：**點擊追蹤不要求宿主專案標記任何 HTML attribute**（不沿用 Faro 內建 `UserActionInstrumentation` 的 `data-faro-user-action-name` 慣例），理由是「使用端明確表示不想在既有 HTML 上加任何標記」。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:5:隨著套件被更多元的宿主專案（目前為 Foreman-Assistant）採用，出現了當初設計未涵蓋的情境：元素顯示文字經過 i18n 翻譯，本身就不是穩定值——同一個邏輯連結在不同語系下文字不同，且觀察到部分翻譯字串前後帶有斜線等符號，導致 Loki／dashboard 端無法用 `link_name` 做穩定比對，還需額外做語系間的文字 mapping。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:10:- 讓宿主專案「可以選擇性」提供一個語系無關、穩定的 `link_name`，覆寫預設的文字節點擷取規則。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:24:**選擇**：`ClickInstrumentation` 新增規則——若 `event.target` 自身或其祖先帶有 `data-link-name` attribute，優先採用該屬性值作為 `link_name`；未標記時維持原本的直接文字節點擷取規則。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:28:- 語系/符號造成的 `link_name` 不穩定問題，本質上只能由「宿主專案自己提供一個穩定值」解決，沒有任何被動偵測機制能自動猜出「這段翻譯文字背後對應的穩定 id 是什麼」。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:33:- 套件內建 i18n 函式庫整合（例如自動讀取 `ngx-translate`／`i18next` 的翻譯 key 當 `link_name`）——放棄。套件目前刻意保持框架無關（純 `document.addEventListener`），綁定特定 i18n 函式庫會破壞這個特性，且無法涵蓋不使用該函式庫的宿主專案。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/design.md:40:**理由**：`data-faro-user-action-name` 綁定的是 `UserActionInstrumentation` 的「使用者行為（user action）」語意——監聽 `pointerdown`/`keydown`，會啟動一個關聯後續 100ms 內 HTTP/DOM 變化的 action 生命週期，跟本套件單純「一筆點擊事件」的語意不同（此差異已在 [faro-click-tracking-package/design.md](../faro-click-tracking-package/design.md) 決策 1 中記錄）。沿用同一個 attribute 名稱容易讓使用者誤以為兩者行為一致，故另外命名，語意更清楚地對應到「這次點擊要送出的 `link_name` 值」。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:3:`ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）目前的 `link_name` 一律擷取自被點擊元素自身的直接文字節點。宿主專案 Foreman-Assistant 回報：這個文字通常來自 i18n 翻譯後的顯示字串，會隨語系改變（中/英文字不同），且觀察到 Loki 端某些翻譯文字前後帶有斜線（例如 `event_data_link_name="/治具Check In/Out/"`），導致 dashboard 讀不到穩定、可比對的連結名稱，還得額外做「不同語系文字 → 同一個邏輯連結」的 mapping，增加維運成本。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/proposal.md:9:- `ClickInstrumentation` 新增「`data-link-name` attribute 覆寫」規則：若被點擊元素自身或其祖先帶有 `data-link-name` attribute，直接採用該屬性值（trim 後）作為 `link_name`，不再讀取文字節點；查找方式為由 `event.target` 往上找最近帶有該 attribute 的元素（含自身），不限定特定 HTML 標籤或框架，任何宿主專案皆可採用。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:3:- [x] 1.1 新增常數 `LINK_NAME_ATTRIBUTE = 'data-link-name'`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:4:- [x] 1.2 新增內部函式 `getOverrideLinkName(target: Element): string | undefined`：用 `target.closest(\`[${LINK_NAME_ATTRIBUTE}]\`)` 找最近帶有該 attribute 的元素（含自身），找不到回傳 `undefined`；找到則回傳其屬性值 `.trim()` 後的結果（可能為空字串）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:10:- [x] 2.1 新增測試：元素自身帶 `data-link-name="FifoToolkit"` 且文字節點為其他內容時，`pushEvent` 的 `link_name` 為 `"FifoToolkit"`，不採用文字內容
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:11:- [x] 2.2 新增測試：點擊的 `event.target` 自身未標記，但某個祖先帶有 `data-link-name`，`link_name` 仍為該祖先的屬性值
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/tasks.md:28:- [x] 5.1 於 Foreman-Assistant 標記 `data-link-name` 後點擊對應元素，於 Loki／dashboard 確認 `link_name` 為標記值，且切換語系後該值不變
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:11:- **THEN** 該次點擊事件的 `link_name` 為 `"首頁"`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:15:- **THEN** 該次點擊事件的 `link_name` 不包含任何子孫元素的文字內容（即擷取結果為空字串）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:26:- **THEN** 該次點擊事件的 `link_name` 為 `"FifoToolkit"`，不採用該元素的顯示文字
src/faro-click-tracking/openspec/changes/archive/2026-08-06-link-name-data-attribute/specs/click-tracking-package/spec.md:30:- **THEN** 該次點擊事件的 `link_name` 為 `"FifoToolkit"`
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/design.md:19:- 不修改 `ClickInstrumentation`（[src/clickInstrumentation.ts](../../../src/clickInstrumentation.ts)）既有的 `click` 事件欄位（`link_name`/`device_type`/`max_touch_points`）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/proposal.md:30:- 相依：不影響 `ClickInstrumentation`（`src/clickInstrumentation.ts`）既有行為與其 `click` 事件欄位（`link_name`/`device_type`/`max_touch_points`）。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/tasks.md:20:- [x] 3.5 確認 `src/clickInstrumentation.test.ts` 既有測試不受影響（`click` 事件 payload 仍只包含 `link_name`／`device_type`／`max_touch_points`，未混入使用者欄位）
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/specs/click-tracking-package/spec.md:29:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與既有 `link_name`／`device_type`／`max_touch_points` 欄位混雜。
src/faro-click-tracking/openspec/changes/archive/2026-08-06-user-info-collection/specs/click-tracking-package/spec.md:33:- **THEN** 該次 `pushEvent` 的 payload 欄位 SHALL 僅包含 `link_name`／`device_type`／`max_touch_points`，SHALL NOT 包含任何使用者相關欄位
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:3:`ClickInstrumentation`（[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)）目前疊加兩層欄位邏輯：套件內建固定欄位（`link_name`——`data-link-name` 查找 fallback 到直接文字節點、`device_type`/`max_touch_points`——依賴 `src/device/deviceTypeDetector.ts`），以及宿主專案透過 `trackAttributes` 宣告的自訂欄位（`add-custom-track-attributes` 變更引入）。兩層欄位並存導致「payload 保證會有哪些欄位」變得模糊：內建欄位無論宿主專案是否需要都會出現，而自訂欄位需另外宣告。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:10:- 移除 `link_name`/`device_type`/`max_touch_points` 三個套件內建欄位的計算邏輯，套件不再對 `click` 事件 payload 做任何預設欄位假設。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:14:- 送出防呆條件改為「payload 是否為空物件」，取代原本「link_name 是否為空字串」，讓防呆邏輯不再綁定任何特定欄位名稱。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:19:- 不提供任何內建的「常用欄位組合」快速設定（例如「一鍵啟用 link_name」的相容選項）——升級路徑一律是宿主專案自行以 `trackAttributes` 宣告等效的 `data-*` attribute。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:26:**選擇**：`handleClick` 不再計算 `link_name`/`device_type`/`max_touch_points`，payload 物件從空物件開始，僅由 `trackAttributes` 查找結果填入。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:56:**選擇**：沿用既有的 `Set`-based 撞名檢查邏輯本身；移除「轉換後 key 是否等於內建欄位 key（`link_name`/`device_type`/`max_touch_points`）」的檢查段落，因內建欄位已不存在，此檢查不再有意義；同時修正清單內部撞名分支的錯誤訊息文字，改為正確描述「與清單內其他項目轉換後重複」（例如：`[faro-click-tracking] trackAttributes 中的 "${name}" 轉換後的欄位名稱 "${payloadKey}" 與清單內其他項目重複，請改用其他名稱。`）。「名稱需以 `data-` 開頭」的既有檢查維持不變。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:66:**理由**：原本「link_name trim 後為空字串則不送出」的防呆邏輯，本質是「這次點擊沒有任何有意義的資訊可送」；`link_name` 移除後，這個判斷標準改用「trackAttributes 是否有任何命中」延續同樣的精神，避免每次點擊都送出完全空白、無查詢價值的事件到 Loki，造成不必要的雜訊與儲存成本。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:72:**選擇**：既有以 `WeakMap<EventTarget, number>` 記錄 `event.target` 最後送出時間、300ms 內重複點擊略過的機制完全保留；判定順序為先計算 payload（`trackAttributes` 查找），若為空則直接 return，非空才進行節流檢查與 `pushEvent`（與原本「先算 link_name、為空則 return、非空才節流」的順序一致，僅把判斷依據從 `link_name` 換成「payload 是否為空」）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:78:- **[Risk][BREAKING] 所有現有整合套件的宿主專案，升級後 `click` 事件會完全停止送出 `link_name`/`device_type`/`max_touch_points`，直到改為以 `trackAttributes` 宣告等效欄位** → 屬預期的破壞性變更，需在 CHANGELOG / README 明確標示為 major version bump，並提供遷移範例（例如以 `data-link-name` 取代原生 `link_name` fallback 邏輯）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/design.md:80:- **[Risk] 「payload 為空則不送出」的判斷需要每次點擊都完整跑過 `trackAttributes` 查找才能得知** → 與原本「需先算出 link_name 才能判斷是否為空」的效能特性相同，不是本次變更新增的效能疑慮；`trackAttributes` 清單通常不長（個位數），效能影響可忽略。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:3:目前 `click` 事件一律固定送出 `link_name`、`device_type`、`max_touch_points` 三個套件內建欄位，宿主專案能客製化的部分僅止於額外的 `trackAttributes` 清單，兩者疊加在同一個 payload 上。隨著客製化需求增加，套件內建欄位與宿主自訂欄位並存的模式讓「哪些欄位是套件保證存在、哪些是選填」變得模糊，也讓套件背負了「幫宿主專案決定 link_name/裝置資訊怎麼算」的職責。改為完全交由宿主專案透過 `trackAttributes` 宣告要送出的欄位，套件不再 default 帶入任何欄位，可讓 payload 內容單純由宿主專案掌控，套件只負責「查找、轉換 key、送出」。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:7:- **BREAKING**：`ClickInstrumentation` 送出的 `click` 事件 payload 不再自動包含 `link_name`、`device_type`、`max_touch_points` 三個內建欄位；移除對應的直接文字節點擷取、`data-link-name` 覆寫查找、裝置類型計算等邏輯。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:10:- **沿用已 commit 的驗證邏輯，並修正一個已發現的錯誤訊息 bug**：`initFaro()` 呼叫當下的 `trackAttributes` 驗證，移除「與內建欄位 key（`link_name`/`device_type`/`max_touch_points`）撞名」的檢查（因內建欄位已不存在，此檢查不再有意義）；保留並沿用已存在且已 commit 的「轉換後 key 於清單內部撞名」`Set` 檢查（見 [src/initFaro.ts](../../../src/initFaro.ts)）——對 `trackAttributes` 清單依序計算轉換後的 key，若與之前已出現過的 key 相同，`initFaro()` 呼叫當下立即拋出明確錯誤。發現當前實作在清單內部撞名分支複用了與內建欄位撞名相同的錯誤訊息文字（誤導為「內建欄位撞名」），本次變更順便修正成正確描述「與清單內其他項目轉換後重複」。「名稱需以 `data-` 開頭」的既有格式驗證維持不變。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:11:- **變更送出條件**：原本「點擊名稱 trim 後為空字串時不送出事件」的空名稱防呆，隨 `link_name` 移除而失去意義；改為「該次點擊經 `trackAttributes` 查找後，payload 為空物件（沒有任何欄位命中）時，不送出該次 `click` 事件」。只要至少有一個 `trackAttributes` 項目命中，即會送出事件（即使只有一個欄位）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:28:- **Affected code**：[src/click/clickInstrumentation.ts](../../../src/click/clickInstrumentation.ts)（移除 `link_name`/`device_type`/`max_touch_points` 計算邏輯與 `data-link-name`/直接文字節點擷取相關函式，改用「payload 是否為空」作為送出防呆條件；`toPayloadKey()` 已存在且已 commit，不需修改）、[src/initFaro.ts](../../../src/initFaro.ts)（`validateTrackAttributes()` 移除內建欄位撞名檢查，修正清單內部撞名檢查的錯誤訊息文字 bug，更新 doc comment；轉換後 key 撞名的 `Set` 檢查邏輯已存在且已 commit，不需修改）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:29:- **Affected tests**：`clickInstrumentation.test.ts`（移除 `link_name`/`device_type`/`max_touch_points` 相關測試案例，新增 payload 為空不送出測試、trackAttributes 命中即送出測試；payload key 轉換相關測試已存在，不需新增）、`initFaro.test.ts`（移除撞內建欄位 key 的驗證測試；「轉換後 key 撞名」拋錯測試已存在，僅需視修正後的錯誤訊息文字調整比對內容）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/proposal.md:31:- **Breaking change 遷移**：既有依賴 `link_name`/`device_type`/`max_touch_points` 三個固定欄位的宿主專案，升級後這些欄位將不再出現於 `click` 事件；需改為透過 `trackAttributes` 自行標記對應的 `data-*` attribute（例如以 `data-link-name` 取代原生 `link_name` 邏輯），方能維持既有 Loki pipeline 相容。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:5:- [x] 1.1 移除 `getDirectTextContent()` 等僅用於計算 `link_name` 的內部函式，以及對 `../device/deviceType` 的 `getDeviceType` import 與呼叫
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:6:- [x] 1.2 `handleClick` 改為：payload 物件從空物件開始（不再預先塞入 `link_name`/`device_type`/`max_touch_points`），僅由既有 `trackAttributes` 迴圈（沿用 `getTrackedAttributeValue()` + 已存在的 `toPayloadKey()`）填入
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:23:- [x] 3.1 `clickInstrumentation.test.ts`：移除所有 `link_name`/`device_type`/`max_touch_points` 相關測試案例與 `setMaxTouchPoints`/`loadClickInstrumentation` 輔助函式
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:25:- [x] 3.3 新增測試：至少一個 `trackAttributes` 命中時，`pushEvent` 被呼叫且 payload **僅**包含命中的欄位（不含 `link_name`/`device_type`/`max_touch_points`）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:38:- [x] 5.1 更新 `README.md`：移除 `link_name`/`device_type`/`max_touch_points` 固定欄位說明與範例
src/faro-click-tracking/openspec/changes/host-defined-click-payload/tasks.md:40:- [x] 5.3 新增遷移範例：如何以 `trackAttributes` 宣告 `data-link-name` 取代原 `link_name` 邏輯（含「fallback 讀取文字節點」的行為已不再支援的提醒）
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:4:點擊事件 SHALL 以事件名稱 `click` 透過 Faro `pushEvent` 送出，事件內容 SHALL 僅包含由 `trackAttributes` 查找命中的欄位（依「payload key 轉換規則」轉換過 key 名稱），套件 SHALL NOT 自動附加任何內建欄位（例如原本的 `link_name`／`device_type`／`max_touch_points`）。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:113:**Reason**：`link_name` 欄位不再由套件內建計算，其擷取邏輯（`data-link-name` 查找、直接文字節點擷取）整組移除；宿主專案改用 `trackAttributes` 宣告 `data-link-name` 取得等效欄位。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:114:**Migration**：宿主專案若需維持原「點擊名稱」欄位，SHALL 於 `trackAttributes` 中加入 `data-link-name`，並於 HTML 上以 `data-link-name` attribute 標記需要穩定名稱的元素；套件會依既有 `trackAttributes` 查找機制（`.closest()`）取得該值，並以轉換後的 key `link_name` 併入 payload。若需要「找不到 `data-link-name` 時 fallback 讀取元素自身直接文字節點」的行為，套件不再提供，SHALL 由宿主專案自行於需要的元素上皆標記 `data-link-name`。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:121:**Reason**：專屬於 `link_name` 是否為空字串的防呆判斷，隨 `link_name` 欄位移除而失去意義；改由不限定特定欄位名稱的「payload 為空時不送出事件」需求取代。
src/faro-click-tracking/openspec/changes/host-defined-click-payload/specs/click-tracking-package/spec.md:122:**Migration**：無需額外遷移，行為由「payload 為空時不送出事件」需求延續（判斷依據從「link_name 是否為空」改為「trackAttributes 是否至少有一個命中」）。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:3:目前 `ClickInstrumentation` 採「預設全部追蹤、需標記 `data-link-name=""` 才能排除單一元素」的 opt-out 模式。隨著宿主專案（Foreman-Assistant）陸續發現「不想被記錄」的元素（例如純本地端表單操作按鈕，其顯示文字剛好構成有效 `link_name`），若持續用 opt-out 模式，每多一個不想追蹤的元素就要多改一次宿主程式碼並加上 `data-link-name=""`，長期下來排除清單會越來越長、越來越分散在各元件裡，難以維護，也不是宿主專案期望的使用方式。宿主專案期望的模型是反過來的：**只有明確標記 `data-link-name` 的元素才會被記錄**，其餘元素完全不追蹤；同時希望能全域決定要不要啟用這種「全域被動監聽」行為，因為並非每個專案都需要監聽全域點擊。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/proposal.md:12:  - 300ms 節流去重、`device_type`／`max_touch_points`／`link_name` 三欄位的事件內容格式不變。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:7:- 元素（或其祖先）帶有 `data-link-name` 且 trim 後非空字串時，行為與既有「點擊名稱可由 data-link-name attribute 覆寫」需求一致，採用該屬性值作為 `link_name`。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:10:- 300ms 節流去重、`click` 事件欄位格式（`link_name`／`device_type`／`max_touch_points`）不受模式影響。
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:14:- **THEN** 該次點擊事件正常送出，`link_name` 為該元素的直接文字節點內容
src/faro-click-tracking/openspec/changes/opt-in-link-tracking/specs/click-tracking-package/spec.md:18:- **THEN** 該次點擊事件送出，`link_name` 為 `"FifoToolkit"`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:10:- 移除 `getOverrideLinkName()`，`link_name` 僅依 `getDirectTextContent()` 決定。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:12:- 完全移除 `data-link-name` 與 `LINK_NAME_ATTRIBUTE`，套件不再有任何內建預設的 link name attribute。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:13:- `trackAttributes` 與 `link_name` 判斷解耦：僅維持既有「附加任意欄位到 payload」的通用機制（Object 形式，各自以原始 attribute 名稱為 key），不再有「命中值被用作 link_name」的特殊規則。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:22:### `link_name` 僅依直接文字節點決定，`trackAttributes` 與其解耦（移除 data-link-name，也不再由 trackAttributes 覆寫）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:23:`link_name` 恢復為單純呼叫 `getDirectTextContent(target)`，不再有任何 attribute（無論是 `data-link-name` 或 `trackAttributes` 命中值）可覆寫它；`trackAttributes` 僅維持既有「依清單各自查找，找到則以原始 attribute 名稱為 key 併入 payload」的通用附加欄位機制（Object 形式）。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:25:理由：`trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能標記頁面、區塊、功能等任意維度），把它當作決定 `link_name` 的來源等於把通用附加欄位機制強行綁死到 `link_name` 這個寫死的 key 上，違反「不寫死變數名稱」的原則。移除後 `trackAttributes` 回歸單純、通用，`link_name` 判斷邏輯也更單純。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:29:替代方案（不採用二）：保留 `data-link-name` 作為 fallback，或讓 `trackAttributes` 命中值覆寫 `link_name`。使用者確認 `trackAttributes` 不應與 `link_name` 綁定，決定完全解耦。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:32:`constructor` 不再讀取 `options.mode`；`ClickInstrumentationOptions` 移除 `mode` 欄位；`ClickTrackingMode` 型別、`this.mode` 欄位一併移除。文字節點 fallback（`getDirectTextContent`）維持不變、不受此決策影響，現在是 `link_name` 的唯一來源。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:38:- **BREAKING**：原本仰賴 `data-link-name` 或 `trackAttributes` 命中值決定 `link_name` 的宿主專案，`link_name` 會改回只取自身直接文字節點內容。→ Mitigation：於 proposal 中明確標記 BREAKING；若宿主專案需要穩定、與顯示文字無關的名稱，可改用 `trackAttributes` 將該 attribute 值以其原始名稱附加到 payload 中的其他欄位，自行在後端／查詢時使用該欄位。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/design.md:39:- **BREAKING**：僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，`link_name` 會整批改變為 fallback 文字節點內容或完全不同的值。→ Mitigation：proposal 中明確標記 BREAKING，並提示改為在 `trackAttributes` 註冊該 attribute 名稱。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:3:`getOverrideLinkName()` 只是 `getTrackedAttributeValue(element, LINK_NAME_ATTRIBUTE)?.trim()` 的單純包裝，沒有獨立邏輯，徒增一層間接呼叫。另外 `ClickInstrumentation` 目前的 `mode`（`'all'` / `'markedOnly'`）與「文字節點 fallback」機制增加了設定複雜度與行為分歧。進一步檢視後發現，套件內建的 `data-link-name` attribute 與宿主專案自訂的 `trackAttributes` 清單本質上做同一件事（`closest()` 查找＋取值），差別只在於 `data-link-name` 免去了「先在 `trackAttributes` 註冊一次」這個步驟；但目前唯一的實際使用情境本來就需要主動設定 `trackAttributes`，這個「免設定」的價值低於多維護一條路徑、多兩個規格需求的成本，因此決定連同 `data-link-name` 一併移除。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:5:再進一步檢視發現，`trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能只是想標記頁面／區塊／功能等任意維度），把它當作決定 `link_name` 的來源等於強行把一個通用的附加欄位機制綁死到 `link_name` 這個寫死的 key 上。因此改回：`trackAttributes` 僅作為既有的「附加任意欄位到 payload」通用機制（以 Object 形式、各自以原始 attribute 名稱為 key），與 `link_name` 完全脫鉤；`link_name` 單純依「自身直接文字節點」決定，不再有任何 attribute 可覆寫它。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:9:- 移除 `getOverrideLinkName()`；`link_name` 僅依 `getDirectTextContent()` 決定，不再有任何 attribute 可覆寫。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:11:- **BREAKING**: 完全移除 `data-link-name` attribute 支援（含 `LINK_NAME_ATTRIBUTE` 常數）；套件不再有任何內建預設的 link name attribute。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:12:- `trackAttributes` 恢復為單純的通用附加欄位機制：依清單各自查找，找到則以原始 attribute 名稱為 key 併入 payload（Object 形式），與 `link_name` 判斷完全無關；不再有「第一個命中值被用作 link_name」的特殊規則。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:17:- `click-tracking-package`: 點擊名稱擷取規則變更為「僅依自身直接文字節點決定，無 attribute 可覆寫」，移除 `data-link-name` 與 `mode` 選項相關需求；`trackAttributes` 與 `link_name` 判斷解耦，維持既有「附加欄位」需求不變。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/proposal.md:22:- 對外 API 破壞性變更：移除 `mode` 選項與 `ClickTrackingMode` 型別匯出；移除 `data-link-name` 支援；`trackAttributes` 不再影響 `link_name`。原本仰賴「標記 `data-link-name` 或 `trackAttributes` 命中值決定 link_name」的宿主專案，`link_name` 會改回只取該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:3:- [x] 1.1 移除 `getOverrideLinkName()`、`LINK_NAME_ATTRIBUTE` 常數與 `data-link-name` 相關邏輯
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:5:- [x] 1.3 新增 `link_name` 決定邏輯：依序遍歷 `trackAttributes`，取第一個 `getTrackedAttributeValue()` 命中（非 `undefined`）的值（trim 後）；若皆未命中，fallback 至既有 `getDirectTextContent(target)`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:6:- [x] 1.4 確認「額外附加到 payload」迴圈維持不變（`trackAttributes` 命中的 attribute 仍以原始名稱併入 payload，即使該值已被用作 `link_name`）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:25:## 5. link_name 與 trackAttributes 解耦（設計反悔修正）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:27:- [x] 5.1 移除 `handleClick()` 中「依序遍歷 `trackAttributes` 決定 `link_name`」的迴圈；`link_name` 改為固定呼叫 `getDirectTextContent(target)`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:28:- [x] 5.2 更新 `ClickInstrumentationOptions.trackAttributes` 的註解，移除「同時也是決定 link_name 的來源」的描述，恢復為單純的附加欄位說明
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:29:- [x] 5.3 更新 `clickInstrumentation.test.ts`：還原/移除先前新增的「trackAttributes 命中決定 link_name」相關測試斷言，改為驗證 `trackAttributes` 命中不影響 `link_name`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/tasks.md:35:- [x] 6.1 `InitFaroConfig` 移除 `linkTracking` 巢狀物件，`trackAttributes?: string[]` 改為頂層欄位；更新 doc comment，移除過時的「決定 link_name 的唯一客製化來源」描述
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:8:- **THEN** 該次點擊事件的 `link_name` 為 `"首頁"`
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:12:- **THEN** 該次點擊事件的 `link_name` 不包含任何子孫元素的文字內容（即擷取結果為空字串）
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:14:#### Scenario: trackAttributes 命中不影響 link_name
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:16:- **THEN** 該次點擊事件的 `link_name` 為 `"確認"`，不受 `data-page` 的值影響
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:21:Package SHALL 支援宿主專案於 `initFaro({ trackAttributes })` 宣告一份 `data-*` attribute 名稱清單。每次點擊時，套件對清單中每一個名稱各自從 `event.target` 開始以 `closest()` 往上查找最近一個帶有該 attribute 的元素（含自身），找到則將其值以「原始 attribute 名稱」為 key 併入同一筆 `click` event payload（Object 形式）；找不到則該欄位不出現在 payload 中，不視為錯誤。此機制與「點擊名稱擷取規則」完全無關，SHALL NOT 影響 `link_name` 的決定。此設定 SHALL 為 `InitFaroConfig` 的頂層欄位，SHALL NOT 巢狀於任何以「link」命名的物件之下——套件可追蹤任意 attribute，並非只限定於 link 相關用途。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:39:**Migration**: 原本僅靠標記 `data-link-name`（未設定 `trackAttributes`）的宿主專案，需改為在 `initFaro({ trackAttributes: ['data-link-name'] })` 中明確註冊該 attribute 名稱；該值會以「額外附加欄位」的形式出現在 payload 中（key 為 `data-link-name`），但不再覆寫 `link_name`——`link_name` 一律採用該元素自身的直接文字節點內容。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:41:### Requirement: trackAttributes 可覆寫 link_name
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:42:**Reason**: `trackAttributes` 的用途不必然與「link」語意相關（宿主專案可能用它標記頁面、區塊、功能等任意維度），將其中命中值強制當作 `link_name` 的來源，等於把通用的附加欄位機制綁死到 `link_name` 這個寫死的 key 上。點擊名稱擷取規則改為與 `trackAttributes` 完全解耦，`trackAttributes` 回歸單純的「附加任意欄位到 payload」通用機制。
src/faro-click-tracking/openspec/changes/simplify-click-link-name-tracking/specs/click-tracking-package/spec.md:43:**Migration**: 原本依賴 `trackAttributes` 命中值決定 `link_name` 的宿主專案，`link_name` 會改為該元素自身的直接文字節點內容；該 attribute 的原始值仍會以「原始 attribute 名稱」為 key 出現在同一筆 payload 中（見「trackAttributes 附加欄位」需求），未消失，僅不再寫入 `link_name`。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:42:- **THEN** 該次點擊事件的 `link_name` 為 `"首頁"`
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:46:- **THEN** 該次點擊事件的 `link_name` 不包含任何子孫元素的文字內容（即擷取結果為空字串）
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:55:- **THEN** 該次點擊事件的 `link_name` 為 `"FifoToolkit"`，不採用該元素的顯示文字
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:59:- **THEN** 該次點擊事件的 `link_name` 為 `"FifoToolkit"`
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:84:點擊事件 SHALL 以事件名稱 `click` 透過 Faro `pushEvent` 送出，事件內容 SHALL 包含 `link_name`（依擷取規則得出的點擊名稱）、`device_type`（依 `navigator.maxTouchPoints > 0` 判斷為 `tablet`，否則為 `desktop`）、`max_touch_points`（`navigator.maxTouchPoints` 原始數值字串）三個欄位。`device_type`／`max_touch_points` SHALL 於該次點擊事件觸發當下即時計算，反映觸發當下的裝置狀態。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:88:- **THEN** 系統以事件名稱 `click` 呼叫 `pushEvent`，事件內容包含 `link_name`、`device_type`、`max_touch_points` 三個欄位
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:135:`ClickInstrumentation` 送出的 `click` 事件 `pushEvent` payload SHALL NOT 額外攜帶使用者資訊欄位；使用者資訊僅透過「使用者資訊自動附加」需求所述的 metas 機制提供，不與既有 `link_name`／`device_type`／`max_touch_points` 欄位混雜。
src/faro-click-tracking/openspec/specs/click-tracking-package/spec.md:139:- **THEN** 該次 `pushEvent` 的 payload 欄位 SHALL 僅包含 `link_name`／`device_type`／`max_touch_points`，SHALL NOT 包含任何使用者相關欄位
src/faro-click-tracking/src/features/click/clickInstrumentation.ts:20:   * （例如過去的 `link_name`/`device_type`/`max_touch_points`）。

``````

## Learning（修改前）

``````text
## data-link-name (106 matching lines)
EVIDENCE-GAP-REPORT.md:15:| Foreman Faro init、`data-link-name` placement、user source、device opt-in（Lesson 2/4/6） | VERIFIED CURRENT STATE | `XD-Foreman-Assistant` main source、templates、PR #21、package lock、runtime deployment | 尚未逐一 browser-click proof 所有 controls | [`foreman-integration.md`](sources/evidence/foreman-integration.md)；repo `4e032babef7aa30e5d13d7a506abe208945a5dee`，`src/main.ts:11-34`、templates `main.component.html:42-84` / `toolbar.component.html:81-145`。 |
learning-records/0002-data-attribute-vs-dom-model.md:22:<button data-link-name="daily-schedule">每日生產排程</button>
learning-records/0002-data-attribute-vs-dom-model.md:25:Browser parse HTML 後會建立對應的 DOM element object（此例為 `HTMLButtonElement`）。`data-link-name` 是這個 DOM element 上的一個 attribute，因此可以從 DOM API 讀取：
learning-records/0002-data-attribute-vs-dom-model.md:29:button.getAttribute('data-link-name'); // "daily-schedule"
learning-records/0002-data-attribute-vs-dom-model.md:37:<button data-link-name="daily-schedule">
learning-records/0002-data-attribute-vs-dom-model.md:43:  └── attribute: data-link-name="daily-schedule"
learning-records/0002-data-attribute-vs-dom-model.md:61:<button id="schedule" data-link-name="daily-schedule">
learning-records/0002-data-attribute-vs-dom-model.md:66:> 一顆 button DOM object，上面有 `id` 與 `data-link-name` attributes。
learning-records/0002-data-attribute-vs-dom-model.md:147:- 如果需求是「要知道具體是哪個 logical action 被點擊」，則該 action 的 target → ancestor path 必須存在能區分 action 的 semantic，例如不同的 `data-action` / `data-link-name`。
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:5:目前 Foreman Assistant 的 `trackAttributes` 已驗證只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。
learning-records/0007-runtime-values-require-runtime-evidence.md:3:已修正的教學邊界：Foreman Assistant source 中的 `[attr.data-link-name]="item.subsystem"` 只能證明 dynamic value 會被綁到 `data-link-name`，不能證明目前部署中的任何特定 subsystem 名稱、畫面文字或 route/query string。
learning-records/0007-runtime-values-require-runtime-evidence.md:5:後續教材與 Lab 若需要具體 tracking value，必須先從當下 Browser live DOM 讀取；若 `closest('[data-link-name]')` 回傳 `null`，應把「目前 ancestor path 沒有命中」保留為有效 evidence，而不是用教材範例補值。Source model、deployed DOM 與 Network payload 必須分層驗證，再用同一個 runtime value 做 correlation。
learning-records/0008-devtools-lab-requires-screen-literacy.md:13:- 不應創造像 `TRACKING_VALUE` 這種只為教材方便存在、但 learner 會誤以為是系統概念或程式變數的 placeholder；直接使用「剛才從 live DOM 讀到的 `data-link-name` 值」。
learning-records/0009-browser-debugging-evidence-boundaries.md:26:   - This run discovered current `[data-link-name]` elements at runtime.
learning-records/0009-browser-debugging-evidence-boundaries.md:38:   - The click POST was correlated by equality between the live DOM `data-link-name` and payload `attributes.link_name`.
lessons/0002-faro-click-instrumentation.html:62:  <pre><code>&lt;p-button data-link-name="MCCS"&gt;
lessons/0002-faro-click-instrumentation.html:74:      └── p-button[data-link-name="MCCS"]
lessons/0002-faro-click-instrumentation.html:84:p-button[data-link-name="MCCS"]   ✓</code></pre>
lessons/0002-faro-click-instrumentation.html:86:  <p>這就是 <code>closest('[data-link-name]')</code> 的用途。它不是找 listener，而是找「離 target 最近、具有指定 attribute 的 ancestor / self」。</p>
lessons/0002-faro-click-instrumentation.html:95:        <tr><td>Foreman developer</td><td>在 template / component markup 上實際加上 <code>data-link-name</code> 與它的值。</td></tr>
lessons/0002-faro-click-instrumentation.html:103:data-link-name exists
lessons/0002-faro-click-instrumentation.html:114:  'data-link-name'
lessons/0002-faro-click-instrumentation.html:119:  <p>目前已驗證有 <code>data-link-name</code> 的地方包含：</p>
lessons/0002-faro-click-instrumentation.html:122:    <li>主畫面的 subsystem 入口：<code>[attr.data-link-name]="item.subsystem"</code>。</li>
lessons/0002-faro-click-instrumentation.html:132:  <pre><code>data-link-name="MCCS"</code></pre>
lessons/0002-faro-click-instrumentation.html:142:  <pre><code>data-link-name
lessons/0002-faro-click-instrumentation.html:152:└── link_name       ← data-link-name
lessons/0002-faro-click-instrumentation.html:164:  <p>第一種：target 與 ancestors 都找不到 <code>data-link-name</code>。</p>
lessons/0002-faro-click-instrumentation.html:166:  <pre><code>closest('[data-link-name]') → not found
lessons/0002-faro-click-instrumentation.html:191:    │      └── data-link-name only
lessons/0002-faro-click-instrumentation.html:193:    ├── closest('[data-link-name]')
lessons/0002-faro-click-instrumentation.html:221:    <div class="question">Q2. Foreman 現在的 <code>data-link-name</code> 是誰建立在 DOM 上的？</div>
lessons/0002-faro-click-instrumentation.html:234:      <button class="choice" data-correct="true" data-feedback-correct="目前 main.ts 已驗證只設定 data-link-name。">只有 data-link-name</button>
lessons/0002-faro-click-instrumentation.html:235:      <button class="choice" data-correct="false" data-feedback-incorrect="目前沒有設定 data-page。">data-page 與 data-link-name</button>
lessons/0002-faro-click-instrumentation.html:243:    <div class="question">Q4. <code>data-link-name="MCCS"</code> 被命中時，核心 click payload 是？</div>
lessons/0002-faro-click-instrumentation.html:247:      <button class="choice" data-correct="true" data-feedback-correct="data-link-name 會 normalize 成 link_name。"><code>{ link_name: "MCCS" }</code></button>
lessons/0002-faro-click-instrumentation.html:259:    <li><code>data-link-name</code> 由 Foreman developer 放在 DOM 上，Faro package 只讀取。</li>
lessons/0002-faro-click-instrumentation.html:260:    <li>Foreman 現在 <code>trackAttributes</code> 只有 <code>data-link-name</code>。</li>
lessons/0002-faro-click-instrumentation.html:261:    <li><code>data-link-name="MCCS"</code> 會形成 <code>{ link_name: "MCCS" }</code>。</li>
lessons/0003-package-initialization-singleton-public-api.html:45:  trackAttributes: ['data-link-name'],
lessons/0004-user-device-environment-context.html:433:      <button class="choice" data-correct="false" data-feedback-incorrect="data-link-name 只影響 click payload extraction。">檢查 DOM data-link-name 設定</button>
lessons/0006-browser-devtools-verification.html:45:   這個 UI 的 live DOM 到底有沒有 data-link-name？
lessons/0006-browser-devtools-verification.html:73:  <pre><code>&lt;p-button [attr.data-link-name]="item.subsystem" ...&gt;</code></pre>
lessons/0006-browser-devtools-verification.html:75:  <p>這只能證明 source 會把 runtime 的 <code>item.subsystem</code> 寫進 <code>data-link-name</code>；實際值仍要看 live DOM。</p>
lessons/0006-browser-devtools-verification.html:82:$0.closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:83:$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code></pre>
lessons/0006-browser-devtools-verification.html:90:$0.closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:91:→ p-button[data-link-name="DailySchedule"]
lessons/0006-browser-devtools-verification.html:93:getAttribute('data-link-name')
lessons/0006-browser-devtools-verification.html:100:  │ closest('[data-link-name]') 往 ancestor 找
lessons/0006-browser-devtools-verification.html:102:p-button[data-link-name="DailySchedule"]</code></pre>
lessons/0006-browser-devtools-verification.html:104:col160:...s="evidence-frame"><img src="../assets/lesson-6/09-devtools-elements-ui.png" alt="真實 Elements 顯示選定 p-button 的 data-link-name"><svg class="evidence-focus" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="2.5" y="4" width="5.2" height="2.7"/><rect x="16"...
lessons/0006-browser-devtools-verification.html:104:col553:...ass="evidence-mark-note">紅框為教學標示；底圖為真實截圖。</span> <strong>真實 Elements。</strong>頂端 Elements → 左側藍底 node → <code>data-link-name="DailySchedule"</code>；底部 breadcrumb 是 ancestor 路徑，右側 Styles 是 CSS。這證明 attribute 所在層，不證明 listener 註冊或 execution。可展開 node 追 children；inner target 不一定是這個 hos...
lessons/0006-browser-devtools-verification.html:108:    後面只要一直說「剛才從 live DOM 讀到的 <code>data-link-name</code> 值」。本課擷取例子的值就是 <code>DailySchedule</code>。這是2026-09-16 擷取當時的 runtime observation，不代表所有環境永遠都有同一個名稱。
lessons/0006-browser-devtools-verification.html:175:  <pre><code>closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:176:getAttribute('data-link-name')
lessons/0006-browser-devtools-verification.html:316:  data-link-name="DailySchedule"
lessons/0006-browser-devtools-verification.html:420:    <li>執行 <code>$0.closest('[data-link-name]')</code>。</li>
lessons/0006-browser-devtools-verification.html:421:    <li>執行 <code>$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code>。</li>
lessons/0006-browser-devtools-verification.html:422:    <li>直接記住「剛才讀到的 <code>data-link-name</code> 值」，不要另外發明變數名稱。</li>
lessons/0006-browser-devtools-verification.html:456:    <li>只有 <code>link_name</code> 等於剛才 live DOM 讀到的 <code>data-link-name</code> 值，才把這筆 POST 跟剛才 click 關聯起來。</li>
lessons/0006-browser-devtools-verification.html:473:  data-link-name ancestor = ?
lessons/0006-browser-devtools-verification.html:474:  data-link-name value = ?
lessons/0006-browser-devtools-verification.html:497:  是否等於 DOM 的 data-link-name = ?
lessons/0006-browser-devtools-verification.html:511:        <tr><td>Live DOM 有 <code>data-link-name</code></td><td>目前 ancestor path 有可抽取值。</td><td>Faro callback 已執行。</td></tr>
lessons/0006-browser-devtools-verification.html:565:      <button class="choice" data-correct="true" data-feedback-correct="用 live DOM 的實際 data-link-name 與 Payload 的 link_name 做 correlation。">比對 Payload 的 link_name</button>
lessons/0006-browser-devtools-verification.html:592:    <li><strong>多筆 POST 不靠順序猜</strong>；用 DOM 的 <code>data-link-name</code> 與 Payload 的 <code>link_name</code> 做 correlation。</li>
reference/0005-devtools-workspaces-for-faro.html:24:      <tr><td><a href="#elements">Elements</a></td><td>可展開的 DOM 樹、attributes、CSS 與 element 相關側欄</td><td>click target 與 ancestor 的 <code>data-link-name</code></td><td>callback 已執行、HTTP 已送出</td></tr>
reference/0005-devtools-workspaces-for-faro.html:38:col686:...de>p-button</code>，底部是 ancestor breadcrumb；右側 Styles 是 CSS，不是 telemetry。<strong>看哪裡：</strong>藍底 node 上的 <code>data-link-name="DailySchedule"</code>。這證明 live attribute 存在，不證明 callback 執行。</figcaption></figure>...
reference/0005-devtools-workspaces-for-faro.html:43:    <li>沿 parent 展開／查看，找到持有 <code>data-link-name</code> 的 ancestor。</li>
reference/0005-devtools-workspaces-for-faro.html:54:$0.closest('[data-link-name]')?.getAttribute('data-link-name')
sources/evidence/foreman-browser-debug-lab.md:27:- Selected live element: `P-BUTTON[data-link-name="DailySchedule"]`
sources/evidence/foreman-browser-debug-lab.md:28:- Actual `data-link-name`: `DailySchedule`
sources/evidence/foreman-browser-debug-lab.md:30:- `clickTarget.closest('[data-link-name]')`: the ancestor `P-BUTTON`
sources/evidence/foreman-browser-debug-lab.md:36:          └─ P-BUTTON[data-link-name="DailySchedule"]
sources/evidence/foreman-browser-debug-lab.md:146:    live DOM data-link-name = DailySchedule
sources/evidence/foreman-browser-lab-2026-09-16.md:19:- `$0.closest('[data-link-name]')` 命中 ancestor `<p-button ... data-link-name="EfficiencyAbnormalReport" ...>`。
sources/evidence/foreman-browser-lab-2026-09-16.md:20:- `$0.closest('[data-link-name]')?.getAttribute('data-link-name')` 回傳 `EfficiencyAbnormalReport`。
sources/evidence/foreman-browser-lab-2026-09-16.md:26:  │ closest('[data-link-name]')
sources/evidence/foreman-browser-lab-2026-09-16.md:28:p-button[data-link-name="EfficiencyAbnormalReport"]
sources/evidence/foreman-browser-lab-2026-09-16.md:78:  data-link-name="EfficiencyAbnormalReport"
sources/evidence/foreman-browser-lab-2026-09-16.md:80:      │ ClickInstrumentation contract extracts data-link-name
sources/evidence/foreman-browser-lab-2026-09-16.md:101:- Lesson 6 不應使用抽象 placeholder `TRACKING_VALUE`；應直接說「剛才從 live DOM 讀到的 `data-link-name` 值」。
sources/evidence/foreman-integration.md:22:- `trackAttributes` 只有 `['data-link-name']`；`enableDeviceTypeDetection: true`。
sources/evidence/foreman-integration.md:27:- `src/app/layout/main/main.component.html:42-84` 的系統入口以 `[attr.data-link-name]="item.subsystem"` 放在 `<p-button>` host 上。
sources/evidence/foreman-integration.md:28:- `item.subsystem` 是 dynamic runtime data。這份 source evidence 證明的是「runtime 值會綁到 `data-link-name`」這個 contract，**不枚舉、也不證明目前部署中的任何特定 subsystem 名稱或對應 URL**。若教材或 Lab 需要具體值，必須從當下 live DOM / runtime evidence 讀取。
sources/evidence/foreman-integration.md:29:- `src/app/shared/toolbar/toolbar.component.html:81-145` 有五個 static `data-link-name` 值（`UserGuide.UserGuide`、`ReferenceDocument.SDS`、`ReferenceDocument.AI`、`ReferenceDocument.ForemanManual`、`Contact.ContactAdministrator`）。
sources/evidence/foreman-integration.md:36:- PrimeNG `18.0.2` source（tag commit `aaef4d94aabcbdbc58e0d523a52f23ae05660810`）的 `packages/primeng/src/button/button.ts` 由 `<p-button>` host render 內部 native `<button>`。Foreman 的 `data-link-name` 因此位於 custom-element host，而不是直接位於 inner button；inner button 仍以 ancestor 路徑連到 host，package 的 `element.closest('[data-link-name]')` 可找到它。
sources/evidence/jeter-integration-and-tracing.md:20:- `environment` 取自 `FARO_ENVIRONMENT`；`backendUrls` 是 `[new RegExp(BACKEND_URL)]`；`trackAttributes` 是 `['data-link-name']`；`enableDeviceTypeDetection` 為 `true`。
sources/evidence/opensearch-field-lifecycle.md:19:- Package `ClickInstrumentation` first transforms `data-link-name` to payload key `link_name` (and `data-panel-topic` to `panel_topic`) before calling `pushEvent()`. Thus the package normalization and translator prefix are two separate layers.
sources/linked/internal/foreman-assistant.md:7:- why it matters: host init, localStorage user callback, actual `data-link-name` placement, component scan and package versions.
sources/materials/1. PI 前端監控案例.html:1081:col62894:...自行定義 attribute name (ex. <span class="inline-comment" data-comment-ref="0a24cc62-5fe8-4b4c-a25a-84b2a0affb92">data-link-name</span>), 套件只會抓取 host 定義好的 attribute name.</li><li>faro-click-tracking 會將自定義的 attribute name 的 data-* 前綴刪除並且將 &quot;-&quot; 改成 &quot;_&quot; ex. data-link-n...
sources/materials/1. PI 前端監控案例.html:1081:col63053:...e name.</li><li>faro-click-tracking 會將自定義的 attribute name 的 data-* 前綴刪除並且將 &quot;-&quot; 改成 &quot;_&quot; ex. data-link-name → link_name 參考<a href="https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/937d4a32e725877188a8d8a223529dece0449d4d/src/faro-click-tracking/src/f...
sources/materials/1. PI 前端監控案例.html:1101:  trackAttributes: [&#x27;data-link-name&#x27;], // 選填, 自定義點擊事件追蹤的 attribute, 是一個陣列, 可以支援多個 attribute
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1057:col1979:...rumentation</td><td>event</td><td>click</td><td>任何有標記 trackAttributes 的元件, 被點擊時會記錄該 attribute 的 value.<br>ex. data-link-name=&quot;garmin&quot;, 會記錄 garmin </td></tr><tr><td>UserSyncInstrumentation</td><td>設定在 meta,任何 signal 都會帶上</td><td>看 meta 設定了哪些 value, <br>faro-click-trackin...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048256:...4afc84bcclickInstrumentation1</p><ol><li>拿到 event.target，對 trackAttributes 清單裡每一個名稱，各自用 target.closest(&#x27;[data-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payload，key 經過 toPayloadKey() 轉換（data-link-name → link_name）——這一步是因為 Loki 那端會自動加上 event_data_ 前綴，若 key 本身還...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048353:...osest(&#x27;[data-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payload，key 經過 toPayloadKey() 轉換（data-link-name → link_name）——這一步是因為 Loki 那端會自動加上 event_data_ 前綴，若 key 本身還帶連字號會無法被 query 解析。</li><li>如果<strong>所有</strong> trackAttributes 都沒找到任何元素，這次點擊完全不送事件（payload 是空的就...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1432:...>trackAttributes 說明 : </strong>是一個 array, 使用者(host) 可以帶入任意數量的 attributes name. (ex. data-jeter, data-brandon, data-link-name), 會根據在 trackAttributes 內填入的 attribute name 進行點擊事件監聽<ul><li>容易混淆的部分:  請看下方的範例, 這是從 <a href="https://github.com/garmin-tw-mfg-eng/Jeter-Faro-Trace-Demo/blob/...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1104:  data-link-name={link.name} // 專門為了要讓套件可以監聽點擊事件添加的 attribute name
sources/materials/4. Faro-Click-Tracking 的歷史.html:1798:          &lt;div class=&quot;rail-item&quot;&gt;&lt;span class=&quot;v&quot;&gt;v2&lt;/span&gt;&lt;span class=&quot;d&quot;&gt;&lt;code&gt;data-link-name&lt;/code&gt; 可覆寫文字&lt;/span&gt;&lt;/div&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1799:          &lt;div class=&quot;rail-item&quot;&gt;&lt;span class=&quot;v&quot;&gt;v3&lt;/span&gt;&lt;span class=&quot;d&quot;&gt;&lt;code&gt;trackAttributes&lt;/code&gt; 通用清單;移除 mode / fallback / &lt;code&gt;data-link-name&lt;/code&gt;&lt;/span&gt;&lt;/div&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1816:              &lt;td&gt;加入 &lt;code&gt;data-link-name&lt;/code&gt; attribute 覆寫:元素或祖先帶此 attribute 時直接採用其值,不再讀文字&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1820:              &lt;td&gt;&lt;strong&gt;&lt;code&gt;data-link-name&lt;/code&gt; 覆寫&lt;/strong&gt;(opt-in 單一 attribute)&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1821:              &lt;td&gt;只支援單一標記 &lt;code&gt;data-link-name&lt;/code&gt;,&lt;code&gt;closest()&lt;/code&gt; 往上找;曾評估函式型 &lt;code&gt;getExtraFields(target)&lt;/code&gt; hook&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1823:              &lt;td&gt;改成&lt;strong&gt;宣告式清單&lt;/strong&gt; &lt;code&gt;trackAttributes: string[]&lt;/code&gt;:宿主只給要追蹤的 attribute 名稱,套件比照 &lt;code&gt;data-link-name&lt;/code&gt; 的 &lt;code&gt;closest()&lt;/code&gt; 邏輯逐一查找併入 payload&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1828:              &lt;td&gt;&lt;code&gt;data-link-name&lt;/code&gt; / &lt;code&gt;mode(&#x27;all&#x27;|&#x27;markedOnly&#x27;)&lt;/code&gt; / 文字 fallback 三套機制並存;&lt;code&gt;trackAttributes&lt;/code&gt; 曾被當成「決定 &lt;code&gt;link_name&lt;/code&gt; 的來源」&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1830:              &lt;td&gt;&lt;span class=&quot;brk&quot;&gt;BREAKING&lt;/span&gt; 移除 &lt;code&gt;mode&lt;/code&gt;、&lt;code&gt;ClickTrackingMode&lt;/code&gt;、&lt;code&gt;data-link-name&lt;/code&gt;、文字 fallback;&lt;code&gt;trackAttributes&lt;/code&gt; 回歸單純「附加任意欄位」通用機制&lt;/td&gt;
sources/materials/6. 前後端 Trace 串接範例.html:1112:  // 全域點擊監聽只追蹤標記了 data-link-name 的元素，轉換為 event_data_link_name
sources/materials/6. 前後端 Trace 串接範例.html:1113:  trackAttributes: [&#x27;data-link-name&#x27;],
## [attr.data-link-name] (4 matching lines)
learning-records/0007-runtime-values-require-runtime-evidence.md:3:已修正的教學邊界：Foreman Assistant source 中的 `[attr.data-link-name]="item.subsystem"` 只能證明 dynamic value 會被綁到 `data-link-name`，不能證明目前部署中的任何特定 subsystem 名稱、畫面文字或 route/query string。
lessons/0002-faro-click-instrumentation.html:122:    <li>主畫面的 subsystem 入口：<code>[attr.data-link-name]="item.subsystem"</code>。</li>
lessons/0006-browser-devtools-verification.html:73:  <pre><code>&lt;p-button [attr.data-link-name]="item.subsystem" ...&gt;</code></pre>
sources/evidence/foreman-integration.md:27:- `src/app/layout/main/main.component.html:42-84` 的系統入口以 `[attr.data-link-name]="item.subsystem"` 放在 `<p-button>` host 上。
## trackAttributes (68 matching lines)
EVIDENCE-GAP-REPORT.md:11:| Lesson 2 / learning record 0002 先前把 `trackAttributes` 的 `data-*` 限制弱化成 host 偏好 | VERIFIED（修正已完成） | current validation 明確 `name.startsWith('data-')`，錯誤發生於 SDK init 前；tests 覆蓋 invalid `page`；Lesson 2 quiz/recap 與 learning record 現已明寫 requirement | 無 current-text gap；歷史動機另列 Unknown | 已確認 source 實際是「每個名稱 SHALL 以 `data-` 開頭」，並保留此 invariant。精確 source `src/initFaro/initFaro.ts:81-100`、test `:133-161`，HEAD `937d4a32...`。 |
EVIDENCE-GAP-REPORT.md:29:- 先前版本曾把 `trackAttributes` 對 `data-*` 的硬性限制弱化成 host「希望」使用；這是本輪沿用的 audit pattern。現行 branch 的 Lesson 2 已有明確「強制只接受 `data-*`」、`href` 初始化失敗的 quiz 與 learning record 強調 validation requirement，因此目前**沒有尚未修正的 data-* factual defect**。
LEARNING-MAP.md:86:- `trackAttributes` 是 payload extraction schema，不是 listener 清單。
learning-map/index.html:60:    <p>目標：從 <code>document</code> 原生 click listener 往下追，理解 <code>trackAttributes</code>、<code>closest()</code>、payload filtering、300ms throttle 與 <code>api.pushEvent()</code> 的責任邊界。</p>
learning-records/0002-data-attribute-vs-dom-model.md:5:Lesson 2 在介紹 Faro `trackAttributes` 時，learner 暴露一個必要 prerequisite gap：
learning-records/0002-data-attribute-vs-dom-model.md:122:目前 `faro-click-tracking` 的 `trackAttributes` validation 明確要求每個名稱必須以 `data-` 開頭；非 `data-*` 會在初始化時報錯。因此不是「通常」要這樣做，而是現行 package contract 的硬性限制。
learning-records/0002-data-attribute-vs-dom-model.md:124:若 host 要讓某個 telemetry semantic 被 ClickInstrumentation 擷取，例如 `link_name`，該值必須存在於 target → ancestor DOM path 上某個被設定於 `trackAttributes` 的 `data-*` attribute。
learning-records/0002-data-attribute-vs-dom-model.md:126:這不是 HTML / DOM 本身的限制。`id`、`href`、`class` 等原生 attributes 仍存在於 DOM，也能被 JavaScript 讀，只是目前這個 package 不接受它們直接作為 `trackAttributes`。
learning-records/0002-data-attribute-vs-dom-model.md:137:依 trackAttributes 從 target 往 ancestor 找 data-*
learning-records/0002-data-attribute-vs-dom-model.md:160:trackAttributes: ['data-page', 'data-action']
learning-records/0002-data-attribute-vs-dom-model.md:195:closest() / trackAttributes 行為            → 已驗證
learning-records/0002-data-attribute-vs-dom-model.md:212:- 現在 `trackAttributes` 強制 `data-*`。
learning-records/0002-data-attribute-vs-dom-model.md:214:- payload 只由 trackAttributes 命中結果組成。
learning-records/0002-data-attribute-vs-dom-model.md:217:但「為什麼最初決定把所有 trackAttributes 限制成 `data-*`」的完整作者動機／PR 歷史，目前仍沒有足夠 evidence 可以斷言。不能把 `toPayloadKey()` 的 Loki 問題直接反推成 `data-*` mandatory 的唯一原因。
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:5:目前 Foreman Assistant 的 `trackAttributes` 已驗證只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。
lessons/0002-faro-click-instrumentation.html:96:        <tr><td>Faro click package</td><td>不建立這些 DOM attributes；只依 <code>trackAttributes</code> 去讀。</td></tr>
lessons/0002-faro-click-instrumentation.html:113:  <pre><code>trackAttributes: [
lessons/0002-faro-click-instrumentation.html:126:  <p>DOM 裡即使還有其他 <code>data-*</code>，例如 <code>data-red-light-count</code>，只要沒有列進 <code>trackAttributes</code>，就不會進 click payload。</p>
lessons/0002-faro-click-instrumentation.html:147:  <p>現行 click payload 只包含命中的 configured <code>trackAttributes</code>。它不會自動塞入所有 DOM 資訊。</p>
lessons/0002-faro-click-instrumentation.html:232:    <div class="question">Q3. Foreman 現在 <code>trackAttributes</code> 的實際設定是？</div>
lessons/0002-faro-click-instrumentation.html:260:    <li>Foreman 現在 <code>trackAttributes</code> 只有 <code>data-link-name</code>。</li>
lessons/0003-package-initialization-singleton-public-api.html:45:  trackAttributes: ['data-link-name'],
lessons/0004-user-device-environment-context.html:373:    <li>Click 欄位錯了：回到 <a href="0002-faro-click-instrumentation.html">Lesson 2</a>，檢查 <code>trackAttributes</code>、DOM <code>data-*</code> 與 <code>closest()</code>。</li>
lessons/0004-user-device-environment-context.html:385:        <tr><td>click payload 沒有 user/device 欄位</td><td>先不要判定為錯誤</td><td>它們本來就不是 <code>trackAttributes</code> 產生的 click payload 欄位。</td></tr>
lessons/0004-user-device-environment-context.html:423:      <button class="choice" data-correct="false" data-feedback-incorrect="Device meta 不是 trackAttributes 的 click payload。"><code>Device</code> 由 click payload 提供</button>
sources/evidence/faro-click-tracking.md:19:- `initFaro()` 的 `trackAttributes` 是選用設定；但一旦提供，**每個名稱都必須以 `data-` 開頭**。`validateTrackAttributes()` 在 `initializeFaro()` 前檢查，不合法或轉換後 key 重複會立即 throw。
sources/evidence/faro-click-tracking.md:22:- payload 只包含命中的 `trackAttributes`，不自動加入 `link_name`、`device_type` 或其他欄位。payload 為空物件時不呼叫 `pushEvent()`，也不佔用 throttle timestamp。
sources/evidence/faro-click-tracking.md:57:- PR #26（merge commit `f3c5a0de0dd267d62a7259748252b5247e734122`，2026-08-12）與其 tests/description 證實 `trackAttributes` 的 `data-*` validation、未命中欄位省略；它沒有留下「為什麼 mandatory」的作者理由。
sources/evidence/faro-click-tracking.md:60:- 初始實作 commit `ca043905366203c4f7dfae35b4f097e870201c36`（2026-08-04）已使用 data-attribute contract；後續 `7d8427b5fb147a29234fb6b3cbeba5138db24a0a`、`bd4c040a55ccdf8be30c659978c7bba5f2c5c4d` 延伸 link-name/data-attribute handling。`git log -S`、PR、tests 與歷史文件沒有證明過 `key`、`href`、`id`、`class` 或 `aria-*` 曾是正式支援的 `trackAttributes` 輸入。
sources/evidence/faro-click-tracking.md:64:- 為什麼最初把 `trackAttributes` 限制為 `data-*`：**Unknown**。不可把 Loki hyphen query 問題反推成唯一原因。
sources/evidence/foreman-integration.md:22:- `trackAttributes` 只有 `['data-link-name']`；`enableDeviceTypeDetection: true`。
sources/evidence/jeter-integration-and-tracing.md:20:- `environment` 取自 `FARO_ENVIRONMENT`；`backendUrls` 是 `[new RegExp(BACKEND_URL)]`；`trackAttributes` 是 `['data-link-name']`；`enableDeviceTypeDetection` 為 `true`。
sources/materials/1. PI 前端監控案例.html:1101:  trackAttributes: [&#x27;data-link-name&#x27;], // 選填, 自定義點擊事件追蹤的 attribute, 是一個陣列, 可以支援多個 attribute
sources/materials/1. PI 前端監控案例.html:1103:col88848:...E.md#option-2-manually-calling-setfarouserclearfarouser">手動埋點紀錄 User info</a></li><li>存放在 meta </li></ul><h3> trackAttributes (選填)</h3><ul><li>是一個陣列, 可以存放多個 attributes</li><li>除了在 initFaro 設定, 還需要到 html 想追蹤的元素添加對應的 attributes</li><li>範例可以參照 <a href="https://github.com/garmin-tw-m...
sources/materials/1. PI 前端監控案例.html:1103:col89122:...n-tw-mfg-eng/faro-click-tracking/blob/main/README.md#option-2-manually-calling-setfarouserclearfarouser">如何設定 trackAttributes</a></li><li><strong>存放在 Event</strong>, 透過 pushEvent, 所以會在 otel.receiver.faro 添加 event_data_ prefix.  請看<a href="https://github.com/open-telemetry/opentel...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1057:col1923:...th><th>log 上的名稱</th><th>記錄的內容</th></tr><tr><td>ClickInstrumentation</td><td>event</td><td>click</td><td>任何有標記 trackAttributes 的元件, 被點擊時會記錄該 attribute 的 value.<br>ex. data-link-name=&quot;garmin&quot;, 會記錄 garmin </td></tr><tr><td>UserSyncInstrumentation</td><td>設定在 meta,任何 signal...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048086:... sync, 可以直接刪除 src/initFaro/iniFaro.ts 內的 userSync?.sync()</p><p><br></p><p><br></p></aside></li></ul><h2>點擊含有 trackAttributes 的元素會發生什麼</h2><p>b603884d-d8f8-422e-bebd-ba8e4afc84bcclickInstrumentation1</p><ol><li>拿到 event.target，對 trackAttributes 清單裡每一個名稱，各自用 target.closest(&#x27;[...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048205:...ibutes 的元素會發生什麼</h2><p>b603884d-d8f8-422e-bebd-ba8e4afc84bcclickInstrumentation1</p><ol><li>拿到 event.target，對 trackAttributes 清單裡每一個名稱，各自用 target.closest(&#x27;[data-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payload，key 經過 toPayloadKey() 轉換（data-link-name → link_...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048475:...me → link_name）——這一步是因為 Loki 那端會自動加上 event_data_ 前綴，若 key 本身還帶連字號會無法被 query 解析。</li><li>如果<strong>所有</strong> trackAttributes 都沒找到任何元素，這次點擊完全不送事件（payload 是空的就直接 return）。</li><li>300ms 內點擊的判斷是為了防止短時間內快速點擊造成的影響, 若未來不需要此限制可以移除</li></ol><h1>各 Feature 說明</h1><h2>initFaro</h2><p>公開的唯一初...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1063:  validateTrackAttributes(config.trackAttributes); // 驗證想要追蹤的元素有沒有依據 &quot;data-*&quot; 作為前綴開頭, 套件內部的功能, 使用者(host)不會知道
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1077:        trackAttributes: config.trackAttributes, // 監聽使用者(host)自定義的 (attribute name)
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1088:    // 選用 `device.type`（MetaDevice 官方欄位）而非自訂 trackAttributes，是因為裝置類型並非
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1323:...on, 全域監聽點擊事件, payload 則會透過 faro.api.pushEvent() 送到 Alloy Server or 未來升級的話可以送到 OTel collector.</li><li><strong>trackAttributes 說明 : </strong>是一個 array, 使用者(host) 可以帶入任意數量的 attributes name. (ex. data-jeter, data-brandon, data-link-name), 會根據在 trackAttributes 內填入的 attribute name 進行點...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1454:...</strong>是一個 array, 使用者(host) 可以帶入任意數量的 attributes name. (ex. data-jeter, data-brandon, data-link-name), 會根據在 trackAttributes 內填入的 attribute name 進行點擊事件監聽<ul><li>容易混淆的部分:  請看下方的範例, 這是從 <a href="https://github.com/garmin-tw-mfg-eng/Jeter-Faro-Trace-Demo/blob/3edd27eb44ac2af13d5c98...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1745:...aa0f6dd/src/jeter-faro-trace-demo/jeter-faro-trace-demo-frontend/src/App.tsx#L190-L199">Jeter-Faro-Trace-Demo trackAttributes 範例</a> 擷取</li><li>任何想要被點擊事件監聽的 attributes name 都是需要「額外」新增的, 若想要追蹤既有的 attribute name, ex. 下方的 key, 若添加到 trackAttributes 是沒辦法被追蹤且會報錯, 因為套件只認得 &quot;data-&qu...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1864:...ibutes 範例</a> 擷取</li><li>任何想要被點擊事件監聽的 attributes name 都是需要「額外」新增的, 若想要追蹤既有的 attribute name, ex. 下方的 key, 若添加到 trackAttributes 是沒辦法被追蹤且會報錯, 因為套件只認得 &quot;data-&quot; 前綴的 attribute name.<br>傳入 trackAttirubtes 的 attribute 必須是採用 &quot;data-&quot; 作為前綴, 否則會在 <a href="https://github.co...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1107:col1314:.../faro-click-tracking/src/initFaro/initFaro.ts#L142</a></li></ul><h1>Notes</h1><ul><li>click event payload 完全由 trackAttributes 決定, 套件不會 default 帶任何欄位。</li><li>裝置類型是透過 faro.metas.add() 帶入每個 signal</li><li>getUser 的呼叫時機會是 click/visibilitychange/storage</li></ul><p><br></p></main><sc...
sources/materials/4. Faro-Click-Tracking 的歷史.html:1788:          在 &lt;code&gt;document&lt;/code&gt; 掛一個 &lt;code&gt;click&lt;/code&gt; listener 監聽整頁點擊;對 &lt;code&gt;trackAttributes&lt;/code&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1799:          &lt;div class=&quot;rail-item&quot;&gt;&lt;span class=&quot;v&quot;&gt;v3&lt;/span&gt;&lt;span class=&quot;d&quot;&gt;&lt;code&gt;trackAttributes&lt;/code&gt; 通用清單;移除 mode / fallback / &lt;code&gt;data-link-name&lt;/code&gt;&lt;/span&gt;&lt;/div&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1823:              &lt;td&gt;改成&lt;strong&gt;宣告式清單&lt;/strong&gt; &lt;code&gt;trackAttributes: string[]&lt;/code&gt;:宿主只給要追蹤的 attribute 名稱,套件比照 &lt;code&gt;data-link-name&lt;/code&gt; 的 &lt;code&gt;closest()&lt;/code&gt; 邏輯逐一查找併入 payload&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1827:              &lt;td&gt;&lt;strong&gt;&lt;code&gt;trackAttributes&lt;/code&gt; 與 &lt;code&gt;link_name&lt;/code&gt; 解耦&lt;/strong&gt;&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1828:              &lt;td&gt;&lt;code&gt;data-link-name&lt;/code&gt; / &lt;code&gt;mode(&#x27;all&#x27;|&#x27;markedOnly&#x27;)&lt;/code&gt; / 文字 fallback 三套機制並存;&lt;code&gt;trackAttributes&lt;/code&gt; 曾被當成「決定 &lt;code&gt;link_name&lt;/code&gt; 的來源」&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1829:              &lt;td&gt;機制重疊、設定複雜、行為分歧。且 &lt;code&gt;trackAttributes&lt;/code&gt; 語意上&lt;strong&gt;不必然跟 link 相關&lt;/strong&gt;(可能只是標記頁面 / 區塊),硬綁到寫死的 &lt;code&gt;link_name&lt;/code&gt; key 不合理&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1830:              &lt;td&gt;&lt;span class=&quot;brk&quot;&gt;BREAKING&lt;/span&gt; 移除 &lt;code&gt;mode&lt;/code&gt;、&lt;code&gt;ClickTrackingMode&lt;/code&gt;、&lt;code&gt;data-link-name&lt;/code&gt;、文字 fallback;&lt;code&gt;trackAttributes&lt;/code&gt; 回歸單純「附加任意欄位」通用機制&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1835:              &lt;td&gt;&lt;code&gt;click&lt;/code&gt; 仍固定送 &lt;code&gt;link_name&lt;/code&gt; / &lt;code&gt;device_type&lt;/code&gt; / &lt;code&gt;max_touch_points&lt;/code&gt; 三個內建欄位,再疊加 &lt;code&gt;trackAttributes&lt;/code&gt;&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1837:              &lt;td&gt;&lt;span class=&quot;brk&quot;&gt;BREAKING&lt;/span&gt; 移除全部內建欄位。payload &lt;strong&gt;完全、僅&lt;/strong&gt;由 &lt;code&gt;trackAttributes&lt;/code&gt; 命中結果組成;送出條件從「名稱非空」改為「payload 非空物件」&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1890:  trackAttributes?: string[];
sources/materials/4. Faro-Click-Tracking 的歷史.html:1916:  private readonly trackAttributes: string[];
sources/materials/4. Faro-Click-Tracking 的歷史.html:1923:    this.trackAttributes = options.trackAttributes ?? [];
sources/materials/4. Faro-Click-Tracking 的歷史.html:1932:    // payload 完全由 trackAttributes 查找結果組成,套件不 default 帶入任何欄位;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1936:    for (const attributeName of this.trackAttributes) {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1943:    // 沒有任何 trackAttributes 命中時,這次點擊沒有可送的資訊,不送出事件(也不佔用節流時間戳記)。
sources/materials/4. Faro-Click-Tracking 的歷史.html:1970:&lt;pre&gt;&lt;code&gt;function validateTrackAttributes(trackAttributes: string[] | undefined): void {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1971:  if (!trackAttributes) {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1975:  for (const name of trackAttributes) {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1978:        `[faro-click-tracking] trackAttributes 中的 &quot;${name}&quot; 必須以 &quot;data-&quot; 開頭。`,
sources/materials/4. Faro-Click-Tracking 的歷史.html:1984:        `[faro-click-tracking] trackAttributes 中的 &quot;${name}&quot; 轉換後的欄位名稱 &quot;${payloadKey}&quot; 與清單內其他項目重複,` +
sources/materials/4. Faro-Click-Tracking 的歷史.html:1993://   validateTrackAttributes(config.trackAttributes);   ← 在任何副作用之前
sources/materials/4. Faro-Click-Tracking 的歷史.html:1995://   new ClickInstrumentation({ trackAttributes: config.trackAttributes }),&lt;/code&gt;&lt;/pre&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:2028:          &lt;text class=&quot;ts&quot; x=&quot;250&quot; y=&quot;192&quot; text-anchor=&quot;middle&quot;&gt;對 trackAttributes 每個名稱&lt;/text&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:2273:    new ClickInstrumentation({ trackAttributes: config.trackAttributes }),
sources/materials/4. Faro-Click-Tracking 的歷史.html:2538:  // 選用 device.type(MetaDevice 官方欄位)而非自訂 trackAttributes,是因為裝置類型並非
sources/materials/4. Faro-Click-Tracking 的歷史.html:2959:          &lt;text class=&quot;tm&quot; x=&quot;300&quot; y=&quot;159&quot; text-anchor=&quot;middle&quot;&gt;validateTrackAttributes()&lt;/text&gt;
sources/materials/6. 前後端 Trace 串接範例.html:1113:  trackAttributes: [&#x27;data-link-name&#x27;],
## ClickInstrumentation (183 matching lines)
EVIDENCE-GAP-REPORT.md:10:| `ClickInstrumentation` 的 listener、`closest()` ancestor lookup、命中欄位、空 payload 與 300 ms throttle（Lesson 2） | VERIFIED | package source + Vitest tests + release tag | 無 | 已重建於 [`sources/evidence/faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)；`faro-click-tracking` `937d4a32e725877188a8d8a223529dece0449d4d`，files `src/features/click/clickInstrumentation.ts:3-97`、test `:23-149`。 |
EVIDENCE-GAP-REPORT.md:12:| `data-panel-topic → panel_topic` normalization 與 data-* mandatory 有同一原因（Lesson 2、歷史 material） | INSUFFICIENT（因果過度擴張） | current `toPayloadKey()`、test、PR #30 說明 `event_data_...` hyphen 造成 Loki query 問題 | 沒有證據證明這也是最初 data-* mandatory 的原因 | normalization rationale VERIFIED；mandatory rationale Unknown。PR #30 merge `18464e867453dda0315ed51297bb17d1360863c6`、`clickInstrumentation.ts:25-31`；禁止把兩者合併成單一因果。 |
LEARNING-MAP.md:17:- **主線狀態：Lesson 3 從 Lesson 2 的 click handler 往上追，確認宿主應用如何透過 `initFaro()` 啟動 ClickInstrumentation，以及 package 為什麼保存同一個 Faro object**
LEARNING-MAP.md:69:#### Lesson 2 — How ClickInstrumentation Handles Browser Clicks
LEARNING-MAP.md:70:**Objective:** 從原生 click listener 往下追，理解 ClickInstrumentation 的註冊、事件篩選、欄位擷取與 telemetry 建立責任邊界。
LEARNING-MAP.md:94:**Objective:** 從宿主應用實際呼叫 `initFaro()` 開始，追到 Grafana `initializeFaro()`、ClickInstrumentation 初始化與 `document` listener 註冊；理解 package 為什麼保存已建立的 Faro object，以及為什麼重複初始化會在新 object 建立前被拒絕。
LEARNING-MAP.md:109:- `ClickInstrumentation` 是 Lesson 2 已知概念；Lesson 3 只補它在初始化流程中何時被啟動與何時註冊 `document` listener。
LEARNING-MAP.md:299:`宿主應用 → initFaro() → ensureNotInitialized() → Grafana initializeFaro(...) → 建立 Faro object → ClickInstrumentation 註冊 document listener → registerFaroInstance(faro)`
learning-map/index.html:59:    <p><strong>Lesson 2｜How ClickInstrumentation Handles Browser Clicks</strong></p>
learning-map/index.html:68:    <p>目標：從宿主應用呼叫 <code>initFaro()</code> 開始，追到 package 自己實作的 <code>ClickInstrumentation</code> 如何被 Faro 啟動；分清 listener registration、<code>handleClick</code> callback reference 與真正 callback invocation；並理解 package 如何把同一個 Faro object 的 reference 從 local <code>faro</code> 保存到 module-level <code>faroInstance</code>。</p>
learning-map/index.html:174:  ├── initializes → ClickInstrumentation.initialize()
learning-records/0001-browser-dom-event-prerequisites.md:175:`browser click → native Event / listener callback → Faro ClickInstrumentation 接手 → 讀取 target/context → 建立 Faro telemetry`
learning-records/0002-data-attribute-vs-dom-model.md:45:        │ ClickInstrumentation 透過 closest()/getAttribute() 讀取
learning-records/0002-data-attribute-vs-dom-model.md:124:若 host 要讓某個 telemetry semantic 被 ClickInstrumentation 擷取，例如 `link_name`，該值必須存在於 target → ancestor DOM path 上某個被設定於 `trackAttributes` 的 `data-*` attribute。
learning-records/0002-data-attribute-vs-dom-model.md:228:  → ClickInstrumentation 從 target/ancestor 找 data-*
learning-records/0003-dom-object-selector-hierarchy-mobile-corrections.md:172:通過這些 retrieval 後，才能把 Lesson 1 prerequisite 視為穩定，再把注意力放回 Lesson 2 的 Faro `ClickInstrumentation` 主線。
learning-records/0004-browser-runtime-host-environment.md:31:- **Lesson 2 — How ClickInstrumentation Handles Browser Clicks**
learning-records/0004-browser-runtime-host-environment.md:83:`Browser Event → ClickInstrumentation → DOM context → Faro telemetry → transport → backend pipeline`
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:3:已建立的理解：`event.currentTarget` 代表目前正在執行 listener 的 DOM object；在 Faro ClickInstrumentation 的 document listener 中就是 `document`。`event.target` 則保留這次 click 最初命中的 element，所以即使 listener 掛在 `document`，ClickInstrumentation 仍必須從 `event.target` 開始，用 `closest()` 沿 ancestor chain 找 configured `data-*` attributes。
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:5:目前 Foreman Assistant 的 `trackAttributes` 已驗證只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。
learning-records/0006-faro-instance-reference-and-click-callback-bridges.md:3:已修正並建立的理解：`initializeFaro()` 只建立一個 Faro object；`registerFaroInstance(faro)` 不會再建立第二個 instance，而是把同一個 object 的 reference 從 `initFaro()` 的 local scope 保存到 function 外的 module-level `faroInstance`，讓 package 後續程式仍能取得它。`ClickInstrumentation` 是公司 package 自己實作的 object；它的 `initialize()` 向 Browser 建立 listener registration，而該 registration 保存的 callback reference 是 `handleClick`，之後 Browser dispatch click 時才實際呼叫 `handleClick(event)`。
learning-records/0006-faro-instance-reference-and-click-callback-bridges.md:5:這表示後續教材在進入 package lifecycle 或 instrumentation 抽象以前，必須先建立 `local variable → module-level reference → 同一個 object`，以及 `ClickInstrumentation → listener registration → handleClick callback → Browser dispatch 時呼叫` 這兩條因果關係，避免直接從 API 名稱跳到抽象設計。
learning-records/0009-browser-debugging-evidence-boundaries.md:33:   - A click event breakpoint plus bounded stepping reached `ClickInstrumentation.handleClick`, `getTrackedAttributeValue`, `toPayloadKey`, and `pushEvent`.
lessons/0001-browser-click-foundation.html:138:  <p>這也是 Faro ClickInstrumentation 可以只在 <code>document</code> 放一條 listener，卻收到 descendant button click 的基礎。</p>
lessons/0001-browser-click-foundation.html:205:  <pre><code>document.addEventListener('click', ClickInstrumentation callback)
lessons/0001-browser-click-foundation.html:209:ClickInstrumentation receives Browser Event
lessons/0001-browser-click-foundation.html:280:    <a href="0002-faro-click-instrumentation.html">Lesson 2：ClickInstrumentation →</a>
lessons/0002-faro-click-instrumentation.html:6:  <title>Lesson 2｜How ClickInstrumentation Handles Browser Clicks</title>
lessons/0002-faro-click-instrumentation.html:12:  <h1>How ClickInstrumentation Handles Browser Clicks</h1>
lessons/0002-faro-click-instrumentation.html:17:    理解為什麼 listener 掛在 <code>document</code>，ClickInstrumentation 卻從 <code>event.target</code> 開始找資料；並能說出 Foreman Assistant 現在實際追蹤哪些 attribute、誰建立它、最後 payload 會送什麼。
lessons/0002-faro-click-instrumentation.html:29:  <p>ClickInstrumentation 註冊的是：</p>
lessons/0002-faro-click-instrumentation.html:49:  <p>但 ClickInstrumentation 真正想知道的是：</p>
lessons/0002-faro-click-instrumentation.html:78:  <p>ClickInstrumentation 從 <code>span</code> 往 ancestor 找：</p>
lessons/0002-faro-click-instrumentation.html:105:ClickInstrumentation reads it
lessons/0002-faro-click-instrumentation.html:134:  <p>ClickInstrumentation 會形成：</p>
lessons/0002-faro-click-instrumentation.html:160:  <p>因此不要把 user、device 誤認為 ClickInstrumentation 從 DOM 抽出的額外 click attributes。</p>
lessons/0002-faro-click-instrumentation.html:186:ClickInstrumentation.handleClick(event)
lessons/0003-package-initialization-singleton-public-api.html:17:    你要能從宿主應用呼叫 <code>initFaro()</code> 開始，追到公司 package 自己實作的 <code>ClickInstrumentation</code> 如何被啟動；看懂 listener registration 與 <code>handleClick</code> callback 的關係；並理解為什麼 package 要另外保存同一個 Faro object 的 reference。
lessons/0003-package-initialization-singleton-public-api.html:22:    <a href="0002-faro-click-instrumentation.html">Lesson 2：ClickInstrumentation 如何處理 click →</a><br>
lessons/0003-package-initialization-singleton-public-api.html:32:  → ClickInstrumentation.handleClick(event)
lessons/0003-package-initialization-singleton-public-api.html:35:  <p>現在補它的上一段：這個 <code>ClickInstrumentation</code> 是誰建立的、listener 怎麼出現，以及 package 為什麼還要保存 Faro reference。</p>
lessons/0003-package-initialization-singleton-public-api.html:69:    // package 自己建立的 ClickInstrumentation 會交給 Faro
lessons/0003-package-initialization-singleton-public-api.html:90:  <h2>3. <code>ClickInstrumentation</code> 是公司 package 自己實作的</h2>
lessons/0003-package-initialization-singleton-public-api.html:92:  <p><code>ClickInstrumentation</code> 不是 Grafana Faro SDK 直接提供的現成 click tracker。它是 <code>@sre2/faro-click-tracking</code> package 自己的程式物件，現行 implementation 位於 <code>features/click/clickInstrumentation.ts</code>。</p>
lessons/0003-package-initialization-singleton-public-api.html:96:  <pre><code>ClickInstrumentation object
lessons/0003-package-initialization-singleton-public-api.html:108:ClickInstrumentation object
lessons/0003-package-initialization-singleton-public-api.html:114:ClickInstrumentation.initialize()</code></pre>
lessons/0003-package-initialization-singleton-public-api.html:119:    這一課不用深入 Faro SDK 為什麼能啟動自訂 instrumentation。現在只需要知道責任邊界：<strong>ClickInstrumentation 是 package 寫的；Faro SDK 負責在初始化流程中啟動它。</strong>
lessons/0003-package-initialization-singleton-public-api.html:124:  <p><code>ClickInstrumentation.initialize()</code> 會做出類似這件事：</p>
lessons/0003-package-initialization-singleton-public-api.html:144:        <tr><td><code>ClickInstrumentation</code></td><td>公司 package 自己實作、負責 click tracking 的 object。</td></tr>
lessons/0003-package-initialization-singleton-public-api.html:152:  <pre><code>ClickInstrumentation.initialize()
lessons/0003-package-initialization-singleton-public-api.html:176:  → ClickInstrumentation.initialize()
lessons/0003-package-initialization-singleton-public-api.html:269:ClickInstrumentation.initialize()
lessons/0003-package-initialization-singleton-public-api.html:292:    <div class="question">Q1. <code>ClickInstrumentation</code> 是誰實作的？</div>
lessons/0003-package-initialization-singleton-public-api.html:349:    <li><code>ClickInstrumentation</code> 是公司 package 自己實作的 object，不是 Faro SDK 內建的現成 click tracker。</li>
lessons/0003-package-initialization-singleton-public-api.html:350:    <li><code>ClickInstrumentation.initialize()</code> 會建立 Browser listener registration；這條 registration 的 callback reference 是 <code>handleClick</code>。</li>
lessons/0003-package-initialization-singleton-public-api.html:358:  <p class="cite">現行行為依據：Foreman <code>src/main.ts:11-34</code>；faro-click-tracking <code>clickInstrumentation.ts:3-97</code>、<code>initFaro.ts:13-146</code>、<code>faroInstance.ts:6-47</code>。Learning repo 保存的是 verified evidence 而非私有 source 全文，因此程式骨架只呈現已驗證的真實名稱與控制關係，不冒充逐字 source。</p>
lessons/0004-user-device-environment-context.html:36:  <p>這些都不是 <code>ClickInstrumentation</code> 從 <code>data-*</code> 抽出來的 click 欄位。</p>
lessons/0004-user-device-environment-context.html:256:  → ClickInstrumentation
lessons/0004-user-device-environment-context.html:363:DOM data-* ─→ ClickInstrumentation ─→ click payload</code></pre>
lessons/0004-user-device-environment-context.html:382:        <tr><td><code>link_name</code> 正確，但 user 不對</td><td><code>getUser()</code> 與 user sync</td><td>User 不是由 ClickInstrumentation 從 DOM 抽出的。</td></tr>
lessons/0004-user-device-environment-context.html:403:      <button class="choice" data-correct="false" data-feedback-incorrect="Click attribute 是 ClickInstrumentation 從 DOM 讀取。">讀取 當前 click 屬性</button>
lessons/0004-user-device-environment-context.html:451:    <li><strong>Debug</strong> 時先判斷資料走哪一條路，再檢查對應來源；不要把 user、device、environment 都當成 ClickInstrumentation 欄位。</li>
lessons/0005-faro-browser-to-alloy-transport.html:48:ClickInstrumentation
lessons/0005-faro-browser-to-alloy-transport.html:160:    <li><code>link_name</code> 不對 → 回頭查 ClickInstrumentation / DOM data。</li>
lessons/0005-faro-browser-to-alloy-transport.html:352:ClickInstrumentation
lessons/0005-faro-browser-to-alloy-transport.html:396:        <tr><td>click event 根本沒產生</td><td>ClickInstrumentation / DOM data</td><td>資料還沒到 Transport。</td></tr>
lessons/0005-faro-browser-to-alloy-transport.html:413:    <div class="question">Q1. <code>ClickInstrumentation</code> 和 Transport 最主要的責任差異是什麼？</div>
lessons/0005-faro-browser-to-alloy-transport.html:415:      <button class="choice" data-correct="false" data-feedback-incorrect="receiver URL 是 environment resolver / Faro transport configuration 的責任，不是 ClickInstrumentation 的主要工作。">ClickInstrumentation 決定 receiver，Transport 讀 DOM</button>
lessons/0006-browser-devtools-verification.html:26:ClickInstrumentation
lessons/0006-browser-devtools-verification.html:173:  <p>這時主要看 <strong>Call Stack</strong>，必要時使用 <strong>Step into</strong> 繼續往真正 callback 走。你要找的不是某個固定行號，而是能辨識 ClickInstrumentation 行為的 evidence，例如：</p>
lessons/0006-browser-devtools-verification.html:179:  <p>如果 source map 能直接顯示 <code>faro-click-tracking</code> / <code>clickInstrumentation</code>，那會更容易；如果目前只能看到 Zone.js wrapper、無法追到 Faro callback，就要誠實記成「document click listener 已執行，但尚未把 execution path 證明到 Faro callback」。</p>
lessons/0006-browser-devtools-verification.html:184:  <pre><code>ClickInstrumentation.handleClick  main.js:131710
lessons/0006-browser-devtools-verification.html:190:col42:...  <ol><li>先從載入的 source 找 package 的 <code>clickInstrumentation</code>／<code>this.handleClick</code>；確認 callback 內有 target、tracked-attribute extraction 與 pushEvent 行為，不能只靠檔名。</li><li>在該 callback 的 <code>const target = event.target</code> 等可執行入口行左側行號欄點一下，建立 line breakpoint。它是指定 sour...
lessons/0006-browser-devtools-verification.html:191:col694:...g>真實 Faro execution 停點。</strong>補拍 pass 先從載入的 <code>main.js</code> 核對 callback，再設 line breakpoint；中間黃底是 <code>clickInstrumentation.js:29</code>（source map），底部顯示 From main.js；右側 Call Stack 從 callback 接到 <code>invokeTask</code>／<code>runTask</code>／<code>globalZoneAwareCallback</co...
lessons/0006-browser-devtools-verification.html:318:          │ ClickInstrumentation extracts
lessons/0006-browser-devtools-verification.html:439:    <li>只有找到可辨識的 ClickInstrumentation execution path，才把「Faro click callback 已執行」記成已證實。</li>
reference/0003-browser-runtime-web-apis.html:86:      <tr><td>ClickInstrumentation 怎麼找到 element？</td><td>DOM object、selector、父子關係。</td></tr>
reference/0005-devtools-workspaces-for-faro.html:62:col159:...ss="evidence-frame"><img src="../assets/lesson-6/12-devtools-faro-paused-ui.png" alt="真實 DevTools Sources 暫停在 clickInstrumentation.js 的 handleClick，右側 Scope 與 Zone.js call stack"><svg class="evidence-focus" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect...
reference/0005-devtools-workspaces-for-faro.html:72:  <p>Faro 問題：「click 真的進入 <code>ClickInstrumentation.handleClick</code> 嗎？」→ Sources。看到 Zone.js 時繼續找 wrapped callback；只有找到可辨識的 runtime frame，才作 execution claim。Debugging 完要 Resume 並移除 breakpoint，避免下一次操作一直暫停。</p>
sources/evidence/faro-click-tracking.md:20:- `ClickInstrumentation.initialize()` 在 `document` 註冊 bubbling `click` listener。非 `Element` target 直接忽略。
sources/evidence/faro-click-tracking.md:31:- `ClickInstrumentation.destroy()` 與 `UserSyncInstrumentation.destroy()` 會移除各自 listeners。裝置 detector 也有內部 `stopDeviceTypeDetection()`，但 `src/index.ts` 沒有公開 stop/dispose API；因此不能教成 host 有公開 `dispose()`。
sources/evidence/faro-click-tracking.md:47:- Click implementation: `src/faro-click-tracking/src/features/click/clickInstrumentation.ts:3-97`。
sources/evidence/faro-click-tracking.md:48:- Click tests: `src/faro-click-tracking/src/features/click/clickInstrumentation.test.ts:23-149`，覆蓋空 payload、ancestor lookup、key normalization、300 ms throttle。
sources/evidence/foreman-browser-debug-lab.md:19:      → actual ClickInstrumentation execution
sources/evidence/foreman-browser-debug-lab.md:78:      → ClickInstrumentation.handleClick    main.js:131710
sources/evidence/foreman-browser-debug-lab.md:85:- Proves the selected click passed through the Zone.js wrapper and entered the deployed Faro `ClickInstrumentation.handleClick`.
sources/evidence/foreman-browser-debug-lab.md:203:- The loaded runtime `main.js` was inspected to locate `this.handleClick`; a line breakpoint at bundle line 131710 actually paused inside `ClickInstrumentation.handleClick`. The frontend mapped it to `clickInstrumentation.js:29`; Call Stack showed Zone.js invokeTask/runTask/globalCallback/globalZoneAwareCallback. The pause reason for this image is `other`, not the initial lab's `EventListener`.
sources/evidence/foreman-browser-lab-2026-09-16.md:80:      │ ClickInstrumentation contract extracts data-link-name
sources/evidence/opensearch-field-lifecycle.md:19:- Package `ClickInstrumentation` first transforms `data-link-name` to payload key `link_name` (and `data-panel-topic` to `panel_topic`) before calling `pushEvent()`. Thus the package normalization and translator prefix are two separate layers.
sources/evidence/opensearch-field-lifecycle.md:52:- Package key transform: `faro-click-tracking/src/features/click/clickInstrumentation.ts:25-31,67-87`。
sources/evidence/raw/lesson6-click-breakpoint.json:1753:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:1809:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:1865:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:1921:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:1977:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2033:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2096:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2159:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2222:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2285:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2341:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2397:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2460:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2523:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2579:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2635:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2691:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2747:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2803:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2859:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2922:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:2992:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3062:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3132:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3202:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3279:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3363:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3454:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3545:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3629:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3706:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3790:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3874:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:3951:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4021:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4091:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4161:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4224:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4294:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4371:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4455:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4546:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4644:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4742:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4833:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:4917:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5001:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5085:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5176:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5274:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5372:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5463:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5547:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5638:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5736:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5834:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:5932:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6030:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6121:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6212:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6303:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6394:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6485:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6583:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6681:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6779:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6877:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:6968:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7059:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7143:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7227:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7311:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7402:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-click-breakpoint.json:7500:          "functionName": "ClickInstrumentation.handleClick",
sources/evidence/raw/lesson6-devtools-ui-pause.json:8:    {"functionName":"ClickInstrumentation.handleClick","line":131710,"column":29},
sources/linked/internal/faro-click-tracking.md:5:- relevant files: `src/faro-click-tracking/src/features/click/clickInstrumentation.ts`, `src/initFaro/initFaro.ts`, user/device/environment/core singleton modules and tests
sources/materials/1. PI 前端監控案例.html:1081:col63237:.../faro-click-tracking/blob/937d4a32e725877188a8d8a223529dece0449d4d/src/faro-click-tracking/src/features/click/clickInstrumentation.ts#L29-L31">修改 payload key</a></li></ul><h3>繁體中文 vs. English</h3><ul><li>在繁體中文和 English, 同一個連結, 在繁體中文是 &quot;每日生產排程&quot;, English 是 &quot;Auto-Sched...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1057:col1860:...<li><table><tbody><tr><th>Instrumentation</th><th>signal type</th><th>log 上的名稱</th><th>記錄的內容</th></tr><tr><td>ClickInstrumentation</td><td>event</td><td>click</td><td>任何有標記 trackAttributes 的元件, 被點擊時會記錄該 attribute 的 value.<br>ex. data-link-name=&quot;garmin&quot;, 會記錄 garmin </td>...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048154:...</p><p><br></p></aside></li></ul><h2>點擊含有 trackAttributes 的元素會發生什麼</h2><p>b603884d-d8f8-422e-bebd-ba8e4afc84bcclickInstrumentation1</p><ol><li>拿到 event.target，對 trackAttributes 清單裡每一個名稱，各自用 target.closest(&#x27;[data-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payl...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1076:      new ClickInstrumentation({
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1089:    // 宿主頁面 DOM 上的 attribute，無法透過 ClickInstrumentation 的 closest() 查找取得，
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1098:col1137:...23529dece0449d4d/src/faro-click-tracking/src/features/environment/environmentUrls.ts#L16-L23</a></li></ul><h2>clickInstrumentations</h2><ul><li>自定義的 Instrumentation, 繼承 BaseInstrumentation, 全域監聽點擊事件, payload 則會透過 faro.api.pushEvent() 送到 Alloy Server or 未來升級的話可以送到 OTel collector.<...
sources/materials/4. Faro-Click-Tracking 的歷史.html:1868:        &lt;p class=&quot;codehead&quot;&gt;src/faro-click-tracking/src/features/click/clickInstrumentation.ts&lt;/p&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1874:export interface ClickInstrumentationOptions {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1912:export class ClickInstrumentation extends BaseInstrumentation {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1921:  constructor(options: ClickInstrumentationOptions = {}) {
sources/materials/4. Faro-Click-Tracking 的歷史.html:1995://   new ClickInstrumentation({ trackAttributes: config.trackAttributes }),&lt;/code&gt;&lt;/pre&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:2130:              &lt;td&gt;&lt;strong&gt;獨立&lt;/strong&gt; &lt;code&gt;UserSyncInstrumentation&lt;/code&gt;,不塞進 &lt;code&gt;ClickInstrumentation&lt;/code&gt;&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:2205: * 與 ClickInstrumentation 職責分離: 本身不做任何點擊事件追蹤,只負責身分同步,
sources/materials/4. Faro-Click-Tracking 的歷史.html:2273:    new ClickInstrumentation({ trackAttributes: config.trackAttributes }),
sources/materials/4. Faro-Click-Tracking 的歷史.html:2539:  // 宿主頁面 DOM 上的 attribute,無法透過 ClickInstrumentation 的 closest() 查找取得,
sources/materials/4. Faro-Click-Tracking 的歷史.html:2840:// 供套件內任何非 instrumentation 的對外 API(不像 ClickInstrumentation 能由 Faro SDK
## closest( (50 matching lines)
EVIDENCE-GAP-REPORT.md:10:| `ClickInstrumentation` 的 listener、`closest()` ancestor lookup、命中欄位、空 payload 與 300 ms throttle（Lesson 2） | VERIFIED | package source + Vitest tests + release tag | 無 | 已重建於 [`sources/evidence/faro-click-tracking.md`](sources/evidence/faro-click-tracking.md)；`faro-click-tracking` `937d4a32e725877188a8d8a223529dece0449d4d`，files `src/features/click/clickInstrumentation.ts:3-97`、test `:23-149`。 |
EVIDENCE-GAP-REPORT.md:33:沒有另外確認的 factual defect：PrimeNG `p-button` 的 attribute 放在 host 並非錯誤；18.0.2 source 顯示 inner native button 仍以 ancestor 關係連到 host，符合 package `closest()` contract。
LEARNING-MAP.md:87:- 每個 `data-*` 從 `event.target` 透過 `closest()` 獨立往 ancestor 查找。
learning-map/index.html:60:    <p>目標：從 <code>document</code> 原生 click listener 往下追，理解 <code>trackAttributes</code>、<code>closest()</code>、payload filtering、300ms throttle 與 <code>api.pushEvent()</code> 的責任邊界。</p>
learning-records/0002-data-attribute-vs-dom-model.md:12:- `closest()` 的「往 ancestor 找」到底是什麼意思？
learning-records/0002-data-attribute-vs-dom-model.md:45:        │ ClickInstrumentation 透過 closest()/getAttribute() 讀取
learning-records/0002-data-attribute-vs-dom-model.md:70:## `closest()` mental model
learning-records/0002-data-attribute-vs-dom-model.md:72:`Element.closest(selector)` 的「closest」不是畫面上的距離，也不是找附近所有 DOM。
learning-records/0002-data-attribute-vs-dom-model.md:87:target.closest('[data-action]')
learning-records/0002-data-attribute-vs-dom-model.md:102:target.closest('[data-page]')
learning-records/0002-data-attribute-vs-dom-model.md:116:因此 ancestor 在這裡就是 parent、parent 的 parent、再更上層的 parent。`closest()` 不會往 child 找，也不會去找 sibling。
learning-records/0002-data-attribute-vs-dom-model.md:146:- 共用 context，例如 `data-page`、`data-panel-topic`，可以放 ancestor，讓 descendant clicks 透過 `closest()` 共用，不必複製到每顆 button。
learning-records/0002-data-attribute-vs-dom-model.md:195:closest() / trackAttributes 行為            → 已驗證
learning-records/0002-data-attribute-vs-dom-model.md:221:Lesson 2 已正式修正，不再只記錄 gap。教材現在在進入 `closest()` 前先建立：
learning-records/0002-data-attribute-vs-dom-model.md:236:1. `closest()` 必須先用 parent-chain 具體模型教，不可只說「往 ancestor 找」。
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:3:已建立的理解：`event.currentTarget` 代表目前正在執行 listener 的 DOM object；在 Faro ClickInstrumentation 的 document listener 中就是 `document`。`event.target` 則保留這次 click 最初命中的 element，所以即使 listener 掛在 `document`，ClickInstrumentation 仍必須從 `event.target` 開始，用 `closest()` 沿 ancestor chain 找 configured `data-*` attributes。
learning-records/0007-runtime-values-require-runtime-evidence.md:5:後續教材與 Lab 若需要具體 tracking value，必須先從當下 Browser live DOM 讀取；若 `closest('[data-link-name]')` 回傳 `null`，應把「目前 ancestor path 沒有命中」保留為有效 evidence，而不是用教材範例補值。Source model、deployed DOM 與 Network payload 必須分層驗證，再用同一個 runtime value 做 correlation。
lessons/0002-faro-click-instrumentation.html:60:  <h2>3. <code>closest()</code> 解決 ancestor 上才有 attribute 的情況</h2>
lessons/0002-faro-click-instrumentation.html:86:  <p>這就是 <code>closest('[data-link-name]')</code> 的用途。它不是找 listener，而是找「離 target 最近、具有指定 attribute 的 ancestor / self」。</p>
lessons/0002-faro-click-instrumentation.html:166:  <pre><code>closest('[data-link-name]') → not found
lessons/0002-faro-click-instrumentation.html:193:    ├── closest('[data-link-name]')
lessons/0002-faro-click-instrumentation.html:257:    <li><code>target</code> 是原始 click element，所以是 <code>closest()</code> 搜尋的起點。</li>
lessons/0003-package-initialization-singleton-public-api.html:255:  <p class="cite">下面從初始化接回 <a href="0002-faro-click-instrumentation.html">Lesson 2 的 click handling</a>；Lesson 2 再往下拆 <code>event.target</code>、<code>closest()</code> 與 payload。</p>
lessons/0004-user-device-environment-context.html:373:    <li>Click 欄位錯了：回到 <a href="0002-faro-click-instrumentation.html">Lesson 2</a>，檢查 <code>trackAttributes</code>、DOM <code>data-*</code> 與 <code>closest()</code>。</li>
lessons/0006-browser-devtools-verification.html:82:$0.closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:83:$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code></pre>
lessons/0006-browser-devtools-verification.html:90:$0.closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:100:  │ closest('[data-link-name]') 往 ancestor 找
lessons/0006-browser-devtools-verification.html:175:  <pre><code>closest('[data-link-name]')
lessons/0006-browser-devtools-verification.html:420:    <li>執行 <code>$0.closest('[data-link-name]')</code>。</li>
lessons/0006-browser-devtools-verification.html:421:    <li>執行 <code>$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code>。</li>
reference/0005-devtools-workspaces-for-faro.html:54:$0.closest('[data-link-name]')?.getAttribute('data-link-name')
sources/evidence/faro-click-tracking.md:21:- 對每一個設定的 attribute，從 `event.target`（含自身）呼叫 `closest([attribute])` 向 ancestor 查找；找到才以 `getAttribute()` 取原值，未找到的欄位省略，不是錯誤。
sources/evidence/faro-click-tracking.md:71:- 直接支援 Lesson 2（listener、`closest()`、payload、empty、throttle、`data-*` invariant）。
sources/evidence/foreman-browser-debug-lab.md:30:- `clickTarget.closest('[data-link-name]')`: the ancestor `P-BUTTON`
sources/evidence/foreman-browser-lab-2026-09-16.md:19:- `$0.closest('[data-link-name]')` 命中 ancestor `<p-button ... data-link-name="EfficiencyAbnormalReport" ...>`。
sources/evidence/foreman-browser-lab-2026-09-16.md:20:- `$0.closest('[data-link-name]')?.getAttribute('data-link-name')` 回傳 `EfficiencyAbnormalReport`。
sources/evidence/foreman-browser-lab-2026-09-16.md:26:  │ closest('[data-link-name]')
sources/evidence/foreman-integration.md:5:確認 Foreman Assistant 如何初始化 Faro、提供 user/device/click 設定，以及目前 DOM/component architecture 對 `closest()` click tracking 的實際邊界。現況與建議分開記錄。
sources/evidence/foreman-integration.md:36:- PrimeNG `18.0.2` source（tag commit `aaef4d94aabcbdbc58e0d523a52f23ae05660810`）的 `packages/primeng/src/button/button.ts` 由 `<p-button>` host render 內部 native `<button>`。Foreman 的 `data-link-name` 因此位於 custom-element host，而不是直接位於 inner button；inner button 仍以 ancestor 路徑連到 host，package 的 `element.closest('[data-link-name]')` 可找到它。
sources/linked/external/primeng-button-18.0.2.md:5:- why it matters: confirms `p-button` renders an inner native `<button>`; Foreman’s attribute on the host is an ancestor reachable by package `closest()`, not an attribute forwarded directly to the inner button.
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048241:...-422e-bebd-ba8e4afc84bcclickInstrumentation1</p><ol><li>拿到 event.target，對 trackAttributes 清單裡每一個名稱，各自用 target.closest(&#x27;[data-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payload，key 經過 toPayloadKey() 轉換（data-link-name → link_name）——這一步是因為 Loki 那端會自動加上 event_dat...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1089:    // 宿主頁面 DOM 上的 attribute，無法透過 ClickInstrumentation 的 closest() 查找取得，
sources/materials/4. Faro-Click-Tracking 的歷史.html:1789:          宣告的每個 &lt;code&gt;data-*&lt;/code&gt; 名稱各自 &lt;code&gt;closest()&lt;/code&gt; 往上找,把命中的值以&lt;strong&gt;轉換後的 key&lt;/strong&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1821:              &lt;td&gt;只支援單一標記 &lt;code&gt;data-link-name&lt;/code&gt;,&lt;code&gt;closest()&lt;/code&gt; 往上找;曾評估函式型 &lt;code&gt;getExtraFields(target)&lt;/code&gt; hook&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1823:              &lt;td&gt;改成&lt;strong&gt;宣告式清單&lt;/strong&gt; &lt;code&gt;trackAttributes: string[]&lt;/code&gt;:宿主只給要追蹤的 attribute 名稱,套件比照 &lt;code&gt;data-link-name&lt;/code&gt; 的 &lt;code&gt;closest()&lt;/code&gt; 邏輯逐一查找併入 payload&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1877:   * 開始以 closest() 往上查找最近一個帶有該 attribute 的元素(含自身),找到則將其值
sources/materials/4. Faro-Click-Tracking 的歷史.html:1905:  const marked = element.closest(`[${attributeName}]`);
sources/materials/4. Faro-Click-Tracking 的歷史.html:2029:          &lt;text class=&quot;tms&quot; x=&quot;250&quot; y=&quot;210&quot; text-anchor=&quot;middle&quot;&gt;各自 target.closest(&#x27;[name]&#x27;)&lt;/text&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:2539:  // 宿主頁面 DOM 上的 attribute,無法透過 ClickInstrumentation 的 closest() 查找取得,
## getAttribute( (18 matching lines)
assets/quiz.js:28:        const correct = btn.getAttribute('data-correct') === 'true';
assets/quiz.js:30:          if (b.getAttribute('data-correct') === 'true') {
assets/quiz.js:40:            ? (btn.getAttribute('data-feedback-correct') || '✓ 正確！')
assets/quiz.js:41:            : (btn.getAttribute('data-feedback-incorrect') || '✗ 再想想；正確答案已標示。');
assets/quiz.js:54:    const answers = (recallEl.getAttribute('data-answer') || '')
assets/quiz.js:65:          : '✗ 正確答案：' + (recallEl.getAttribute('data-answer') || '');
learning-records/0002-data-attribute-vs-dom-model.md:29:button.getAttribute('data-link-name'); // "daily-schedule"
learning-records/0002-data-attribute-vs-dom-model.md:45:        │ ClickInstrumentation 透過 closest()/getAttribute() 讀取
lessons/0006-browser-devtools-verification.html:83:$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code></pre>
lessons/0006-browser-devtools-verification.html:93:getAttribute('data-link-name')
lessons/0006-browser-devtools-verification.html:176:getAttribute('data-link-name')
lessons/0006-browser-devtools-verification.html:421:    <li>執行 <code>$0.closest('[data-link-name]')?.getAttribute('data-link-name')</code>。</li>
reference/0005-devtools-workspaces-for-faro.html:54:$0.closest('[data-link-name]')?.getAttribute('data-link-name')
sources/evidence/faro-click-tracking.md:21:- 對每一個設定的 attribute，從 `event.target`（含自身）呼叫 `closest([attribute])` 向 ancestor 查找；找到才以 `getAttribute()` 取原值，未找到的欄位省略，不是錯誤。
sources/evidence/foreman-browser-lab-2026-09-16.md:20:- `$0.closest('[data-link-name]')?.getAttribute('data-link-name')` 回傳 `EfficiencyAbnormalReport`。
sources/materials/4. Faro-Click-Tracking 的歷史.html:1909:  return marked.getAttribute(attributeName) ?? undefined;
sources/materials/4. Faro-Click-Tracking 的歷史.html:3078:      var t = root.getAttribute(&quot;data-theme&quot;);
sources/materials/4. Faro-Click-Tracking 的歷史.html:3120:      var id = a.getAttribute(&quot;href&quot;).slice(1);
## link_name (59 matching lines)
learning-records/0002-data-attribute-vs-dom-model.md:48:{ link_name: "daily-schedule" }
learning-records/0002-data-attribute-vs-dom-model.md:124:若 host 要讓某個 telemetry semantic 被 ClickInstrumentation 擷取，例如 `link_name`，該值必須存在於 target → ancestor DOM path 上某個被設定於 `trackAttributes` 的 `data-*` attribute。
learning-records/0005-click-target-currenttarget-and-faro-extraction.md:5:目前 Foreman Assistant 的 `trackAttributes` 已驗證只有 `data-link-name`。這個 attribute 由 Foreman developer 放在 template / DOM 上，Faro package 不會自行建立；package 只負責讀取並將命中的 `data-link-name` 轉成 click payload 的 `link_name`。User 與 device 資訊屬於其他 Faro metadata / instrumentation 路徑，不是 ClickInstrumentation 從 DOM 抽出的 click attributes。
learning-records/0009-browser-debugging-evidence-boundaries.md:38:   - The click POST was correlated by equality between the live DOM `data-link-name` and payload `attributes.link_name`.
lessons/0002-faro-click-instrumentation.html:137:  link_name: "MCCS"
lessons/0002-faro-click-instrumentation.html:145:link_name</code></pre>
lessons/0002-faro-click-instrumentation.html:152:└── link_name       ← data-link-name
lessons/0002-faro-click-instrumentation.html:197:    ├── found → { link_name: value }
lessons/0002-faro-click-instrumentation.html:245:      <button class="choice" data-correct="false" data-feedback-incorrect="user 是另一條 Faro state / metadata 路徑。"><code>{ link_name: "MCCS", user: "..." }</code></button>
lessons/0002-faro-click-instrumentation.html:246:      <button class="choice" data-correct="false" data-feedback-incorrect="device 是另一條 metadata 路徑。"><code>{ link_name: "MCCS", device: "tablet" }</code></button>
lessons/0002-faro-click-instrumentation.html:247:      <button class="choice" data-correct="true" data-feedback-correct="data-link-name 會 normalize 成 link_name。"><code>{ link_name: "MCCS" }</code></button>
lessons/0002-faro-click-instrumentation.html:248:      <button class="choice" data-correct="false" data-feedback-incorrect="data- prefix 會先被移除。"><code>{ data_link_name: "MCCS" }</code></button>
lessons/0002-faro-click-instrumentation.html:261:    <li><code>data-link-name="MCCS"</code> 會形成 <code>{ link_name: "MCCS" }</code>。</li>
lessons/0003-package-initialization-singleton-public-api.html:319:      <button class="choice" data-correct="false" data-feedback-incorrect="payload key normalization 是另一個問題。">避免 link_name 被重新命名</button>
lessons/0004-user-device-environment-context.html:23:  link_name: "DailyProductionSchedule"
lessons/0004-user-device-environment-context.html:273:  <pre><code>click payload.link_name  ← DOM data-* 決定
lessons/0004-user-device-environment-context.html:382:        <tr><td><code>link_name</code> 正確，但 user 不對</td><td><code>getUser()</code> 與 user sync</td><td>User 不是由 ClickInstrumentation 從 DOM 抽出的。</td></tr>
lessons/0005-faro-browser-to-alloy-transport.html:160:    <li><code>link_name</code> 不對 → 回頭查 ClickInstrumentation / DOM data。</li>
lessons/0006-browser-devtools-verification.html:310:          └─ link_name: "DailySchedule"</code></pre>
lessons/0006-browser-devtools-verification.html:312:col176:...e"><img src="../assets/lesson-6/15-devtools-click-payload-ui.png" alt="真實 POST Payload 展開 events 0 attributes link_name DailySchedule"><svg class="evidence-focus" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="21" y="20.1" width="4.8" height="2.9"/><...
lessons/0006-browser-devtools-verification.html:312:col592:...>真實 POST → Payload。</strong>選定 POST 後點 Payload；展開 events → 0 → attributes，看 <code>name="click"</code> 與 <code>link_name="DailySchedule"</code>。index 1 還有 resource event，示範一個 request 可批次帶多個 events。這是內容 correlation，不是靠 request 順序；meta 個人物件保持收合，敏感值分享前 redact。</figcaption></figure>...
lessons/0006-browser-devtools-verification.html:322:  events[0].attributes.link_name = "DailySchedule"
lessons/0006-browser-devtools-verification.html:335:col168:...徑</th><th>讀它是為了什麼</th></tr></thead><tbody><tr><td><code>events[].name / attributes</code></td><td>找 click 與相同 link_name；不能固定只查 index 0。</td></tr><tr><td><code>meta.app.name / environment</code></td><td>是哪個 app、宣告哪個環境；此次 foreman-assistant／tw-prod。</td></tr><tr><td><code>meta.page<...
lessons/0006-browser-devtools-verification.html:455:    <li>再找 <code>attributes.link_name</code>。</li>
lessons/0006-browser-devtools-verification.html:456:    <li>只有 <code>link_name</code> 等於剛才 live DOM 讀到的 <code>data-link-name</code> 值，才把這筆 POST 跟剛才 click 關聯起來。</li>
lessons/0006-browser-devtools-verification.html:496:  attributes.link_name = ?
lessons/0006-browser-devtools-verification.html:515:        <tr><td>POST Payload 有相同 <code>link_name</code></td><td>這筆 POST 可跟剛才 tracked click 關聯。</td><td>downstream storage 成功。</td></tr>
lessons/0006-browser-devtools-verification.html:544:      <button class="choice" data-correct="false" data-feedback-incorrect="看到 wrapper 不能證明 click payload 一定存在。">click payload 一定已包含 link_name</button>
lessons/0006-browser-devtools-verification.html:565:      <button class="choice" data-correct="true" data-feedback-correct="用 live DOM 的實際 data-link-name 與 Payload 的 link_name 做 correlation。">比對 Payload 的 link_name</button>
lessons/0006-browser-devtools-verification.html:592:    <li><strong>多筆 POST 不靠順序猜</strong>；用 DOM 的 <code>data-link-name</code> 與 Payload 的 <code>link_name</code> 做 correlation。</li>
reference/0005-devtools-workspaces-for-faro.html:88:     → Payload：click + 相同 link_name
sources/evidence/faro-click-tracking.md:22:- payload 只包含命中的 `trackAttributes`，不自動加入 `link_name`、`device_type` 或其他欄位。payload 為空物件時不呼叫 `pushEvent()`，也不佔用 throttle timestamp。
sources/evidence/foreman-browser-debug-lab.md:137:- `events[0].attributes.link_name`: `DailySchedule`
sources/evidence/foreman-browser-debug-lab.md:147:      = POST click attributes.link_name = DailySchedule
sources/evidence/foreman-browser-debug-lab.md:206:- Matching POST was selected by payload, not order: `events[0].name=click`, `events[0].attributes.link_name=DailySchedule`; `events[1]` was a resource event. Environment remained `tw-prod`, receiver remained `https://shixpa-peproxy00.garmin.com/alloy`.
sources/evidence/foreman-browser-debug-lab.md:218:15. `15-devtools-click-payload-ui.png` — events → click → attributes.link_name, plus separate resource event.
sources/evidence/foreman-browser-lab-2026-09-16.md:67:    - `events[0].attributes.link_name = "EfficiencyAbnormalReport"`
sources/evidence/foreman-browser-lab-2026-09-16.md:84:  events[].attributes.link_name = "EfficiencyAbnormalReport"
sources/evidence/grafana-current-state.md:15:- Both stage and prod dashboards contain click panels whose Loki queries parse `kind="event"`, `event_name="click"`, `device_type`, `event_data_link_name` and `user_id`; aggregate panels group by `event_data_link_name` and/or `device_type`.
sources/evidence/opensearch-field-lifecycle.md:19:- Package `ClickInstrumentation` first transforms `data-link-name` to payload key `link_name` (and `data-panel-topic` to `panel_topic`) before calling `pushEvent()`. Thus the package normalization and translator prefix are two separate layers.
sources/evidence/opensearch-field-lifecycle.md:32:- Stage mapping exposes `attributes.event_data_link_name` and an `attributes.event_data` `flat_object`, in addition to fields such as `attributes.kind`, `attributes.event_name`, `attributes.device_type`, `attributes.user_id`, `attributes.session_id`, `traceID`/`spanID` and top-level `traceId`/`spanId`.
sources/evidence/opensearch-field-lifecycle.md:33:- Production’s corresponding index on the stage cluster exposes `attributes.event_data_link_name` and the same principal event/device/user/trace field family; mapping shape is not identical to stage’s `flat_object` entry, so lessons must not claim mappings are byte-for-byte identical.
sources/evidence/opensearch-field-lifecycle.md:34:- Read-only field queries observed click documents with `event_name=click` and `attributes.event_data_link_name` (examples such as `DailySchedule`/`HourlyProductionUnits`; no user values copied). This confirms field presence, not a guarantee of delivery for every click.
sources/evidence/raw/lesson6-alloy-network.json:305:              "link_name": "DailySchedule"
sources/evidence/raw/lesson6-devtools-ui-network.json:438:              "link_name": "DailySchedule"
sources/materials/1. PI 前端監控案例.html:1081:col63070:...aro-click-tracking 會將自定義的 attribute name 的 data-* 前綴刪除並且將 &quot;-&quot; 改成 &quot;_&quot; ex. data-link-name → link_name 參考<a href="https://github.com/garmin-tw-mfg-eng/faro-click-tracking/blob/937d4a32e725877188a8d8a223529dece0449d4d/src/faro-click-tracking/src/features/click/cli...
sources/materials/3. Faro-Click-Tracking Introduction (for developer).html:1060:col2048370:...-link-name]&#x27;) 往上找最近的帶有該 attribute 的元素。</li><li>找到就把值放進 payload，key 經過 toPayloadKey() 轉換（data-link-name → link_name）——這一步是因為 Loki 那端會自動加上 event_data_ 前綴，若 key 本身還帶連字號會無法被 query 解析。</li><li>如果<strong>所有</strong> trackAttributes 都沒找到任何元素，這次點擊完全不送事件（payload 是空的就直接 return）。</li><...
sources/materials/4. Faro-Click-Tracking 的歷史.html:1797:          &lt;div class=&quot;rail-item&quot;&gt;&lt;span class=&quot;v&quot;&gt;v1&lt;/span&gt;&lt;span class=&quot;d&quot;&gt;抓元素自身文字 → &lt;code&gt;link_name&lt;/code&gt;&lt;/span&gt;&lt;/div&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1814:              &lt;td&gt;&lt;code&gt;link_name&lt;/code&gt; 取自被點元素&lt;strong&gt;自身直接文字節點&lt;/strong&gt;(不遞迴子孫,避免點到 &lt;code&gt;&lt;nav&gt;&lt;/code&gt; 抓到整頁文字)&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1827:              &lt;td&gt;&lt;strong&gt;&lt;code&gt;trackAttributes&lt;/code&gt; 與 &lt;code&gt;link_name&lt;/code&gt; 解耦&lt;/strong&gt;&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1828:              &lt;td&gt;&lt;code&gt;data-link-name&lt;/code&gt; / &lt;code&gt;mode(&#x27;all&#x27;|&#x27;markedOnly&#x27;)&lt;/code&gt; / 文字 fallback 三套機制並存;&lt;code&gt;trackAttributes&lt;/code&gt; 曾被當成「決定 &lt;code&gt;link_name&lt;/code&gt; 的來源」&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1829:              &lt;td&gt;機制重疊、設定複雜、行為分歧。且 &lt;code&gt;trackAttributes&lt;/code&gt; 語意上&lt;strong&gt;不必然跟 link 相關&lt;/strong&gt;(可能只是標記頁面 / 區塊),硬綁到寫死的 &lt;code&gt;link_name&lt;/code&gt; key 不合理&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1835:              &lt;td&gt;&lt;code&gt;click&lt;/code&gt; 仍固定送 &lt;code&gt;link_name&lt;/code&gt; / &lt;code&gt;device_type&lt;/code&gt; / &lt;code&gt;max_touch_points&lt;/code&gt; 三個內建欄位,再疊加 &lt;code&gt;trackAttributes&lt;/code&gt;&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1836:              &lt;td&gt;「哪些欄位是套件保證、哪些是選填」變模糊;套件不該背負「幫宿主決定 link_name / 裝置資訊怎麼算」的職責&lt;/td&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1851:        &lt;span class=&quot;label&quot;&gt;初版 link_name 的程式碼(已移除,僅供理解演進)&lt;/span&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1862://                 this.api.pushEvent(&#x27;click&#x27;, { link_name: linkName });&lt;/code&gt;&lt;/pre&gt;
sources/materials/4. Faro-Click-Tracking 的歷史.html:1888:   * (例如過去的 link_name/device_type/max_touch_points)。
sources/materials/6. 前後端 Trace 串接範例.html:1112:  // 全域點擊監聽只追蹤標記了 data-link-name 的元素，轉換為 event_data_link_name
sources/materials/7. OTel export to OpenSearch.html:1088:          - set(attributes[&quot;event_data&quot;][&quot;link_name&quot;], attributes[&quot;event_data_link_name&quot;]) where attributes[&quot;event_data_link_name&quot;] != nil
sources/materials/7. OTel export to OpenSearch.html:1089:          - delete_key(attributes, &quot;event_data_link_name&quot;)

``````