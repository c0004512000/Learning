# Foreman clickable / interactive template inventory — 2026-09-17

Source：`garmin-tw-mfg-eng/XD-Foreman-Assistant` at `4e032babef7aa30e5d13d7a506abe208945a5dee`。完整說明與語意來源見 [調查報告](data-link-name-investigation-2026-09-17.md)。

本附件保留每個 button / anchor / explicit click-handler declaration 的 exact opening-tag snippet，並列出 input、field wrappers、selection widgets、tabs、fieldset、carousel、table / tree table 等可能產生 clickable DOM 的 component declarations。使用可處理 quoted `>` 的 tag scanner，避免 Angular template expressions 破壞 tag 邊界。

`有標記` 只表示 tag 自身宣告 `data-link-name`。`無標記` 不能單獨證明 click 無 telemetry：可能沿 ancestors 命中，其他 instrumentation 也可能發送其他 signals。Disabled state、template repetition、PrimeNG 生成的全部 native DOM / clickable headers / portal nodes、最終 business coverage 都沒有在本次 runtime 枚舉。

Table/fieldset/carousel 等 declaration 不等同每次都可 click；snippet 的 flags/handlers 需要一起讀。Wrapper 與其 inner widget 各自是 declaration，不應加總成 business actions。所有 HTML templates 都掃描；本附件不假裝可以用 source opening tags 完整枚舉所有 library-generated live DOM nodes。

直接 button / anchor declaration count：48 `p-button`（6 有標記、42 無標記）、2 native `button`（皆無標記）、2 `a`（皆無標記）。

| Source template | p-button | button | a | 自身有標記 |
|---|---:|---:|---:|---:|
| `foreman-assistant/src/app/layout/login/login.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/main.component.html` | 1 | 0 | 0 | 1 |
| `foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html` | 3 | 0 | 1 | 0 |
| `foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html` | 6 | 2 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html` | 3 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html` | 2 | 0 | 1 | 0 |
| `foreman-assistant/src/app/layout/main/system/lc-hour-reporting/lc-hour-reporting.component.html` | 1 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html` | 3 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/manual-work-hour-reporting/manual-work-hour-reporting.component.html` | 1 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html` | 6 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/vip/vip.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/layout/main/system/weekly-inbound/weekly-inbound.component.html` | 1 | 0 | 0 | 0 |
| `foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/shared/table-settings/table-settings.component.html` | 2 | 0 | 0 | 0 |
| `foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html` | 1 | 0 | 0 | 0 |
| `foreman-assistant/src/app/shared/toolbar/toolbar.component.html` | 8 | 0 | 0 | 5 |

## 1. foreman-assistant/src/app/layout/login/login.component.html:8

Tag：`p-tabs`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L8)

```html
<p-tabs [(value)]="page">
```

## 2. foreman-assistant/src/app/layout/login/login.component.html:9

Tag：`p-tablist`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L9)

```html
<p-tablist>
```

## 3. foreman-assistant/src/app/layout/login/login.component.html:10

Tag：`p-tab`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L10)

```html
<p-tab [value]="0">
```

## 4. foreman-assistant/src/app/layout/login/login.component.html:11

Tag：`p-tab`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L11)

```html
<p-tab [value]="1">
```

## 5. foreman-assistant/src/app/layout/login/login.component.html:20

Tag：`input`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L20)

```html
<input pInputText [formControl]="empIdForm.controls.account" />
```

## 6. foreman-assistant/src/app/layout/login/login.component.html:23

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L23)

```html
<p-button
                [disabled]="empIdForm.invalid"
                [loading]="loggingFlag"
                icon="pi pi-sign-in"
                (onClick)="onEmployeeIdLogin()"
              >
```

## 7. foreman-assistant/src/app/layout/login/login.component.html:43

Tag：`input`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L43)

```html
<input pInputText [formControl]="adForm.controls.account" />
```

## 8. foreman-assistant/src/app/layout/login/login.component.html:52

Tag：`input`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L52)

```html
<input
                    pInputText
                    type="password"
                    [formControl]="adForm.controls.password"
                  />
```

## 9. foreman-assistant/src/app/layout/login/login.component.html:66

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/login/login.component.html#L66)

```html
<p-button
                  [disabled]="adForm.invalid"
                  [loading]="loggingFlag"
                  (onClick)="onAdLogin()"
                >
```

