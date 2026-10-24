# CKA Resources — reviewed 2026-10-25

## Authoritative scope
- [Linux Foundation CKA](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/): current domains 10/30/15/25/20 and two-hour performance exam; re-check near registration.
- [CNCF curriculum](https://github.com/cncf/curriculum): public versioned curriculum. Historical revisions matter; do not rely on old prep guides for current weights.

## Technical knowledge
- [Kubernetes overview](https://kubernetes.io/docs/concepts/overview/): Lesson 01 purpose, operational examples and functional boundaries.
- [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/), [Objects and desired state](https://kubernetes.io/docs/concepts/overview/working-with-objects/), [Pods](https://kubernetes.io/docs/concepts/workloads/pods/): sources for later foundation Lessons.
- Further primary Kubernetes docs selected per actual lesson, not pre-written wholesale.

## Practice and signal
- [Killercoda CKA](https://killercoda.com/cka): public community scenarios. COURSE membership scenarios are paid; individual free availability and mobile terminal must be checked before assignment.
- [2025 official program changes](https://training.linuxfoundation.org/certified-kubernetes-administrator-cka-program-changes/): added/changed competencies, including Gateway API, Helm/Kustomize and extension interfaces.
- [2026 candidate experience](https://dev.to/suzuki0430/cka-certified-kubernetes-administrator-exam-report-2026-dont-rely-on-old-guides-mastering-the-534m): anecdotal reminder to cover newer competencies; no claim of exact exam questions or probability.

## Boundaries
No authenticated past exam question bank. Use original scenario tasks and attributed public practice, not leaked dumps. Mobile conceptual reading does not prove cluster execution. No learner answers yet; no mastery recorded.

## Concrete practice assignments — 2026-10-25
See [practice/index.html](practice/index.html) for eight specific assignments and their lesson mapping. Official Kubernetes task/tutorial pages are distinguished from community CKA exercises and from original conceptual questions. None is asserted to be an official past exam question. All selected instructions have been read; cluster setup/execution remains pending.

- Lesson 09: 建立並調整網站執行份數 — Kubernetes 官方操作教學: https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/
- Lesson 10: 更新版本，再回復前一版 — 社群 CKA 實作題（CKA 題庫引用的共用題）: https://github.com/bmuschko/ckad-crash-course/blob/master/exercises/11-deployment-rolling-update/instructions.md
- Lesson 15/16: 從叢集內到外部實際連到網站 — 社群 CKA 實作題（CKA 題庫引用的共用題）: https://github.com/bmuschko/ckad-crash-course/blob/master/exercises/29-service/instructions.md
- Lesson 21: 讓網站讀到指定儲存中的檔案 — Kubernetes 官方操作教學: https://kubernetes.io/docs/tutorials/configuration/configure-persistent-volume-storage/
- Lesson 26: 允許讀取 Pod，但禁止建立 Pod — 社群 CKA 實作題: https://github.com/bmuschko/cka-crash-course/blob/master/exercises/04-rbac/instructions.md
- Lesson 31: 找出並修復無法正常工作的節點 — 社群 CKA 實作題: https://github.com/bmuschko/cka-crash-course/blob/master/exercises/26-troubleshooting-worker-node/instructions.md
- Lesson 32: 修復無法安排 Pod 的管理元件 — 社群 CKA 實作題: https://github.com/bmuschko/cka-crash-course/blob/master/exercises/25-troubleshooting-control-plane/instructions.md
- Lesson 34: 修復網站連線失敗 — 社群 CKA 實作題（CKA 題庫引用的共用題）: https://github.com/bmuschko/ckad-crash-course/blob/master/exercises/30-troubleshooting-service/instructions.md

Source review notes: bmuschko CKA exercises 08/19/24 explicitly refer to CKAD-repository exercises because the skills overlap; this does not change the course's CKA target. Excluded the dynamic-binding exercise from this selected set because it describes StorageClass as namespace-scoped and includes old beta annotation/environment assumptions; use current official guidance when creating that lesson. The selected official storage exercise is single-node hostPath only. Installation exercise with old Calico version is not assigned unchanged. Preserve free learning requirement; commercial hosted labs linked by source authors are optional and not prerequisites.

## Lesson 02：映像與容器

- https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/ — 映像內容與不可直接改寫的性質。
- https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/ — 隔離執行、與整台機器的差異。
- https://kubernetes.io/docs/concepts/containers/ — Kubernetes 如何使用容器與映像。

這堂的情境題為自編觀念驗收，不標示為官方考題或已完成的操作實驗。
