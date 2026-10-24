# Verified basis: Service label selection

Checked 2026-10-24 against Kubernetes official Labels and Selectors and Service pages, linked in RESOURCES.md.
- Labels are key/value metadata; multiple resources may carry identical labels.
- All selector requirements must hold; additional labels on matching objects are allowed.
- Service controllers track matching Pods and update backing EndpointSlices. Selector matching alone does not demonstrate successful application connectivity.
- The lesson constrains examples to Pods and a selector-bearing Service in one namespace and isolates label matching from readiness/network diagnosis.
- Diagram arrows denote selection, not packets. Browser exercises compute predicates locally, not kubectl commands.

Teaching authority: c0004512000/Skills Learning/Learning/SKILL.md blob 5557aa7a8d30baeaa3e08994698651e0a0aa0463 and Required context read this session.