## 10. foreman-assistant/src/app/layout/main/main.component.html:28

Tag：`p-carousel`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/main.component.html#L28)

```html
<p-carousel
        [value]="panel.pages"
        [numVisible]="1"
        [numScroll]="1"
        [circular]="false"
        [autoplayInterval]="0"
        [page]="0"
        showNavigators="false"
        [showIndicators]="panel.pages.length > 1"
        [indicatorStyle]="{ width: '8px', height: '8px' }"
      >
```

## 11. foreman-assistant/src/app/layout/main/main.component.html:42

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/main.component.html#L42)

```html
<p-button
                variant="text"
                styleClass="w-full text-left justify-start p-2"
                [pTooltip]="getSystemTooltip(item)"
                [attr.data-link-name]="item.subsystem"
                (onClick)="openSystemLink(panel.topic, item)"
              >
```

## 12. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:17

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L17)

```html
<p-button
            text
            [label]="'Attendance.GoToSystem' | translate"
            (onClick)="linkToSystemURL()"
          >
```

## 13. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:26

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L26)

```html
<p-table
        [value]="data?.details?.shiftOperatorInfos || []"
        responsiveLayout="scroll"
        class="w-full"
        [style.min-width.px]="600"
      >
```

## 14. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:78

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L78)

```html
<p-button
                  icon="pi pi-pencil"
                  [disabled]="!canManualUpdate"
                  (onClick)="addNote(rowData)"
                >
```

## 15. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:116

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L116)

```html
<p-table
        [value]="monthRedLightOperatorInfos"
        responsiveLayout="scroll"
        class="w-full"
        [loading]="loadingFlag"
        [style.min-width.px]="600"
      >
```

## 16. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:154

Tag：`a`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L154)

```html
<a
                  *ngIf="
                    canOpenAbnormalAttendanceDetail(detail.reason);
                    else notClickable
                  "
                  class="cursor-pointer p-button-link"
                  (click)="onOpenAbnormalAttendanceDetail(rowData, detail)"
                >
```

## 17. foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html:170

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/attendance.component.html#L170)

```html
<p-button
                *ngIf="!rowData.isConfirmed"
                outlined
                [label]="'Attendance.MonthAbnormalConfirm' | translate"
                [disabled]="!canManualUpdate"
                (onClick)="confirmMonthlyAbnormal(rowData)"
              >
```

## 18. foreman-assistant/src/app/layout/main/system/attendance/abnormal-attendance-detail-dialog/abnormal-attendance-detail-dialog.component.html:12

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/attendance/abnormal-attendance-detail-dialog/abnormal-attendance-detail-dialog.component.html#L12)

```html
<p-table [value]="details">
```

## 19. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    [columns]="visibleColumns"
    [scrollable]="true"
    responsiveLayout="scroll"
    class="col-span-12"
    scrollHeight="75vh"
  >
```

## 20. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:21

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L21)

```html
<p-button
          text
          [label]="'DailySchedule.GoToSystem' | translate"
          (onClick)="linkToDailyScheduleSystem()"
        >
```

## 21. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:31

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L31)

```html
<p-button
            *ngIf="isRedLight(data?.systemSummary?.lightStatus || '')"
            outlined
            [label]="'ConfirmAll' | translate"
            [disabled]="!canManualUpdate"
            (onClick)="saveManualInfo()"
          >
```

## 22. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:71

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L71)

```html
<p-button
                severity="danger"
                icon="pi pi-exclamation-circle"
                styleClass="pointer-events-none"
              >
```

## 23. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:78

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L78)

```html
<p-button
                severity="danger"
                icon="pi pi-angle-double-up"
                styleClass="pointer-events-none"
              >
```

## 24. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:85

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L85)

```html
<p-button
                severity="danger"
                icon="pi pi-angle-double-down"
                styleClass="pointer-events-none"
              >
```

## 25. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:204

Tag：`div`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L204)

```html
<div
                [class]="
                  rowData.note.hasDiff ? 'red-light-block' : 'normal-note-block'
                "
                *ngIf="rowData.note.currentValue"
                class="flex gap-2 items-start justify-between rounded px-2 py-1 w-56"
                (click)="
                  isLongNote(rowData.note.currentValue) &&
                    (rowData.isExpanded = !rowData.isExpanded)
                "
              >
