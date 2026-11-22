import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { useSeoMetaMock } = vi.hoisted(() => ({
    useSeoMetaMock: vi.fn(),
}));

mockNuxtImport('useSeoMeta', () => useSeoMetaMock);

import App from './app.vue';

describe('App', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof App>>>;

    beforeEach(async (): Promise<void> => {
        component = await mountSuspended(App);
    });

    afterEach((): void => {
        vi.clearAllMocks();
        component.unmount();
    });

    describe('useSeoMeta', () => {
        it('sets the site title and description', () => {
            expect(useSeoMetaMock).toHaveBeenCalledWith({
                title: 'Matrix Helper',
                description: 'Avoid common mistakes with matrix operations',
            });
        });
    });
});
