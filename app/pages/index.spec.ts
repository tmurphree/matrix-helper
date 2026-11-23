import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref, type Ref } from 'vue';

const { recordStepsSpy, resetHistorySpy, startHistorySpy, tooltipDisposeSpy, TooltipMock, useMatrixHistoryMock } =
    vi.hoisted(() => {
        const tooltipDisposeSpy = vi.fn();

        return {
            recordStepsSpy: vi.fn(),
            resetHistorySpy: vi.fn(),
            startHistorySpy: vi.fn(),
            tooltipDisposeSpy,
            TooltipMock: vi.fn(function (): { dispose: typeof tooltipDisposeSpy } {
                return { dispose: tooltipDisposeSpy };
            }),
            useMatrixHistoryMock: vi.fn(),
        };
    });

vi.mock('../composables/use-matrix-history', () => ({
    useMatrixHistory: useMatrixHistoryMock,
}));

vi.mock('bootstrap', () => ({
    Tooltip: TooltipMock,
}));

import ContentModal from '../components/content-modal.vue';
import EditableMatrixRow from '../components/editable-matrix-row.vue';
import EditingForm from '../components/editing-form.vue';
import MatrixHistorySidebar from '../components/matrix-history-sidebar.vue';
import Index from './index.vue';

type MountedIndex = Awaited<ReturnType<typeof mountSuspended<typeof Index>>>;

const findButton = ({ component, text }: { component: MountedIndex; text: string }): ReturnType<MountedIndex['find']> => {
    const button = component.findAll('button').find((el) => el.text() === text);

    if (button === undefined) {
        throw new Error(`${text} button was not found`);
    }

    return button;
};

const clickStartTransformations = async (component: MountedIndex): Promise<void> => {
    await findButton({ component, text: 'Start transformations' }).trigger('click');
};

const setColumnCount = async ({
    component,
    columnCount,
}: {
    component: MountedIndex;
    columnCount: number;
}): Promise<void> => {
    const columnCountInput = component.find('#column-count');

    await columnCountInput.setValue(String(columnCount));
    await columnCountInput.trigger('change');
    await flushPromises();
};

const getEditableRowData = (component: MountedIndex): number[][] => {
    return component.findAllComponents(EditableMatrixRow).map((el) => el.props('rowData') as number[]);
};