```

## 26. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:234

Tag：`button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L234)

```html
<button *ngIf="isLongNote(rowData.note.currentValue)">
```

## 27. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:252

Tag：`div`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L252)

```html
<div
                *ngIf="rowData.pcbNote"
                class="flex gap-2 items-start justify-between rounded px-2 py-1 w-56 normal-note-block"
                (click)="
                  isLongNote(rowData.pcbNote) &&
                    (rowData.isExpanded = !rowData.isExpanded)
                "
              >
```

## 28. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:277

Tag：`button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L277)

```html
<button *ngIf="isLongNote(rowData.pcbNote)">
```

## 29. foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html:310

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/daily-schedule/daily-schedule.component.html#L310)

```html
<p-button
                outlined
                size="small"
                styleClass="!bg-white whitespace-nowrap"
                [label]="rowData.owner.ename"
                (onClick)="contactOwnerInTeams(rowData.owner.email)"
              >
```

## 30. foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 31. foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html:16

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html#L16)

```html
<p-button
            text
            [label]="'ESNLabel.GoToSystem' | translate"
            (onClick)="linkToSystemURL()"
          >
```

## 32. foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html:102

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/esn-label/esn-label.component.html#L102)

```html
<p-button
              icon="pi pi-pencil"
              [disabled]="!canManualUpdate"
              (onClick)="addNote(rowData)"
            >
```

## 33. foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 34. foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html:15

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html#L15)

```html
<p-button
            text
            [label]="'ESNLabel.GoToSystem' | translate"
            (onClick)="linkToSystemURL()"
          >
```

## 35. foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html:46

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html#L46)

```html
<p-button
            outlined
            [label]="rowData.gpn"
            (onClick)="linkToSystemURL(rowData.gpn)"
          >
```

## 36. foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html:54

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/find-part/find-part.component.html#L54)

```html
<p-button
              *ngFor="let gpn of rowData.gpN174"
              outlined
              class="col-span-6 2xl:col-span-2"
              [label]="gpn"
              (onClick)="linkToSystemURL(gpn)"
            >
```

## 37. foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html:11

Tag：`p-treetable`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html#L11)

```html
<p-treetable [value]="treeData">
```

## 38. foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html:15

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html#L15)

```html
<p-button
            text
            [label]="'JobAnalysis.GoToSystem' | translate"
            (onClick)="linkToJobAnalysisSystem()"
          >
```

## 39. foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html:59

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html#L59)

```html
<p-button
              *ngIf="rowData.type === TreeNodeType.Job"
              outlined
              [label]="rowData.jobNumber"
              (onClick)="linkToJobURL(rowData.jobNumber)"
            >
```

## 40. foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html:100

Tag：`p-treeTableToggler`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html#L100)

```html
<p-treeTableToggler [rowNode]="rowNode" />
```

## 41. foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html:127

Tag：`a`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/job-analysis/job-analysis.component.html#L127)

```html
<a
                class="cursor-pointer"
                (click)="linkToCheckOutURL(rowData.jobNumber)"
              >
```

## 42. foreman-assistant/src/app/layout/main/system/lc-hour-reporting/lc-hour-reporting.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/lc-hour-reporting/lc-hour-reporting.component.html#L2)

```html
<p-table
    [value]="data?.details?.operatorInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 43. foreman-assistant/src/app/layout/main/system/lc-hour-reporting/lc-hour-reporting.component.html:14

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/lc-hour-reporting/lc-hour-reporting.component.html#L14)

```html
<p-button
            text
            [label]="'LCHourReporting.GoToSystem' | translate"
            (onClick)="linkToSystemURL()"
          >
```

## 44. foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html#L2)

```html
<p-table
    [value]="data?.details?.workOrderInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 45. foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html:11

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html#L11)

```html
<p-button
            text
            [label]="'MachineMaintenance.GoToPnPMS' | translate"
            (onClick)="linkToPnPmsSystem()"
          >
```

## 46. foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html:51

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html#L51)

```html
<p-button
            outlined
            [label]="rowData.workOrderTitle"
            (onClick)="linkToWorkOrderURL(rowData)"
          >
