---
name: ts-debug-logging-add
description: >-
  Specific to TypeScript or JavaScript. Adds structured debug logging with stable JSON payloads. Use when the user runs /ts-debug-logging-add, asks to add debug logs, or wants temporary filterable debugToken logging in TypeScript or JavaScript.
---

# TypeScript debug logging add

Add debug logs using a consistent, filterable payload shape.

# Payload rules for TypeScript or JavaScript
- Always include these keys in debug log payloads:
    - `message` — a descriptive message about the log. Must include the function name and the action being performed
    - `debugToken` — common across all debugging logs so they can be filtered in the logs UI
- Always include stable keys in debug log payloads
    - For nullable values, use a fallback (e.g. `?? 'nullish'`) so each key is always present
- Never send API keys to debug logging
- Never send customer personally identifiable information (PII) to debug logging

# Logger
- Use the logging call already used in the file.
- If that file has no logger, use the logger the repo already uses.
- Use `console.log(JSON.stringify(...))` only when the repo has no logger.
- Pass the payload as an object when the logger accepts an object. Call `JSON.stringify` only when the logger expects a string.

# Token
- Reuse an existing `debugToken` value from the repo.
- If none exists, add one shared constant and reference it at every new call site.
- Do not paste a new string literal at each log.

# Examples
The call below stands in for the logger already used in the file. `debugToken` is the shared binding.

Bad: `sku` may be missing from the log

```ts
logger({
    message: 'CheckoutHandler.updateBirthday - just before caching the data',
    debugToken,
    sku: body?.sku,
});
```

Good: `sku` is always present

```ts
logger({
    message: 'CheckoutHandler.updateBirthday - just before caching the data',
    debugToken,
    sku: body?.sku ?? 'nullish',
});
```

# Invoke
User runs `/ts-debug-logging-add` in Agent chat, or asks to add debug logging.
