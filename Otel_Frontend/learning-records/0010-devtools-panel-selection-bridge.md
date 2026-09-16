# Learning Record 0010 — Faro-scoped DevTools panel selection bridge

Date: 2026-09-16

## Learner-state evidence

Learner explicitly reports unfamiliarity with DevTools. Knowing panel labels or their screen positions is insufficient: the missing prerequisite is distinguishing each workspace's contents and choosing it from the debugging question.

## Teaching decision

Keep Lesson 6 as the Faro evidence-chain lab. Add a short reusable Reference for Elements, Console, Sources, and Network rather than a separate DevTools course or new mandatory Lesson.

The required capability is Faro integration/debugging, not general DevTools mastery. Bridge only the necessary concepts: panel vs detail tab, Drawer, DOM tree/breadcrumb, Console queries/messages, breakpoint/Call Stack/Scope, Network recording/filter/headers/payload/response/Waterfall.

## Durable constraints

- Explain what the workspace contains before asking the learner to operate it.
- Choose the workspace from the claim, not from memorized screen coordinates.
- Separate visible source from actual execution, registration from callback invocation, request existence from payload identity, and receiver status from downstream success.
- Keep actual DevTools screenshot collection distinct from rendered CDP evidence. The Reference now embeds four genuine workspace captures; Lesson 6 also includes breakpoint settings, actual Faro pause and request detail screenshots, each with reading focus and proof limits.

## Visual learning prerequisite

Learner explicitly says screenshots help them learn. Future Faro debug instructions should pair panel selection with a concrete real UI example and explain its content regions; a rendered field summary alone does not establish UI literacy. This is a teaching constraint, not evidence the learner can yet execute the debugging workflow independently.

Learner rejects fixed dark-blue bitmap evidence cards as inconsistent with the HTML course. Derived constraint: use the existing shared stylesheet for summaries, diagrams and callouts; reserve screenshots for actual runtime UI. Do not bake small text, a separate palette or theme into learner-facing summary images. Lesson 6 removes all six such embedded cards while preserving their raw evidence and real DevTools captures.

## Progress

Maintenance constraint clarified by the learner: adding a runtime Lab must preserve the existing lesson's explanatory sequence, complete hands-on steps, original quiz and recap. Lesson 6 is restored from main and enhanced through clearly identified in-section runtime supplements; old manual observations and the new Playwright/CDP pass are kept distinct. Future changes must compare against the baseline for unintended content loss before delivery.

No learner retrieval/practice was demonstrated in this maintenance turn. Do not mark DevTools or Lesson 6 mastered, and do not advance the main course position.