```

## 47. foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html:66

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/machine-maintenance/machine-maintenance.component.html#L66)

```html
<p-button
            outlined
            size="small"
            styleClass="!bg-white whitespace-nowrap"
            [label]="rowData.owner.ename"
            (onClick)="contactOwnerInTeams(rowData.owner.email)"
          >
```

## 48. foreman-assistant/src/app/layout/main/system/manual-work-hour-reporting/manual-work-hour-reporting.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/manual-work-hour-reporting/manual-work-hour-reporting.component.html#L2)

```html
<p-table
    [value]="data?.details?.unreportingOperatorInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 49. foreman-assistant/src/app/layout/main/system/manual-work-hour-reporting/manual-work-hour-reporting.component.html:15

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/manual-work-hour-reporting/manual-work-hour-reporting.component.html#L15)

```html
<p-button
            text
            [label]="'ManualWorkHourReporting.GoToSystem' | translate"
            (onClick)="linkToSystemURL()"
          >
```

## 50. foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 51. foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html:14

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html#L14)

```html
<p-button
            text
            [label]="'MaterialTracking.GoToMaterialTrackingSystem' | translate"
            (onClick)="linkToMaterialTrackingSystem()"
          >
```

## 52. foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html:43

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/material-tracking/material-tracking.component.html#L43)

```html
<p-button
            outlined
            [label]="rowData.jobNumber + ' (' + rowData.opCode + ')'"
            (onClick)="linkToJobReportURL(rowData.jobNumber)"
          >
```

## 53. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
  >
```

## 54. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:17

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L17)

```html
<p-button
            text
            [label]="'SystemNotes.GoToInventoryReviewSystem' | translate"
            (onClick)="linkToExternalURL(inventoryReviewURL)"
          >
```

## 55. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:22

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L22)

```html
<p-button
            text
            [label]="'SystemNotes.GoToMNSystem' | translate"
            (onClick)="linkToExternalURL(mnURL)"
          >
```

## 56. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:27

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L27)

```html
<p-button
            text
            *ngIf="isDisplayCTO"
            [label]="'SystemNotes.GoToCTOSystem' | translate"
            (onClick)="linkToExternalURL(ctoURL)"
          >
```

## 57. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:74

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L74)

```html
<p-button
              *ngFor="let review of rowData.inventoryReviewInfos"
              outlined
              [label]="review.ticketNumber"
              [severity]="
                getBtnSeverity(review.lightStatus, review.isConfirmed)
              "
              (onClick)="
                linkToInventoryReworkURL(rowData.jobNumber, review.ticketNumber)
              "
            >
```

## 58. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:89

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L89)

```html
<p-button
              *ngFor="let mn of rowData.mnInfos"
              outlined
              [label]="mn.ticketNumber"
              [severity]="getBtnSeverity(mn.lightStatus, mn.isConfirmed)"
              (onClick)="linkToMnURL(rowData.jobNumber, mn.ticketNumber)"
            >
```

## 59. foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html:100

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/system-notes/system-notes.component.html#L100)

```html
<p-button
              *ngFor="let cto of rowData.ctoInfos"
              outlined
              [label]="cto.ticketNumber"
              [severity]="getBtnSeverity(cto.lightStatus, cto.isConfirmed)"
              (onClick)="linkToCtoQueryURL(rowData.jobNumber, cto.ticketNumber)"
            >
```

## 60. foreman-assistant/src/app/layout/main/system/vip/vip.component.html:2

Tag：`p-table`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/vip/vip.component.html#L2)

```html
<p-table
    [value]="data?.details?.jobInfos || []"
    responsiveLayout="scroll"
    class="col-span-12"
    selectionMode="single"
  >
```

## 61. foreman-assistant/src/app/layout/main/system/vip/vip.component.html:16

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/vip/vip.component.html#L16)

```html
<p-button
            text
            [label]="'Vip.GoToVipSystem' | translate"
            (onClick)="linkToVipSystem()"
          >
```

## 62. foreman-assistant/src/app/layout/main/system/vip/vip.component.html:42

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/vip/vip.component.html#L42)

```html
<p-button
            outlined
            [label]="rowData.jobNumber + ' (' + rowData.opCode + ')'"
            (onClick)="linkToJobVipURL(rowData.jobNumber)"
          >
