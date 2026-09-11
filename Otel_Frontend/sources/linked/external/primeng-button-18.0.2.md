# Linked external source: PrimeNG Button 18.0.2

- canonical source: https://github.com/primefaces/primeng/blob/aaef4d94aabcbdbc58e0d523a52f23ae05660810/packages/primeng/src/button/button.ts
- ref: tag `18.0.2`, commit `aaef4d94aabcbdbc58e0d523a52f23ae05660810`
- why it matters: confirms `p-button` renders an inner native `<button>`; Foreman’s attribute on the host is an ancestor reachable by package `closest()`, not an attribute forwarded directly to the inner button.
