import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { applyMatrixTransformationMock } = vi.hoisted(() => ({
    applyMatrixTransformationMock: vi.fn(),
}));

vi.mock('../utils/apply-matrix-transformation', () => ({
    applyMatrixTransformation: applyMatrixTransformationMock,
}));

import EditingForm from './editing-form.vue';
import RowSelector from './row-selector.vue';

type MountedEditingForm = Awaited<ReturnType<typeof mountSuspended<typeof EditingForm>>>;

const MULTIPLY_ROW_SELECTOR_INDEX = 0;
const ADD_FIRST_ROW_SELECTOR_INDEX = 1;
const ADD_SECOND_ROW_SELECTOR_INDEX = 2;
const ADD_REPLACE_ROW_SELECTOR_INDEX = 3;
const MULTIPLY_RADIO_INPUT_INDEX = 0;
const MULTIPLY_VALUE_INPUT_INDEX = 1;
const ADD_FIRST_VALUE_INPUT_INDEX = 3;
const ADD_SECOND_VALUE_INPUT_INDEX = 4;
const ADD_RADIO_INPUT_INDEX = 2;

const startingMatrix: Map<number, number[]> = new Map([
    [1, [1, 2]],
    [2, [3, 4]],
    [3, [5, 6]],
]);
const resultMatrix: Map<number, number[]> = new Map([
    [1, [9, 9]],
    [2, [3, 4]],
    [3, [5, 6]],
]);
const resultSteps: Map<number, number[]>[] = [resultMatrix];

const selectRow = async ({
    component,
    selectorIndex,
    row,
}: {
    component: MountedEditingForm;
    selectorIndex: number;
    row: number;
}): Promise<void> => {
    await component.findAllComponents(RowSelector)[selectorIndex]!.vm.$emit('update:selectedRow', row);
};

const clickApplyTransformation = async (component: MountedEditingForm): Promise<void> => {
    await component.find('button').trigger('click');
};

