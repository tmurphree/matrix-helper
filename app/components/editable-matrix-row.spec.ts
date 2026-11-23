import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import EditableMatrixRow from './editable-matrix-row.vue';

type MountedEditableMatrixRow = Awaited<ReturnType<typeof mountSuspended<typeof EditableMatrixRow>>>;

describe('EditableMatrixRow', () => {
    let component: MountedEditableMatrixRow;
    let rowData: number[];

    beforeEach(async (): Promise<void> => {
        rowData = [1, 2, 3];
        component = await mountSuspended(EditableMatrixRow, {
            props: { rowData },
        });
    });

    afterEach((): void => {
        component.unmount();
    });

    describe('rendering', () => {
        it('renders one input per cell with the cell value', () => {
            const inputValues = component.findAll('input').map((el) => (el.element as HTMLInputElement).value);

            expect(inputValues).toEqual(['1', '2', '3']);
        });
    });

    describe('updateCell', () => {
        it('emits update:rowData with only the edited column replaced', async () => {
            await component.findAll('input')[1]!.setValue('7');

            expect(component.emitted('update:rowData')).toEqual([[[1, 7, 3]]]);
        });

        it('does not mutate the original row array', async () => {
            await component.findAll('input')[0]!.setValue('9');

            expect(rowData).toEqual([1, 2, 3]);
        });

        it('emits update:rowData when the edited cell is negative', async () => {
            await component.findAll('input')[0]!.setValue('-5');

            expect(component.emitted('update:rowData')).toEqual([[[-5, 2, 3]]]);
        });

        it('does not replace an unfinished minus sign with 0', async () => {
            const input = component.findAll('input')[0]!;
            const element = input.element as HTMLInputElement;

            Object.defineProperty(element, 'validity', {
                configurable: true,
                value: { badInput: true },
            });
            element.value = '';

            await input.trigger('input');

            expect(component.emitted('update:rowData')).toBeUndefined();
            expect(element.value).not.toBe('0');
        });

        it('emits 0 when the cell is cleared', async () => {
            await component.findAll('input')[0]!.setValue('');

            expect(component.emitted('update:rowData')).toEqual([[[0, 2, 3]]]);
        });
    });
});
