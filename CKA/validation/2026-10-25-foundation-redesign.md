# Foundation redesign — 2026-10-25

This revision supersedes the first-Lesson content assessed in 2026-10-25-learning-skill-audit.md. It retains Learning's adaptive teaching and the user-authorized Learning-from-docs complete-map planning exception.

## Teaching decision
The previous lesson combined desired state, containers, cluster structure, Pod, namespace and commands. Adding definitions did not fix that scope. Rebuild the beginning from prerequisites:
1. Kubernetes purpose and limits.
2. Container/image and executing an application.
3. Cluster overview: execution versus coordination.
4. Pod and its relationship to containers and machines.
5. Desired/actual state and controllers.
6. Representing requirements as API objects.
7. Component collaboration along one concrete request.
8. kubectl observations and selecting the correct environment.

Seven capability chapters remain. Foundation has eight planned Lessons; whole course has 37. Only Lesson 01 is authored. No learner mastery inferred. Later operational practice and exam-style tasks remain planned after their prerequisites.

## Sources
- Kubernetes overview: https://kubernetes.io/docs/concepts/overview/
- CKA program: https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/
The CKA validates practical administrator competence. Understanding causal mechanisms supports that competence; detailed kernel/source-code study is not the starting requirement.

## Verification
Code revision: 045a5c91e8b93f3d91338945b25538865c7bf118.
Cache fix: 501cadcbf88dd4c9cc89a3b5e14e7342da44081f.

- 16 CKA HTML files: no missing local linked resources.
- Planned Lesson IDs form exactly 01–37.
- node --check and git diff --check passed.
- Six quiz choices have equal 12-character length; correct positions are second and first.
- Lesson 01 does not use Pod, Node, kubelet, API, namespace, reconciliation or kubectl as prerequisites.
- Live browser initially exposed cached old JS causing missing feedback. Added a version query to the shared script; retested the deployed page.
- Final live checks passed: unanswered hint, misconception-specific incorrect feedback, correct feedback for both questions, and clipboard export with both selections, check counts and reflection.
- New reference page loaded; its return link worked. The eight-Lesson foundation map loaded from the lesson and showed 0/8 progress.
- Desktop width 1363 showed no horizontal overflow.
- Browser testing answers are QA only, never learner evidence.

## Limit
Available browser interface has no viewport resize/device emulation capability. Mobile viewport, touch interaction, and complete network-response verification remain unverified. No cluster execution is claimed. This document does not certify every future lesson or full exam readiness.