describe('EditingForm', () => {
    let component: MountedEditingForm;

    beforeEach(async (): Promise<void> => {
        applyMatrixTransformationMock.mockImplementation(() => ({
            matrix: resultMatrix,
            steps: resultSteps,
        }));

        component = await mountSuspended(EditingForm, {
            props: { matrix: startingMatrix },
        });
    });

    afterEach((): void => {
        vi.clearAllMocks();
        component.unmount();
    });

    describe('formatCurrentMatrix', () => {
        it('shows the matrix formatted as tab-separated rows', () => {
            expect(component.find('pre').element.textContent).toBe('1\t2\n3\t4\n5\t6');
        });

        it('updates the display when the matrix prop changes', async () => {
            const nextMatrix = new Map<number, number[]>([[1, [9, 8]]]);

            await component.setProps({ matrix: nextMatrix });

            expect(component.find('pre').element.textContent).toBe('9\t8');
        });
    });

    describe('applyTransformation', () => {
        it('applies a multiply transformation with the selected row and multiplier', async () => {
            await selectRow({ component, selectorIndex: MULTIPLY_ROW_SELECTOR_INDEX, row: 2 });
            await component.findAll('input')[MULTIPLY_VALUE_INPUT_INDEX]!.setValue('3');

            await clickApplyTransformation(component);

            expect(applyMatrixTransformationMock).toHaveBeenCalledTimes(1);
            expect(applyMatrixTransformationMock).toHaveBeenCalledWith({
                matrix: startingMatrix,
                transformation: { type: 'multiply', rowId: 2, multiplier: 3 },
            });
        });

        it('applies an add transformation with the selected rows and coefficients', async () => {
            const inputs = component.findAll('input');

            await inputs[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await inputs[ADD_FIRST_VALUE_INPUT_INDEX]!.setValue('2');
            await inputs[ADD_SECOND_VALUE_INPUT_INDEX]!.setValue('-1');
            await selectRow({ component, selectorIndex: ADD_FIRST_ROW_SELECTOR_INDEX, row: 3 });
            await selectRow({ component, selectorIndex: ADD_SECOND_ROW_SELECTOR_INDEX, row: 1 });
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 3 });

            await clickApplyTransformation(component);

            expect(applyMatrixTransformationMock).toHaveBeenCalledTimes(1);
            expect(applyMatrixTransformationMock).toHaveBeenCalledWith({
                matrix: startingMatrix,
                transformation: {
                    type: 'add',
                    coefficient01: 2,
                    rowId01: 3,
                    coefficient02: -1,
                    rowId02: 1,
                    rowIdToReplace: 3,
                },
            });
        });

        it('applies a multiply transformation after switching from add back to multiply', async () => {
            const inputs = component.findAll('input');

            await inputs[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await inputs[MULTIPLY_RADIO_INPUT_INDEX]!.setValue(true);

            await clickApplyTransformation(component);

            expect(applyMatrixTransformationMock).toHaveBeenCalledTimes(1);
            expect(applyMatrixTransformationMock).toHaveBeenCalledWith({
                matrix: startingMatrix,
                transformation: { type: 'multiply', rowId: 1, multiplier: 1 },
            });
        });

        it('emits update:matrix with the transformed matrix', async () => {
            await clickApplyTransformation(component);

            expect(component.emitted('update:matrix')).toEqual([[resultMatrix]]);
        });

        it('emits transformation-applied with the transformation steps', async () => {
            await clickApplyTransformation(component);

            expect(component.emitted('transformation-applied')).toEqual([[resultSteps]]);
        });

        it('returns without applying when Apply is disabled', async () => {
            await component.findAll('input')[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 3 });

            const applyButton = component.find('button');
            // trigger() skips a disabled control, so the click handler never runs.
            applyButton.element.removeAttribute('disabled');
            await applyButton.trigger('click');

            expect(applyMatrixTransformationMock).not.toHaveBeenCalled();
            expect(component.emitted('update:matrix')).toBeUndefined();
            expect(component.emitted('transformation-applied')).toBeUndefined();
        });
    });

    describe('duplicate add source rows', () => {
        const secondSourceSelect = (): ReturnType<MountedEditingForm['find']> => {
            return component.findAllComponents(RowSelector)[ADD_SECOND_ROW_SELECTOR_INDEX]!.find('select');
        };

        it('disables Apply and marks the second source row invalid when both source rows match', async () => {
            await component.findAll('input')[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await selectRow({ component, selectorIndex: ADD_SECOND_ROW_SELECTOR_INDEX, row: 1 });

            expect(component.find('button').attributes('disabled')).toBeDefined();
            expect(secondSourceSelect().classes()).toContain('is-invalid');

            await clickApplyTransformation(component);

            expect(applyMatrixTransformationMock).not.toHaveBeenCalled();
        });

        it('enables Apply and clears the invalid state when the second source row differs', async () => {
            await component.findAll('input')[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await selectRow({ component, selectorIndex: ADD_SECOND_ROW_SELECTOR_INDEX, row: 1 });
            await selectRow({ component, selectorIndex: ADD_SECOND_ROW_SELECTOR_INDEX, row: 2 });

            expect(component.find('button').attributes('disabled')).toBeUndefined();
            expect(secondSourceSelect().classes()).not.toContain('is-invalid');
        });

        it('keeps Apply enabled for multiply when the add source rows match', async () => {
            await selectRow({ component, selectorIndex: ADD_SECOND_ROW_SELECTOR_INDEX, row: 1 });

            expect(component.find('button').attributes('disabled')).toBeUndefined();
            expect(secondSourceSelect().classes()).toContain('is-invalid');
        });
    });

    describe('add replace row outside the source rows', () => {
        const replaceSelect = (): ReturnType<MountedEditingForm['find']> => {
            return component.findAllComponents(RowSelector)[ADD_REPLACE_ROW_SELECTOR_INDEX]!.find('select');
        };

        it('disables Apply and marks the replace row invalid when it is not a source row', async () => {
            await component.findAll('input')[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 3 });

            expect(component.find('button').attributes('disabled')).toBeDefined();
            expect(replaceSelect().classes()).toContain('is-invalid');

            await clickApplyTransformation(component);

            expect(applyMatrixTransformationMock).not.toHaveBeenCalled();
        });

        it('enables Apply and clears the invalid state when the replace row is a source row', async () => {
            await component.findAll('input')[ADD_RADIO_INPUT_INDEX]!.setValue(true);
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 3 });
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 1 });

            expect(component.find('button').attributes('disabled')).toBeUndefined();
            expect(replaceSelect().classes()).not.toContain('is-invalid');
        });

        it('keeps Apply enabled for multiply when the replace row is not a source row', async () => {
            await selectRow({ component, selectorIndex: ADD_REPLACE_ROW_SELECTOR_INDEX, row: 3 });

            expect(component.find('button').attributes('disabled')).toBeUndefined();
            expect(replaceSelect().classes()).toContain('is-invalid');
        });
    });
});
