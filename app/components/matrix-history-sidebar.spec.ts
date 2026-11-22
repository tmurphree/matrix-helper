import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import MatrixHistorySidebar from './matrix-history-sidebar.vue';

const initialMatrix: Map<number, number[]> = new Map([
    [1, [1, 2]],
    [2, [3, 4]],
]);
const secondMatrix: Map<number, number[]> = new Map([
    [1, [2, 4]],
    [2, [3, 4]],
]);

describe('MatrixHistorySidebar', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof MatrixHistorySidebar>>>;

    beforeEach(async (): Promise<void> => {
        component = await mountSuspended(MatrixHistorySidebar, {
            props: { history: [initialMatrix, secondMatrix] },
        });
    });

    afterEach((): void => {
        component.unmount();
    });

    describe('step labels', () => {
        it('labels the first entry as the initial matrix and later entries by step number', () => {
            const labels = component.findAll('li p').map((el) => el.text());

            expect(labels).toEqual(['Initial matrix', 'Step 2']);
        });
    });

    describe('toDisplayMatrix', () => {
        it('shows each matrix formatted as tab-separated rows', () => {
            const displayedMatrices = component.findAll('li pre').map((el) => el.element.textContent);

            expect(displayedMatrices).toEqual(['1\t2\n3\t4', '2\t4\n3\t4']);
        });
    });
});