```

## 63. foreman-assistant/src/app/layout/main/system/weekly-inbound/weekly-inbound.component.html:6

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/layout/main/system/weekly-inbound/weekly-inbound.component.html#L6)

```html
<p-button
        text
        [label]="'WeelyInbound.GoToWeelyInboundSystem' | translate"
        (onClick)="onLink()"
      >
```

## 64. foreman-assistant/src/app/shared/field-components/field-multiselect/field-multiselect.component.html:5

Tag：`p-multiselect`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/field-components/field-multiselect/field-multiselect.component.html#L5)

```html
<p-multiselect
    #ms
    *ngIf="formData"
    class="col-span-12 lg:col-span-10 w-full ng-dirty"
    display="chip"
    [ngClass]="
      formData.disabled
        ? '!bg-transparent !border-gray-300 !text-inherit select-disabled'
        : ''
    "
    [options]="options"
    [formControl]="formData"
    [showClear]="showClear"
    [virtualScroll]="true"
    [virtualScrollItemSize]="50"
    [autofocusFilter]="false"
    [autofocus]="false"
    [placeholder]="placeholder"
    (onChange)="onValueChange($event)"
    (onPanelShow)="onDropdownOpen(ms)"
    appendTo="body"
  />
```

## 65. foreman-assistant/src/app/shared/field-components/field-select-button/field-select-button.component.html:5

Tag：`p-selectbutton`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/field-components/field-select-button/field-select-button.component.html#L5)

```html
<p-selectbutton
    *ngIf="formData"
    class="col-span-12 lg:col-span-10 select-btn"
    [styleClass]="
      (disabled ? '!border-gray-300 !text-inherit select-btn' : '') +
      (formData.invalid ? ' btn-vailted' : '')
    "
    [formControl]="formData"
    [options]="options"
    [multiple]="multiple"
    size="small"
    (onChange)="onValueChange($event.value)"
  />
```

## 66. foreman-assistant/src/app/shared/field-components/field-togglechip/field-togglechip.component.html:1

Tag：`p-chip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/field-components/field-togglechip/field-togglechip.component.html#L1)

```html
<p-chip
  [label]="label"
  [icon]="value ? onIcon : offIcon"
  styleClass="!px-5 cursor-pointer h-11"
  (click)="toggleValue()"
>
```

## 67. foreman-assistant/src/app/shared/line-selector/line-selector.component.html:11

Tag：`p-tabs`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/line-selector/line-selector.component.html#L11)

```html
<p-tabs
          #tabsContainer
          [value]="
            selectedLineResource?.process === tabInfo.process
              ? selectedLineResource?.lineResource ?? ''
              : ''
          "
          scrollable
          class="min-w-0 grow"
          (valueChange)="onLineChange(tabInfo.process, $event)"
        >
```

## 68. foreman-assistant/src/app/shared/line-selector/line-selector.component.html:22

Tag：`p-tablist`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/line-selector/line-selector.component.html#L22)

```html
<p-tablist>
```

## 69. foreman-assistant/src/app/shared/line-selector/line-selector.component.html:36

Tag：`p-tab`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/line-selector/line-selector.component.html#L36)

```html
<p-tab
              *ngFor="let info of tabInfo.lineResources"
              [value]="info.lineResource"
              [attr.data-red-light-count]="info.redLightCount"
            >
```

## 70. foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html:2

Tag：`p-select`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html#L2)

```html
<p-select
    appendTo="body"
    class="col-span-12 w-full"
    [(ngModel)]="note.key"
    [options]="options"
    [placeholder]="'SelectReasonType' | translate"
    [autoDisplayFirst]="false"
  >
```

## 71. foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html:10

Tag：`input`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html#L10)

```html
<input
    pInputText
    *ngIf="note.key === 'Others'"
    class="col-span-12 w-full"
    [placeholder]="'InputOtherReason' | translate"
    [(ngModel)]="note.reason"
  />
```

## 72. foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html:18

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html#L18)

```html
<p-button
      [label]="'Button.Cancel' | translate"
      severity="secondary"
      class="mx-2"
      (onClick)="onCancel()"
    >
```

## 73. foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html:24

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/note-dialog/note-dialog.component.html#L24)

```html
<p-button
      [label]="'Button.Confirm' | translate"
      (onClick)="onSubmit()"
      [disabled]="disableConfirmBtn"
    >
```

