import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import EditableMatrixRow from './editable-matrix-row.vue';

describe('EditableMatrixRow', () => {
    let component: Awaited<ReturnType<typeof mountSuspended<typeof EditableMatrixRow>>>;
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
    });
});
