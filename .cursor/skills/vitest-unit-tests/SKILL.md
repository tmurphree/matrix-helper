---
name: vitest-unit-tests
description: >-
  Add or extend Vitest unit tests in a Nuxt/Vue repo. Use when the user asks to add unit tests, fill out spec files, use mocks, or improve test coverage. Follow .cursor/rules/vitest.mdc.
---

# Vitest unit tests

Follow [vitest.mdc](../../rules/vitest.mdc) for conventions. Only change the test file unless the user asks otherwise.

# Workflow
1. Read the implementation file and list behaviors worth testing (handlers, branches, thrown errors).
2. Add or unskip a `describe` block per function or behavior.
3. Pick the **most direct** trigger per vitest.mdc `# Test directness` (direct call → emit → minimal UI → full UI).
4. For **delegation**: module-level `vi.hoisted` + thin `vi.mock`; per-test `mockImplementation`; assert the method spy.
5. In `describe` `beforeEach`, set `mockImplementation` then mount when tests share a wrapper.
6. `afterEach`: `vi.clearAllMocks()` and unmount; add `restoreAllMocks` / `unstubAllGlobals` only if the file uses `spyOn` or `stubGlobal`.
7. Run `npm test -- <spec-path>` and fix failures before finishing.

# Module scope versus per-test setup
| Module scope (once per file) | Per-test (`beforeEach` / `afterEach`) |
| --- | --- |
| `vi.hoisted` — composable mock + method spy | `mockImplementation` — fake API shape |
| `vi.mock` — wire composable export to hoisted mock | `mountSuspended` / `mount` |
| import SUT after mocks | `vi.clearAllMocks()`, `component.unmount()` |

Vitest hoists `vi.mock` before normal `const` lines run, so spies referenced in the mock factory must come from `vi.hoisted`. The mock factory cannot run inside `beforeEach`.

# Test directness
| What you are proving | Prefer |
| --- | --- |
| Utility output | Call the function with fixtures |
| Page handler → composable | Mock composable + child `$emit` (or smallest setup to render the child) |
| Child component logic | Mount the child; interact with its own UI |
| End-to-end page flow | Full UI on the page |

# Mock template

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ChildPanel from '../components/child-panel.vue';

const { runSpy, useExampleMock } = vi.hoisted(() => ({
    runSpy: vi.fn(),
    useExampleMock: vi.fn(),
}));

vi.mock('../composables/use-example', () => ({
    useExample: useExampleMock,
}));

import ExamplePage from './example.vue';

describe('ExamplePage', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof ExamplePage>>>;

    beforeEach(async (): Promise<void> => {
        useExampleMock.mockImplementation(() => ({
            run: runSpy,
            state: ref(null),
        }));

        component = await mountSuspended(ExamplePage);
    });

    afterEach((): void => {
        vi.clearAllMocks();
        component.unmount();
    });

    it('delegates run when the child emits applied', async () => {
        const payload = { id: 1 };

        // Minimal setup only if the child is behind v-if; otherwise omit.
        await component.findComponent(ChildPanel).vm.$emit('applied', payload);

        expect(runSpy).toHaveBeenCalledTimes(1);
        expect(runSpy).toHaveBeenCalledWith(payload);
    });
});
```

# Nuxt pages
- Mock composables the page calls when testing handler → collaborator wiring.
- Use `$emit` on the child named in the parent's `@event` binding instead of clicking through the child's form.
- Add shared helpers only for setup the test cannot avoid (for example one click to satisfy `v-if`).