## 74. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:6

Tag：`p-select`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L6)

```html
<p-select
      *ngIf="showColumnSettings"
      [options]="tableSettings.columns"
      optionLabel="header"
      optionValue="field"
      class="w-56"
      [placeholder]="
        'TableSettings.ColumnSettingsPlaceholder'
          | translate : { column: visibleColumnsLength || 'N/A' }
      "
    >
```

## 75. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:21

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L21)

```html
<p-button
              text
              [icon]="col.visible ? 'pi pi-eye' : 'pi pi-eye-slash'"
              [disabled]="col.frozen"
              (onClick)="toggleVisible(col, $event)"
            >
```

## 76. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:27

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L27)

```html
<p-button
              text
              [icon]="col.frozen ? 'pi pi-lock' : 'pi pi-lock-open'"
              [disabled]="!col.visible"
              (onClick)="toggleFrozen(col, $event)"
            >
```

## 77. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:46

Tag：`app-field-togglechip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L46)

```html
<app-field-togglechip
      *ngIf="showFilterRedLight"
      [onIcon]="'pi pi-check'"
      [label]="'RedLight' | translate"
      [(ngModel)]="tableSettings.filterRedLight"
    >
```

## 78. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:52

Tag：`app-field-togglechip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L52)

```html
<app-field-togglechip
      *ngIf="showFilterCurrentShift"
      [onIcon]="'pi pi-check'"
      [label]="'CurrentShift' | translate"
      [(ngModel)]="tableSettings.filterCurrentShift"
    >
```

## 79. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:58

Tag：`app-field-togglechip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L58)

```html
<app-field-togglechip
      *ngIf="showFilterDurationIsNotZero"
      [onIcon]="'pi pi-check'"
      [label]="'Duration ≠ 0' | translate"
      [(ngModel)]="tableSettings.filterDurationIsNotZero"
    >
```

## 80. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:64

Tag：`app-field-togglechip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L64)

```html
<app-field-togglechip
      *ngIf="showFilterIncompleted"
      [onIcon]="'pi pi-check'"
      [label]="'Incompleted' | translate"
      [(ngModel)]="tableSettings.filterIncompleted"
    >
```

## 81. foreman-assistant/src/app/shared/table-settings/table-settings.component.html:70

Tag：`app-field-togglechip`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/table-settings/table-settings.component.html#L70)

```html
<app-field-togglechip
      *ngIf="showFilterHasOutput"
      [onIcon]="'pi pi-check'"
      [label]="'HasOutput' | translate"
      [(ngModel)]="tableSettings.filterHasOutput"
    >
```

## 82. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:6

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L6)

```html
<p-button
      *ngIf="!showBackBtn"
      icon="pi pi-bars"
      size="large"
      (onClick)="visibleSidebar = true"
    >
```

## 83. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:12

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L12)

```html
<p-button
      *ngIf="showBackBtn"
      icon="pi pi-arrow-left"
      size="large"
      (onClick)="handleClickBackBtn()"
    >
```

## 84. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:21

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L21)

```html
<p-button
      icon="pi pi-cog"
      size="large"
      styleClass="mx-2"
      [disabled]="!employee"
      (onClick)="openConfig()"
    >
```

## 85. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:29

Tag：`p-splitbutton`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L29)

```html
<p-splitbutton
      [model]="userItems"
      appendTo="body"
      [style]="{ height: '3em' }"
    >
```

## 86. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:80

Tag：`p-fieldset`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L80)

```html
<p-fieldset [legend]="'UserGuide.Title' | translate" toggleable="true">
```

## 87. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:81

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L81)

```html
<p-button
        icon="pi pi-info-circle"
        [text]="true"
        styleClass="w-full !gap-4 !justify-start"
        label="{{ 'UserGuide.UserGuide' | translate }}"
        data-link-name="UserGuide.UserGuide"
        (onClick)="
          linkToExternalURL(
            'https://confluence.garmin.com/pages/viewpage.action?pageId=1789675744'
          )
        "
      >
```

## 88. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:95

Tag：`p-fieldset`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L95)

```html
<p-fieldset
      [legend]="'ReferenceDocument.Title' | translate"
      toggleable="true"
    >
```

## 89. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:99

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L99)