describe('Index', () => {
    let component: MountedIndex;
    let history: Ref<Map<number, number[]>[]>;
    let isLocalStorageEnabled: Ref<boolean>;

    beforeEach(async (): Promise<void> => {
        history = ref<Map<number, number[]>[]>([]);
        isLocalStorageEnabled = ref(false);

        useMatrixHistoryMock.mockImplementation(() => ({
            hasHistory: computed((): boolean => history.value.length > 0),
            history,
            isLocalStorageEnabled,
            recordSteps: recordStepsSpy,
            resetHistory: resetHistorySpy,
            startHistory: startHistorySpy,
        }));

        component = await mountSuspended(Index);
    });

    afterEach((): void => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
        component.unmount();
    });

    describe('onMounted', () => {
        it('sets the matrix to the last step when there is history', async () => {
            const lastStep = new Map<number, number[]>([
                [1, [0, 0]],
                [2, [0, 0]],
            ]);

            history.value = [lastStep];
            component.unmount();
            component = await mountSuspended(Index);

            expect(component.findComponent(EditingForm).props('matrix')).toEqual(lastStep);
        });
    });

    describe('onUnmounted', () => {
        it('disposes the tooltip if it is truthy', async () => {
            await setColumnCount({ component, columnCount: 3 });

            await component.unmount();

            expect(tooltipDisposeSpy).toHaveBeenCalledTimes(1);
        });
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

    describe('startTransformations', () => {
        it('starts the history with the current matrix', async () => {
            await clickStartTransformations(component);

            expect(startHistorySpy).toHaveBeenCalledTimes(1);
            expect(startHistorySpy).toHaveBeenCalledWith({
                matrix: new Map([
                    [1, [0, 0]],
                    [2, [0, 0]],
                ]),
            });
        });

        it('replaces the data entry view with the transformations view', async () => {
            await clickStartTransformations(component);

            expect(component.find('[data-name="initial-data-entry"]').exists()).toBe(false);
            expect(component.find('[data-name="add-transformations"]').exists()).toBe(true);
        });

        it('shows the history sidebar when localStorage is enabled', async () => {
            await clickStartTransformations(component);

            isLocalStorageEnabled.value = true;
            await flushPromises();

            expect(component.findComponent(MatrixHistorySidebar).exists()).toBe(true);
        });

        it('hides the history sidebar when localStorage is disabled', async () => {
            await clickStartTransformations(component);

            expect(component.findComponent(MatrixHistorySidebar).exists()).toBe(false);
        });
    });

    describe('startOver', () => {
        beforeEach(async (): Promise<void> => {
            await component.findAllComponents(EditableMatrixRow)[0]!.vm.$emit('update:rowData', [4, 5]);
            await clickStartTransformations(component);
        });

        it('resets the matrix and history and returns to data entry when the user confirms', async () => {
            vi.stubGlobal(
                'confirm',
                vi.fn(() => true)
            );

            await findButton({ component, text: 'Start over' }).trigger('click');

            expect(confirm).toHaveBeenCalledTimes(1);
            expect(confirm).toHaveBeenCalledWith('Are you sure?  This resets your matrix.');
            expect(resetHistorySpy).toHaveBeenCalledTimes(1);
            expect(component.find('[data-name="initial-data-entry"]').exists()).toBe(true);
            expect(getEditableRowData(component)).toEqual([
                [0, 0],
                [0, 0],
            ]);
        });

        it('keeps the transformations view when the user declines', async () => {
            vi.stubGlobal(
                'confirm',
                vi.fn(() => false)
            );

            await findButton({ component, text: 'Start over' }).trigger('click');

            expect(confirm).toHaveBeenCalledTimes(1);
            expect(resetHistorySpy).not.toHaveBeenCalled();
            expect(component.find('[data-name="add-transformations"]').exists()).toBe(true);
        });
    });

    describe('matrix size inputs', () => {
        it('adds a matrix row when the row count changes', async () => {
            await component.find('#row-count').setValue('3');
            await flushPromises();

            expect(getEditableRowData(component)).toEqual([
                [0, 0],
                [0, 0],
                [0, 0],
            ]);
        });

        it('adds a matrix column when the column count changes', async () => {
            await setColumnCount({ component, columnCount: 3 });

            expect(getEditableRowData(component)).toEqual([
                [0, 0, 0],
                [0, 0, 0],
            ]);
        });
    });

    describe('EditableMatrixRow', () => {
        it('stores the row data emitted by update:rowData', async () => {
            await component.findAllComponents(EditableMatrixRow)[1]!.vm.$emit('update:rowData', [6, 7]);

            expect(getEditableRowData(component)).toEqual([
                [0, 0],
                [6, 7],
            ]);
        });
    });

    describe('EditingForm', () => {
        it('stores the matrix emitted by update:matrix', async () => {
            const transformedMatrix = new Map([
                [1, [2, 0]],
                [2, [0, 1]],
            ]);

            await clickStartTransformations(component);
            await component.findComponent(EditingForm).vm.$emit('update:matrix', transformedMatrix);

            expect(component.findComponent(EditingForm).props('matrix')).toEqual(transformedMatrix);
        });
    });

    describe('ContentModal', () => {
        it('disables Start transformations while the modal is open', async () => {
            await component.findComponent(ContentModal).vm.$emit('update:open', true);

            expect(findButton({ component, text: 'Start transformations' }).attributes('disabled')).toBeDefined();
        });
    });

    describe('addIdentityMatrix', () => {
        it('appends the identity block when the button is clicked', async () => {
            await findButton({ component, text: 'Add identity matrix' }).trigger('click');

            expect(getEditableRowData(component)).toEqual([
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ]);
        });
    });

    describe('add identity matrix tooltip', () => {
        it('does not create a tooltip for a square matrix', () => {
            expect(TooltipMock).not.toHaveBeenCalled();
        });

        it('creates a tooltip and disables the button when the matrix becomes rectangular', async () => {
            await setColumnCount({ component, columnCount: 3 });

            const tooltipHost = component.find('span.d-inline-block');

            expect(TooltipMock).toHaveBeenCalledTimes(1);
            expect(TooltipMock).toHaveBeenCalledWith(tooltipHost.element, {
                title: "Can't add an identity matrix to a rectangular matrix.",
            });
            expect(tooltipHost.attributes('tabindex')).toBe('0');
            expect(findButton({ component, text: 'Add identity matrix' }).attributes('disabled')).toBeDefined();
        });

        it('disposes the tooltip when the matrix becomes square again', async () => {
            await setColumnCount({ component, columnCount: 3 });
            await setColumnCount({ component, columnCount: 2 });

            expect(tooltipDisposeSpy).toHaveBeenCalledTimes(1);
            expect(TooltipMock).toHaveBeenCalledTimes(1);
        });

        it('disposes the tooltip when the page unmounts', async () => {
            await setColumnCount({ component, columnCount: 3 });

            component.unmount();

            expect(tooltipDisposeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
