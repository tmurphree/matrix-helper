import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

const { recordStepsSpy, useMatrixHistoryMock } = vi.hoisted(() => ({
    recordStepsSpy: vi.fn(),
    useMatrixHistoryMock: vi.fn(),
}));

vi.mock('../composables/use-matrix-history', () => ({
    useMatrixHistory: useMatrixHistoryMock,
}));

import Index from './index.vue';
import EditingForm from '../components/editing-form.vue';

const clickStartTransformations = async (component: Awaited<ReturnType<typeof mountSuspended<typeof Index>>>): Promise<void> => {
    const startButton = component
        .findAll('button')
        .find((button) => button.text() === 'Start transformations');

    if (startButton === undefined) {
        throw new Error('Start transformations button was not found');
    }

    await startButton.trigger('click');
};

describe('Index', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof Index>>>;

    beforeEach(async (): Promise<void> => {
        useMatrixHistoryMock.mockImplementation(() => ({
            history: ref<Map<number, number[]>[]>([]),
            isLocalStorageEnabled: ref(false),
            recordSteps: recordStepsSpy,
            startHistory: vi.fn(),
        }));

        component = await mountSuspended(Index);
    });

    afterEach((): void => {
        vi.clearAllMocks();
        component.unmount();
    });

    describe('onTransformationApplied', () => {
        it('calls recordSteps', async () => {
            const steps = [
                new Map<number, number[]>([
                    [1, [0, 0]],
                    [2, [0, 0]],
                ]),
            ];

            await clickStartTransformations(component);
            await component.findComponent(EditingForm).vm.$emit('transformation-applied', steps);

            expect(recordStepsSpy).toHaveBeenCalledTimes(1);
            expect(recordStepsSpy).toHaveBeenCalledWith({ steps });
        });
    });

    describe.skip('startOver', () => {});

    describe.skip('startTransformations', () => {});
});