```html
<p-button
        *ngIf="showSdsButton"
        icon="pi pi-file-o"
        [text]="true"
        styleClass="w-full !gap-4 !justify-start"
        label="{{ 'ReferenceDocument.SDS' | translate }}"
        data-link-name="ReferenceDocument.SDS"
        (onClick)="
          linkToExternalURL(
            sdsURL
          )
        "
      >
```

## 90. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:112

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L112)

```html
<p-button
        icon="pi pi-headphones"
        [text]="true"
        styleClass="w-full !gap-4 !justify-start"
        label="{{ 'ReferenceDocument.AI' | translate }}"
        data-link-name="ReferenceDocument.AI"
        (onClick)="
          linkToExternalURL(
            'http://linxpa-dl01.garmin.com:9567/?employee_id=' + employee?.empID
          )
        "
      >
```

## 91. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:124

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L124)

```html
<p-button
        icon="pi pi-book"
        [text]="true"
        styleClass="w-full !gap-4 !justify-start"
        label="{{ 'ReferenceDocument.ForemanManual' | translate }}"
        data-link-name="ReferenceDocument.ForemanManual"
        (onClick)="
          linkToExternalURL(
            'https://t1moss.garmin.com/HR/HR_SSC/SitePages/%E9%A0%98%E7%8F%AD%E6%89%8B%E5%86%8A.aspx'
          )
        "
      >
```

## 92. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:137

Tag：`p-fieldset`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L137)

```html
<p-fieldset [legend]="'Contact.Title' | translate" toggleable="true">
```

## 93. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:138

Tag：`p-button`；`data-link-name`：有標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L138)

```html
<p-button
        icon="pi pi-envelope"
        [text]="true"
        styleClass="w-full !gap-4 !justify-start"
        label="{{ 'Contact.ContactAdministrator' | translate }}"
        data-link-name="Contact.ContactAdministrator"
        (onClick)="contactAdministrator()"
      >
```

## 94. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:148

Tag：`p-fieldset`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L148)

```html
<p-fieldset [legend]="'Language.Title' | translate" toggleable="true">
```

## 95. foreman-assistant/src/app/shared/toolbar/toolbar.component.html:149

Tag：`p-select`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/toolbar.component.html#L149)

```html
<p-select
        [options]="getLangOptions()"
        [(ngModel)]="langSelected"
        (onChange)="setLang()"
        optionLabel="name"
        appendTo="body"
      >
```

## 96. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:3

Tag：`app-field-select-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L3)

```html
<app-field-select-button
      [label]="'Config.Org' | translate"
      [formData]="configForm.controls.org"
      [options]="orgOptions"
      (onChange)="handleConfigChange()"
    >
```

## 97. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:11

Tag：`app-field-select-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L11)

```html
<app-field-select-button
      [label]="'Config.Shift' | translate"
      [formData]="configForm.controls.shiftTime"
      [options]="shiftOptions"
      (onChange)="handleConfigChange()"
    >
```

## 98. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:19

Tag：`app-field-select-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L19)

```html
<app-field-select-button
      [label]="'Config.Process' | translate"
      [formData]="configForm.controls.processes"
      [options]="processOptions"
      [multiple]="true"
      (onChange)="handleConfigChange()"
    >
```

## 99. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:28

Tag：`app-field-multiselect`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L28)

```html
<app-field-multiselect
      [label]="'Config.Line' | translate"
      [formData]="configForm.controls.lineResourceInfos"
      [options]="lineOptions"
    >
```

## 100. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:35

Tag：`app-field-multiselect`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L35)

```html
<app-field-multiselect
      [label]="'Config.Formation' | translate"
      [formData]="configForm.controls.formationInfos"
      [options]="formationOptions"
    >
```

## 101. foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html:42

Tag：`p-button`；`data-link-name`：無標記。

[Pinned source](https://github.com/garmin-tw-mfg-eng/XD-Foreman-Assistant/blob/4e032babef7aa30e5d13d7a506abe208945a5dee/foreman-assistant/src/app/shared/toolbar/config-dialog/config-dialog.component.html#L42)

```html
<p-button
      [label]="'Button.Confirm' | translate"
      [disabled]="configForm.invalid"
      (onClick)="onSaveConfig()"
      [loading]="saveLoadingFlag"
    >
```